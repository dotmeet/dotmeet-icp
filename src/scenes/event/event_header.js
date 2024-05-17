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

const eventPoster = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(ctx, "Please send the poster of the event", 0);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.callbackQuery) {
      if (ctx.callbackQuery.data == "cancel question") {
        cancelPosting(ctx);
        return;
      }
    } else {
      if (!ctx.message.photo) {
        ctx.reply("Please send a valid poster");
        return;
      }
      // var file id of the uploaded file
      const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
      ctx.session.event.poster = fileId;

      generateEditEventPhotoMessage(ctx);

      return ctx.scene.leave();
    }
  }
);

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

const eventCaption = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter the caption of the event",
      eventCaptionThreshold
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
      // validation example
      if (
        !validateMinimumLength(
          ctx,
          2,
          "Please enter valid caption for the event"
        )
      )
        return;

      if (
        !validateMaximumLength(
          ctx,
          eventCaptionThreshold,
          `Please enter caption less than ${eventCaptionThreshold} characters`
        )
      )
        return;
      ctx.session.event.caption = ctx.message.text;
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

const eventNote = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter extra notes regarding the event for the attendees to know",
      eventNoteThreshold
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
        !validateMinimumLength(ctx, 2, "Please enter valid note for the event")
      )
        return;
      if (
        !validateMaximumLength(
          ctx,
          eventNoteThreshold,
          `Please enter note less than ${eventNoteThreshold} characters`
        )
      )
        return;

      ctx.session.event.note = ctx.message.text;
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
  eventPoster,
  eventName,
  eventCaption,
  eventDescription,
  eventNote,
  eventRegLink,
};
