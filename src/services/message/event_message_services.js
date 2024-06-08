const bot = require("../bot/bot_services");
const {
  findEventChannelLinkByRegion,
  getEventChannelIdByRegion,
  getVerifyChnnelIdByRegion,
  getListingChannelId,
} = require("../channel_services");

const {
  createInlineCalender,
  createInlineTimeChooser,
} = require("../calender_services");

const { createGoogleCalendarLink } = require("../calender_services");


const { escapeHTML } = require("./validate_message_services");

const generateQuestonsMessage = (ctx, message, threshold) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }
  ctx.reply(
    `
    <b>${message}</b>,
    ${threshold != 0 ? `<i>(Should be less than ${threshold})</i>` : ""}

    `,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Cancel",
              callback_data: "cancel question",
            },
          ],
        ],
      },
    }
  );
};

const generateEditEventPhotoMessage = (ctx) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }

  // need to show user uploaded photo
  ctx.replyWithPhoto(ctx.session.event.poster, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✔️ Confirm",
            callback_data: "edit_event",
          },
          {
            text: "🔼 Re-upload",
            callback_data: "reupload_event",
          },
        ],
        [
          {
            text: "❌ Cancel",
            callback_data: "cancel",
          },
        ],
      ],
    },
  });
};

const generateEditableEventMessage = (ctx) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }
  ctx.reply(populateEditableMessageDetails(ctx), {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ Done",
            callback_data: "done",
          },
        ],
        [
          {
            text: "❌ Cancel",
            callback_data: "cancel",
          },
        ],
      ],
    },
  });
};

const generateCalaenderMessage = (ctx, message, date) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }
  ctx.reply(message, createInlineCalender(date));
};

const generateTimeMessage = (ctx, message, isItFirst, skip) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }
  ctx.reply("choose", createInlineTimeChooser(isItFirst, message, skip));
};

const generateEventConfirmationMessage = (ctx) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }
  ctx.sendMessage({
    text: populateFinalMessageDetails(ctx),
    parse_mode: "HTML",

    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Post to dotmeet",
            callback_data: "confirm",
          },
        ],
        [
          {
            text: "✍🏻 Edit Details",
            callback_data: "edit_event",
          },
        ],
        [
          {
            text: "❌ Cancel",
            callback_data: "cancel",
          },
        ],
      ],
    },
  });
};
const generateEventDetailsMessage = async(ctx,events) => {
  for (const event of events) {
    const message = populateEventDetailsMessage(event);
    await ctx.reply(message, { parse_mode: 'HTML' });
  }
}
const generateEventVerificationMessage = async (event, eventId) => {
  var row = [];
  var keyboard = [];
  console.log("event id" + eventId);
  console.log("event" + event.toString());
  console.log("Verify channel id" + getVerifyChnnelIdByRegion(event.region));
  var message = await bot.telegram.sendMessage(
    getVerifyChnnelIdByRegion(event.region),
    populateVerificationMessage(event),
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    }
  );
  console.log(
    `verified_eventId:${eventId}_region:${event.region}_messageId:${message.message_id}`
  );

  row.push({
    text: "🚀 Post to dotmeet",
    callback_data: `verified_eventId:${eventId}_region:${event.region}_messageId:${message.message_id}`,
  });
  keyboard.push(row);
  row = [];
  row.push({
    text: "✍🏻 Edit",
    callback_data: "optimize",
  });
  keyboard.push(row);

  row = [];
  row.push({
    text: "␡ delete",
    callback_data: `delete_eventId:${eventId}_region:${event.region}_messageId:${message.message_id}`,
  });

  keyboard.push(row);

  // edit this message
  await bot.telegram.editMessageReplyMarkup(
    getVerifyChnnelIdByRegion(event.region),
    message.message_id,
    null,
    {
      inline_keyboard: keyboard,
    }
  );
};

const generateDotmeetFinalMessage = async (event, eventId) => {
  var row = [];
  var keyboard = [];
  row.push({
    text: "📅 Add to Calendar",
    url: createGoogleCalendarLink(event),
  });

  keyboard.push(row);
  // row = [];

  // row.push({
  //   text: "🚘 Car",
  //   url: `https://www.google.com/maps/dir/?api=1&destination=${event.location}&travelmode=driving`,
  // });
  // row.push({
  //   text: "🚶🏻‍♂️ Walk",
  //   url: `https://www.google.com/maps/dir/?api=1&destination=${event.location}&travelmode=walking`,
  // });
  // row.push({
  //   text: "🚇 Public Transport",
  //   url: `https://www.google.com/maps/dir/?api=1&destination=${event.location}&travelmode=transit`,
  // });
  // keyboard.push(row);
  row = [];
  row.push({
    text: "📩 List Event",
    url: "https://t.me/dotmeetposts",
  });

  keyboard.push(row);

  // row = [];

  // // see full events button
  // row.push({
  //   text: " 📱 Download dotmeet App",
  //   url: "https://dotmeet.app/",
  // });

  // keyboard.push(row);

  const message = await bot.telegram.sendPhoto(
    getEventChannelIdByRegion(event.region),
    event.poster,
    {
      caption: populateDotmeetFinalMessage(event),
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    }
  );

  // get the link to the channel
  const link = await findEventChannelLinkByRegion(event.region);

  // create the message link with message id
  const messageLink = `${link.split("joinchat/")[0]}${message.message_id}`;

  // add the share button to the message

  // // now edit the message including the share button and the post your event button
  // bot.telegram.editMessageReplyMarkup(
  //   getEventChannelIdByRegion(event.region),
  //   message.message_id,
  //   null,
  //   {
  //     inline_keyboard: keyboard,
  //   }
  // );

  event.isVerified = true;
  event.messageId = message.message_id;

  updateEvent(eventId, event);
};

