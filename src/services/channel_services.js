const { dotmeet } = require("../constants/channel_info");
const bot = require("../services/bot/bot_services");

const findEventChannelLinkByRegion = async (region) => {
  var channelId = dotmeet[region].channel;
  console.log("channel id " + channelId);
  // get the link to the channel
  const link = await bot.telegram.exportChatInviteLink(channelId);
  return link;
};


// get channel username by region
const getChannelUsernameByRegionVerify = async (region) => {
  var chat = await bot.telegram.getChat(dotmeet[region].verifyChannel);
  return chat.username;
};

const getEventChannelIdByRegion = (region) => {
  return dotmeet[region].channel;
};



const getVerifyChnnelIdByRegion = (region) => {
  return dotmeet[region].verifyChannel;
};


const getListingChannelId = () => {
  return process.env.LISTING_CHANNEL;
};

module.exports = {
  findEventChannelLinkByRegion,
  getEventChannelIdByRegion,
  getVerifyChnnelIdByRegion,
  getChannelUsernameByRegionVerify,
  getListingChannelId,
};
