const { composeWizardScene } = require("../../services/wizard_services");
const {
  generateEditableEventMessage,
  generateCalaenderMessage,
  generateTimeMessage,
} = require("../../services/message/event_message_services");
const {
  splitTheParameter,
  convertToReadable12HourFormat,
} = require("../../utils/string_utils");
const {
  formateDateForView,
  formatDateFor2DaysEvent,
} = require("../../utils/date_utils");
const {
  validateMinimumLength,
} = require("../../services/message/validate_message_services");
const { Markup } = require("telegraf");
const {
  cancelEventQuestion,
} = require("../../services/message/event_message_services");
const {
  generateQuestonsMessage,
} = require("../../services/message/general_message_services");
// const eventTiming = composeWizardScene(
//   (ctx) => {
//     generateTimeMessage(ctx, "Choose starting time", true, false);
//     return ctx.wizard.next();
//   },
//   async (ctx) => {
//     if (ctx.callbackQuery == undefined) {
//       return;
//     }
//     const param = splitTheParameter(ctx.callbackQuery.data);
//     console.log(param["action"]);
//     if (param["action"] == "IGNORE") {
//       ctx.answerCbQuery();
//       return;
//     } else if (param["action"] == "TIME") {
//       await ctx.deleteMessage();
//       // split the time into hour and minute
//       const time = param["time"].split("-");
//       ctx.wizard.state.startTimeReadable = convertToReadable12HourFormat(
//         time[0],
//         time[1]
//       );
//       ctx.session.event.startTime = time[0] + ":" + time[1];
//       return ctx.wizard.next();
//     } else if (param["action"] == "FORWARD") {
//       ctx.deleteMessage();
//       generateTimeMessage(ctx, "Choose starting time", false, false);
//       return;
//     } else if (param["action"] == "BACKWARD") {
//       ctx.deleteMessage();
//       generateTimeMessage(ctx, "Choose starting time", true, false);
//       return;
//     } else if (param["action"] == "CANCEL") {
//       cancelEventQuestion(ctx);
//     }
//   }
// );

// const eventDate = composeWizardScene((ctx) => {
//   ctx.reply(
//     "Enter Event Date in DD-MM-YYYY",

//   );

//   return ctx.scene.leave();
// });
const eventDate = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter the date of the event in YYYY-MM-DD"
    );
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.callbackQuery) {
      if (ctx.callbackQuery.data == "cancel question") {
        cancelEventQuestion(ctx);
        return;
      }
    } else {
      if (
        !validateMinimumLength(ctx, 2, "Please enter valid name for the event")
      )
        return;

      ctx.session.event.eventDate = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);
const eventTiming = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter the time of the event in HH:MM"
    );
    ctx.session.event.eventTime = ctx.message.text;
    return ctx.wizard.next();
  },
  (ctx) => {
    if (ctx.callbackQuery) {
      if (ctx.callbackQuery.data == "cancel question") {
        cancelEventQuestion(ctx);
        return;
      }
    } else {
      if (
        !validateMinimumLength(ctx, 2, "Please enter valid time for the event")
      )
        return;
      ctx.session.event.eventTiming = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);
module.exports = {
  eventTiming,
  eventDate,
};
