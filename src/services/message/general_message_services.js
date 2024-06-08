const generateQuestonsMessage = (ctx, message, threshold) => {
  if (ctx.message) {
    ctx.deleteMessage();
  }
  ctx.reply(
    `
      <b>${message}</b>,
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
const generateBotStartMessage = (ctx) => {
  ctx.reply(
    `
Hey <b>${ctx.from.first_name}</b>👋🏻
    
🏖️ <b>Choose the place in which the event going to be held:</b>
<i>Event should be posted to appropriate dotmeet channel, and dotmeet app</i>

<b>/Dubai</b>        
       
    `,
    {
      parse_mode: "HTML",
    }
  );
};

module.exports = {
  generateQuestonsMessage,
  generateBotStartMessage,
};
