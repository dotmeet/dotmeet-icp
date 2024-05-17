const bot = require("../bot_services");
const { START_POSTING } = require("../../../utils/general_scene_types");
const {
  deleteEventById,
  deleteEventListingById,
} = require("../../firestore/event_services");
const {
  generateEditableEventMessage,
} = require("../../message/event_message_services");
const { splitTheParameter } = require("../../../utils/string_utils");
const {
  getChannelUsernameByRegionVerify,
  getEventChannelIdByRegion,
  getVerifyChnnelIdByRegion,
  getListingChannelId,
} = require("../../channel_services");

// cancel question action
const cancelEventQuestion = (ctx) => {
  ctx.scene.leave();
  generateEditableEventMessage(ctx);
};


// cancel event posting question
const cancelPosting = (ctx) => {
  ctx.scene.leave();
  ctx.scene.enter(START_POSTING);
};

// delete event that is coming from the user
const deleteEvent = async (ctx) => {
  var param = splitTheParameter(ctx.callbackQuery.data);
  // find channel user name by region
  var channelId = await getVerifyChnnelIdByRegion(param["region"]);
  // need to get channelUserName and messageId from the database
  ctx.telegram.deleteMessage(channelId, param["messageId"]);
  // delete event from the database
  deleteEventById(param["eventId"]);
};

const deleteEventListing = async (ctx) => {
  var param = splitTheParameter(ctx.callbackQuery.data);
  // find channel user name by region

  // need to get channelUserName and messageId from the database
  ctx.telegram.deleteMessage(getListingChannelId(), param["messageId"]);

  // delete event from the database
  deleteEventListingById(param["eventId"]);
};

module.exports = {
  cancelEventQuestion,
  cancelPosting,
  deleteEvent,
  deleteEventListing,

};
