const { composeWizardScene } = require("../../services/wizard_services");
const {
  generateEditableEventMessage,
} = require("../../services/message/event_message_services");

const {
  generateQuestonsMessage,
} = require("../../services/message/general_message_services");
const {
  cancelPosting,
  cancelEventQuestion,
} = require("../../services/bot/actions/cancel_actions");

const {
  validatePhotoMessage,
  validateQuestionMessage,
  validateIsItText,
  validateMinimumLength,
  validateMaximumLength,
  validateStartWith,
} = require("../../services/message/validate_message_services");

const {
  eventOrganizerThreshold,
  communityNameThreshold,
} = require("../../constants/events/event_info_thresholds");

const organizertg = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Enter telegram user id of the organizer (eg: @vitalik)",
      eventOrganizerThreshold
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

      if (!validateMinimumLength(ctx, 2, `Please enter valid user id`)) return;
      if (
        !validateStartWith(
          ctx,
          "@",
          `Please enter valid user id starting with @`
        )
      )
        return;
      if (
        !validateMaximumLength(
          ctx,
          eventOrganizerThreshold,
          `Please enter valid user id less than ${eventOrganizerThreshold} characters`
        )
      )
        return;

      ctx.session.event.organizer = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

const communityName = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter the community or comapny, that hosting the event \neg:dotmeet",
      communityNameThreshold
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
          `Please enter valid company or community name`
        )
      )
        return;
      if (
        !validateMaximumLength(
          ctx,
          communityNameThreshold,
          `Please enter valid company or community name less than ${communityNameThreshold} characters`
        )
      )
        return;
      ctx.session.event.communityName = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);
const communityTg = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter telegram user id of the community or company, that hosting the event \n eg:https://t.me/dotmeetdubai",
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
      if (
        !validateMinimumLength(
          ctx,
          2,
          `Please enter valid telegram id of the company`
        )
      )
        return;
      if (
        !validateStartWith(
          ctx,
          "https://t.me/",
          `Please enter valid telegram id starting with https://t.me/`
        )
      )
        return;

      ctx.session.event.communityTg = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

const websiteUrl = composeWizardScene(
  (ctx) => {
    generateQuestonsMessage(
      ctx,
      "Please enter website url of the community or company, that hosting the event eg:https://dotmeet.app",
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
      if (!validateMinimumLength(ctx, 2, `Please enter valid website url`))
        return;
      if (
        !validateStartWith(
          ctx,
          "https://",
          `Please enter valid website url starting with https://`
        )
      )
        return;

      ctx.session.event.websiteUrl = ctx.message.text;
      generateEditableEventMessage(ctx);
      return ctx.scene.leave();
    }
  }
);

module.exports = {
  organizertg,
  communityName,
  communityTg,
  websiteUrl,
};
