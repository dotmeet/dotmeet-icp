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

const { Markup } = require("telegraf");
const {
  cancelEventQuestion,
} = require("../../services/message/event_message_services");

const eventTiming = composeWizardScene(
  (ctx) => {
    generateTimeMessage(ctx, "Choose starting time", true, false);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      return;
    }
    const param = splitTheParameter(ctx.callbackQuery.data);
    console.log(param["action"]);
    if (param["action"] == "IGNORE") {
      ctx.answerCbQuery();
      return;
    } else if (param["action"] == "TIME") {
      await ctx.deleteMessage();
      // split the time into hour and minute
      const time = param["time"].split("-");
      ctx.wizard.state.startTimeReadable = convertToReadable12HourFormat(
        time[0],
        time[1]
      );
      ctx.session.event.startTime = time[0] + ":" + time[1];
      generateTimeMessage(ctx, "Choose ending time", true, true);
      return ctx.wizard.next();
    } else if (param["action"] == "FORWARD") {
      ctx.deleteMessage();
      generateTimeMessage(ctx, "Choose starting time", false, false);
      return;
    } else if (param["action"] == "BACKWARD") {
      ctx.deleteMessage();
      generateTimeMessage(ctx, "Choose starting time", true, false);
      return;
    } else if (param["action"] == "CANCEL") {
      cancelEventQuestion(ctx);
    }
  },
  (ctx) => {
    if (ctx.callbackQuery == undefined) {
      return;
    }
    const param = splitTheParameter(ctx.callbackQuery.data);
    if (param["action"] == "IGNORE") {
      ctx.answerCbQuery();
      return;
    } else if (param["action"] == "TIME") {
      // split the time into hour and minute
      const time = param["time"].split("-");
      ctx.wizard.state.endTimeReadable = convertToReadable12HourFormat(
        time[0],
        time[1]
      );
      ctx.session.event.endTime = time[0] + ":" + time[1];
      ctx.session.event.eventTiming =
        ctx.wizard.state.startTimeReadable +
        " - " +
        ctx.wizard.state.endTimeReadable;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    } else if (param["action"] == "FORWARD") {
      ctx.deleteMessage();
      generateTimeMessage(ctx, "Choose ending time", false, true);
      return;
    } else if (param["action"] == "BACKWARD") {
      ctx.deleteMessage();
      generateTimeMessage(ctx, "Choose ending time", true, true);
      return;
    } else if (param["action"] == "SKIP") {
      ctx.session.event.eventTiming = ctx.wizard.state.startTimeReadable;
      generateEditableEventMessage(ctx);
      ctx.scene.leave();
    } else if (param["action"] == "CANCEL") {
      cancelEventQuestion(ctx);
    }
  }
);

const eventDate = composeWizardScene((ctx) => {
  ctx.reply(
    "Does this event is a one day event or multiple days event?",
    Markup.inlineKeyboard([
      // callback button is outdated, use text button with unique query string
      Markup.button.callback("One day event", "one_day_event"),
      Markup.button.callback("Multiple days event", "multiple_days_event"),
    ])
  );

  return ctx.scene.leave();
});

const singleDayEvent = composeWizardScene(
  (ctx) => {
    generateCalaenderMessage(ctx, "Select the event date", new Date());
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      return;
    }
    const param = splitTheParameter(ctx.callbackQuery.data);
    if (param["action"] == "IGNORE") {
      ctx.answerCbQuery();
      return;
    } else if (param["action"] == "DAY") {
      var dateString = param["date"];
      ctx.session.event.startDate = dateString;
      ctx.session.event.endDate = dateString;
      ctx.session.event.eventDate = formateDateForView(new Date(dateString));
      generateEditableEventMessage(ctx);
      ctx.scene.leave();
    } else if (param["action"] == "PREV-MONTH") {
      var date = new Date(param["date"]);
      date.setMonth(date.getMonth() - 1);
      await ctx.deleteMessage();
      generateCalaenderMessage(ctx, "Select the event date", date);
      return;
    } else if (param["action"] == "NEXT-MONTH") {
      var date = new Date(param["date"]);
      date.setMonth(date.getMonth() + 1);
      await ctx.deleteMessage();
      generateCalaenderMessage(ctx, "Select the event date", date);
      return;
    } else if (param["action"] == "CANCEL") {
      console.log("cancel");
      cancelEventQuestion(ctx);
    }
  }
);

const multipleDayEvent = composeWizardScene(
  (ctx) => {
    generateCalaenderMessage(
      ctx,
      "Select date in which event is starting",
      new Date()
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      return;
    }
    const param = splitTheParameter(ctx.callbackQuery.data);

    if (param["action"] == "IGNORE") {
      ctx.answerCbQuery();
      return;
    } else if (param["action"] == "DAY") {
      var dateString = param["date"];
      ctx.session.event.startDate = dateString;
      generateCalaenderMessage(
        ctx,
        "Select date in which event is ending",
        new Date()
      );
      return ctx.wizard.next();
    } else if (param["action"] == "PREV-MONTH") {
      var date = new Date(param["date"]);
      date.setMonth(date.getMonth() - 1);
      await ctx.deleteMessage();
      generateCalaenderMessage(ctx, "Select the event date", date);
      return;
    } else if (param["action"] == "NEXT-MONTH") {
      var date = new Date(param["date"]);
      date.setMonth(date.getMonth() + 1);
      await ctx.deleteMessage();
      generateCalaenderMessage(ctx, "Select the event date", date);
      return;
    } else if (param["action"] == "CANCEL") {
      cancelEventQuestion(ctx);
    }
  },
  async (ctx) => {
    if (ctx.callbackQuery == undefined) {
      return;
    }
    const param = splitTheParameter(ctx.callbackQuery.data);

    if (param["action"] == "IGNORE") {
      ctx.answerCbQuery();
      return;
    } else if (param["action"] == "DAY") {
      var dateString = param["date"];
      ctx.session.event.endDate = dateString;
      ctx.session.event.eventDate = formatDateFor2DaysEvent(
        new Date(ctx.session.event.startDate),
        new Date(ctx.session.event.endDate)
      );
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    } else if (param["action"] == "PREV-MONTH") {
      var date = new Date(param["date"]);
      date.setMonth(date.getMonth() - 1);
      await ctx.deleteMessage();
      generateCalaenderMessage(
        ctx,
        "Select date in which event is ending",
        date
      );
      return;
    } else if (param["action"] == "NEXT-MONTH") {
      var date = new Date(param["date"]);
      date.setMonth(date.getMonth() + 1);
      await ctx.deleteMessage();
      generateCalaenderMessage(
        ctx,
        "Select date in which event is ending",
        date
      );
      return;
    } else if (param["action"] == "CANCEL") {
      cancelEventQuestion(ctx);
    }
  }
);

module.exports = {
  eventTiming,
  eventDate,
  singleDayEvent,
  multipleDayEvent,
};
