const { composeWizardScene } = require("../../services/wizard_services");

const {
  eventLocationThreshold,
  eventFloorThreshold,
  eventLocationNoteThreshold,
} = require("../../constants/events/event_datas");

// cancel actions
const {
  cancelPosting,
  cancelEventQuestion,
} = require("../../services/bot/actions/cancel_actions");

// services
const {
  validatePhotoMessage,
  validateQuestionMessage,
  validateIsItText,
  validateMinimumLength,
  validateMaximumLength,
  validateStartWith,
} = require("../../services/message/validate_message_services");
const {
  generateEditableEventMessage,
} = require("../../services/message/event_message_services");

const {
  generateQuestonsMessage,
} = require("../../services/message/general_message_services");

const eventLocation = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Enter the location that event happening \neg: Armani/Prive, Burj Khalifa - Lobby Level, Armani Hotel - Dubai",
      eventLocationThreshold
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
      if (!validateMinimumLength(ctx, 2, `Please enter valid location`)) return;
      if (
        !validateMaximumLength(
          ctx,
          eventLocationThreshold,
          `Location should be less than ${eventLocationThreshold} characters`
        )
      )
        return;

      ctx.session.event.location = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

const mapUrl = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Google map link to the event location\n eg:https://maps.app.goo.gl/Btj2qngoN2c1TPRH8?g_st=ic",
      0
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
      if (!validateMinimumLength(ctx, 2, `Please enter valid map url`)) return;
      if (
        !validateStartWith(
          ctx,
          "https://",
          `Please enter valid map url starting with https://`
        )
      )
        return;

      ctx.session.event.mapUrl = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);
const floor = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,

      "Enter the floor and room number of the event location \neg: Floor 1, Room 101",
      eventFloorThreshold
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
      if (!validateMinimumLength(ctx, 2, `Please enter valid information`))
        return;
      if (
        !validateMaximumLength(
          ctx,
          eventFloorThreshold,
          `should be less than ${eventFloorThreshold} characters`
        )
      )
        return;

      ctx.session.event.floor = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

const locationNote = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Enter any additional information about the event location \neg: Parking is available at the venue",
      eventLocationNoteThreshold
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
      if (!validateMinimumLength(ctx, 2, `Please enter valid information`))
        return;

      if (
        !validateMaximumLength(
          ctx,
          eventLocationNoteThreshold,
          `should be less than ${eventLocationNoteThreshold} characters`
        )
      )
        return;
      ctx.session.event.locationNote = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

module.exports = {
  eventLocation,
  mapUrl,
  floor,
  locationNote,
};
