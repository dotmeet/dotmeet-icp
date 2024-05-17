const bot = require("../bot_services");
const {
  START_POSTING,
  EVENT_POSTER,
} = require("../../../utils/event_scene_types");
const { deleteEventById } = require("../../firestore/event_services");
const {
  generateEditableEventMessage,
} = require("../../message/event_message_services");
const { splitTheParameter } = require("../../../utils/string_utils");
const { populateServerEventToSession } = require("../../event_services");

const optimizeEvent = async (ctx) => {
  var param = splitTheParameter(ctx.update.callback_query.data);
  var event = await getEventById(param["eventId"]);
  populateServerEventToSession(ctx, event, param["eventId"]);
  ctx.answerCbQuery("Please check dotmeet bot to find to edit the event");
  generateEditableEventMessage(ctx);
};

const editEventDetails = async (ctx) => {
  await ctx.deleteMessage();
  generateEditableEventMessage(ctx);
};

const editEventPoster = async (ctx) => {
  ctx.scene.enter(EVENT_POSTER);
};


// repupload the image for the event
const reuploadEventPoster = async (ctx) => {
  ctx.deleteMessage();
  ctx.scene.enter(EVENT_POSTER);
};


module.exports = {
  optimizeEvent,
  editEventDetails,
  editEventPoster,
  reuploadEventPoster,
 
};
