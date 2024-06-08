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
    
🏖️ <b>Welcome to Dotmeet</b>       
    `,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 Submit Event",
              callback_data: "submit_event",
            },
            {
              text: "📅 Upcoming Events",
              callback_data: "upcoming_events",
            },
          ],
        ],
      },
    }
  );
};

module.exports = {
  generateQuestonsMessage,
  generateBotStartMessage,
};
