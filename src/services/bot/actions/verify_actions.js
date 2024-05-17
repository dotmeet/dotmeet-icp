const bot = require("../bot_services");
const { START_POSTING } = require("../../../utils/general_scene_types");
const { getEventById } = require("../../firestore/event_services");
const {
  validateEventSubmission,
  prepareForStoringEventIntoDB,
} = require("../../event_services");
const {
  generateEventConfirmationMessage,
  generateEventVerificationMessage,
  generateDotmeetFinalMessage,
} = require("../../message/event_message_services");
const { splitTheParameter } = require("../../../utils/string_utils");
const {
  getVerifyChnnelIdByRegion,
} = require("../../channel_services");
const { downloadAndStoreImageIntoDB } = require("../../api_services");
const { sendNewEventMessage } = require("../../firebase_messaging_services");


// this contains and all verification and confirmation actions

const completeTheEventDetailsFilling = async (ctx) => {
  // we need an validation setup here for checking if all the required fields are filled
  var errors = validateEventSubmission(ctx.session.event);
  if (errors.length > 0) {
    ctx.answerCbQuery(
      `Please make sure you have filled all the required fields.`
    );
  } else {
    ctx.deleteMessage();
    generateEventConfirmationMessage(ctx);
  }
};


// confirm the event submission by looking through the event details
const confirmEventSubmission = async (ctx) => {
  ctx.deleteMessage();
  ctx.answerCbQuery(
    "Event is send successfully, Event will be posted to dotmeet channel just after verification."
  );
  // need to store the event info in database for later usage
  var { updatedEventId, eventToStoreinDB } = await prepareForStoringEventIntoDB(
    ctx.session.event
  );
  const file = await ctx.telegram.getFileLink(ctx.session.event.poster);
  // extract file url
  const fileLink = file.href;

  downloadAndStoreImageIntoDB(fileLink, updatedEventId);

  generateEventVerificationMessage(eventToStoreinDB, updatedEventId);
  ctx.scene.enter(START_POSTING);
};



// complete the event submission after verification
const completeEventSubmission = async (ctx) => {
  var param = splitTheParameter(ctx.update.callback_query.data);
  var channelId = getVerifyChnnelIdByRegion(param["region"]);
  ctx.telegram.deleteMessage(channelId, param["messageId"]);
  // we need to fetch the event from the database and update the status to verified
  var event = await getEventById(param["eventId"]);
  generateDotmeetFinalMessage(event, param["eventId"]);
  event.id = param["eventId"];
  sendNewEventMessage(event);
};



module.exports = {
  completeTheEventDetailsFilling,
  confirmEventSubmission,
  completeEventSubmission,
};