const generateDotmeetReminderMessage = (event, message) => {
  var row = [];
  var keyboard = [];

  row.push({
    text: "📅 Add to Calendar",
    url: createGoogleCalendarLink(event),
  });
  keyboard.push(row);
  row = [];
  // get direction in google map for car, public transport and walking
  row.push({
    text: "🚘 Car",
    url: `https://www.google.com/maps/dir/?api=1&destination=${event.location}&travelmode=driving`,
  });
  row.push({
    text: "🚶🏻‍♂️ Walk",
    url: `https://www.google.com/maps/dir/?api=1&destination=${event.location}&travelmode=walking`,
  });
  row.push({
    text: "🚇 Public Transport",
    url: `https://www.google.com/maps/dir/?api=1&destination=${event.location}&travelmode=transit`,
  });
  keyboard.push(row);
  // row = [];

  // // see full events button
  // row.push({
  //   text: " 📱 Download dotmeet App",
  //   url: "https://dotmeet.app/",
  // });

  // keyboard.push(row);

  // give reply photo reminder to the event posting
  bot.telegram.sendPhoto(
    getEventChannelIdByRegion(event.region),
    event.poster,
    {
      caption: populateReminderMessage(event, message),

      parse_mode: "HTML",
      reply_to_message_id: event.messageId,
      reply_markup: {
        inline_keyboard: keyboard,
      },
    }
  );
};

// generate the message for the new listing
const generateNewListingMessage = async (listedEvent, id) => {
  var row = [];
  var keyboard = [];
  var message = populateNewListingMessage(listedEvent);

  if (message.length > 4094) {
    message = message.substring(0, 4094);
  }

  console.log("Listing channel id" + id);

  var message = await bot.telegram.sendMessage(getListingChannelId(), message, {
    parse_mode: "HTML",
  });
  row.push({
    text: "❌ delete",
    callback_data: `deletelisting_messageId:${message.message_id}_eventId:${id}`,
  });
  keyboard.push(row);

  await bot.telegram.editMessageReplyMarkup(
    getListingChannelId(),
    message.message_id,
    null,
    {
      inline_keyboard: keyboard,
    }
  );
};

// function to populate the event details in the message
function populateEditableMessageDetails(ctx) {
  return `
<b>${escapeHTML(ctx.session.event.name)}</b> /name 
     
${escapeHTML(ctx.session.event.description)} /description -
    
Register: 👉 
${escapeHTML(ctx.session.event.registrationLink)} /editregistrationlink
    
🗓️ ${
    ctx.session.event.eventDate != "Event Date"
      ? `<b>${escapeHTML(ctx.session.event.eventDate)}</b>`
      : " Event Date"
  }
    /eventDate

⏰ ${
    ctx.session.event.startTime != "Event Timing"
      ? escapeHTML(ctx.session.event.startTime)
      : "Event Timing"
  }
    /eventTiming
    
📍 <a href="${ctx.session.event.mapUrl}">${
    ctx.session.event.floor != "Floor"
      ? escapeHTML(ctx.session.event.floor)
      : ""
  } ${escapeHTML(ctx.session.event.location)} </a>
  ${
    ctx.session.event.locationNote != "Location Note"
      ? `<i>(${escapeHTML(ctx.session.event.locationNote)})</i>`
      : ""
  }
    /eventLocaltion 


      `;
}
const populateEventDetailsMessage = (event) => {
  return `
<b>${escapeHTML(event.name)}</b>

${escapeHTML(event.description)}

🗓️ <b>${escapeHTML(event.date)}</b>
⏰ <b>${event.time}</b>
📍 ${escapeHTML(event.location)}
`;

};


