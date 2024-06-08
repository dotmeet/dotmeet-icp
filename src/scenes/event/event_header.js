const { composeWizardScene } = require("../../services/wizard_services");
const {
  generateEditableEventMessage,
  generateEditEventPhotoMessage,
} = require("../../services/message/event_message_services");

const {
  generateQuestonsMessage,
} = require("../../services/message/general_message_services");
const {
  validateMinimumLength,
  validateMaximumLength,
} = require("../../services/message/validate_message_services");
const {
  eventNameThreshold,
  eventCaptionThreshold,
  eventDescriptionThreshold,
  eventNoteThreshold,
  registrationLinkThreshold,
} = require("../../constants/events/event_info_thresholds");

const path = require("path");

const {
  cancelPosting,
  cancelEventQuestion,
} = require("../../services/bot/actions/cancel_actions");

// utils

const eventName = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter the name of the event",
      eventNameThreshold
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

      if (
        !validateMaximumLength(
          ctx,
          eventNameThreshold,
          `Please enter name less than ${eventNameThreshold} characters`
        )
      )
        return;

      ctx.session.event.name = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

const eventDescription = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter the description of the event make it minimal",
      eventDescriptionThreshold
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
        !validateMinimumLength(
          ctx,
          2,
          "Please enter valid description for the event"
        )
      )
        return;

      if (
        !validateMaximumLength(
          ctx,
          eventDescriptionThreshold,
          `Please enter description less than ${eventDescriptionThreshold} characters`
        )
      )
        return;

      ctx.session.event.description = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

const eventRegLink = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter registration link for the event",
      registrationLinkThreshold
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
        !validateMinimumLength(
          ctx,
          2,
          "Please enter valid registration link for the event"
        )
      )
        if (
          !validateMaximumLength(
            ctx,
            registrationLinkThreshold,
            `Please enter registration link less than ${registrationLinkThreshold} characters`
          )
        )
          return;

      ctx.session.event.registrationLink = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

module.exports = {
  eventName,

  eventDescription,

  eventRegLink,
};