const populateFinalMessageDetails = (ctx) => {
  return `
<b>${escapeHTML(ctx.session.event.name)}</b>
${
  ctx.session.event.caption != "Caption"
    ? `
<b>${escapeHTML(ctx.session.event.caption)}</b>
`
    : ""
}
${escapeHTML(ctx.session.event.description)}
${
  ctx.session.event.note != "Note"
    ? `
<b>${escapeHTML(ctx.session.event.note)}</b>
`
    : ""
}
${
  ctx.session.event.registrationLink != "Registration Link"
    ? `Register: 👉
${escapeHTML(ctx.session.event.registrationLink)}   
`
    : ""
}
🗓️ <b>${escapeHTML(ctx.session.event.eventDate)}</b>
⏰ <b>${ctx.session.event.eventTiming}</b>
📍 <a href= "${ctx.session.event.mapUrl}">${
    ctx.session.event.floor != "Floor"
      ? escapeHTML(ctx.session.event.floor)
      : ""
  } ${escapeHTML(ctx.session.event.location)}</a>
${
  ctx.session.event.locationNote != "Location Note"
    ? `<i>(${escapeHTML(ctx.session.event.locationNote)})</i>`
    : ""
}
${
  ctx.session.event.organizer != "Organizer Telegram"
    ? `<i>Contact ${escapeHTML(
        ctx.session.event.organizer
      )} for further queries</i>`
    : ""
}
${
  ctx.session.event.communityName != "Community or Company Name"
    ? `
To know more👉
<b>${escapeHTML(ctx.session.event.communityName)}</b>
    `
    : ""
}
${
  ctx.session.event.communityTg != "Community or Company Telegram url"
    ? `<a href ="${ctx.session.event.communityTg}" >Telegram</a>`
    : ""
}
${
  ctx.session.event.websiteUrl != "Website Url"
    ? `<a href="${ctx.session.event.websiteUrl}">Website</a>`
    : ""
}`;
};

const populateVerificationMessage = (event) => {
  return `
<b>${escapeHTML(event.name)}</b>
${
  event.caption
    ? `
<b>${escapeHTML(event.caption)}</b>
    `
    : ""
}
${escapeHTML(event.description)}
${event.note ? `<b>${escapeHTML(event.note)}</b>` : ""}
${
  event.registrationLink
    ? `
Register: 👉
${escapeHTML(event.registrationLink)}
      
      `
    : ""
}
🗓️ <b>${escapeHTML(event.eventDate)}</b>
⏰ ${escapeHTML(event.eventTiming)}
📍 <a href="${event.mapUrl}">${
    event.floor ? escapeHTML(event.floor) : ""
  } ${escapeHTML(event.location)} </a>
    ${event.locationNote ? `<i>(${escapeHTML(event.locationNote)})</i>` : ""}
${
  event.organizer
    ? `
 <i>Contact ${escapeHTML(event.organizer)} for further queries</i>`
    : ""
}
${
  event.communityName
    ? `
To know more👉
<b>${escapeHTML(event.communityName)}</b>
    `
    : ""
}${event.communityTg ? `<a href="${event.communityTg}">Telegram </a>` : ""}
${event.websiteUrl ? `<a href="${event.websiteUrl}"> Website </a>` : ""}
    `;
};

const populateDotmeetFinalMessage = (event) => {
  return `
<b>${escapeHTML(event.name)}</b>

${escapeHTML(event.description)}
${
  event.registrationLink
    ? `
<b>Register</b>: 👉
${escapeHTML(event.registrationLink)}
      `
    : ""
}
🗓️ <b>${escapeHTML(event.eventDate)}</b>
⏰ ${escapeHTML(event.eventTiming)}
📍 <a href="${event.mapUrl}">${
    event.floor ? escapeHTML(event.floor) : ""
  } ${escapeHTML(event.location)} </a>

<i>Download the dotmeet app👇
https://dotmeet.app </i>
`;
};

// populate the reminder message

const populateReminderMessage = (event, message) => {
  return `
🔔 Reminder 🔔

This is a gentle reminder for the event “<b>${escapeHTML(
    event.name
  )}</b>” starting <b>${message}</b>.
  ${
    event.registrationLink
      ? `
<b>Register</b>: 👉
${escapeHTML(event.registrationLink)}
        `
      : ""
  }
📍 <a href="${event.mapUrl}">${
    event.floor ? escapeHTML(event.floor) : ""
  } ${escapeHTML(event.location)}</a>
  ${event.locationNote ? `<i>(${escapeHTML(event.locationNote)})</i>` : ""}
  `;
};

const populateNewListingMessage = (listedEvent) => {
  return `
<b>${escapeHTML(listedEvent.city)}</b>

<b>${escapeHTML(listedEvent.registractionUrl)}</b>

<b>${escapeHTML(listedEvent.extraInfo)}</b>
`;
};

module.exports = {
  populateDotmeetFinalMessage,
  generateQuestonsMessage,
  generateEditEventPhotoMessage,
  generateEditableEventMessage,
  generateCalaenderMessage,
  generateTimeMessage,
  generateEventConfirmationMessage,
  generateEventVerificationMessage,
  generateDotmeetFinalMessage,
  generateDotmeetReminderMessage,
  generateNewListingMessage,
  generateEventDetailsMessage,
};
