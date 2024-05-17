// orginal channel ids
var dotmeet = {
  Dubai: {
    channel: process.env.DOT_MEET_DUBAI_CHANNEL,
    verifyChannel: process.env.DOT_MEET_DUBAI_VERIFY,
    timezone: "Asia/Dubai",
  },
  Japan: {
    channel: process.env.DOT_MEET_JAPAN_CHANNEL,
    verifyChannel: process.env.DOT_MEET_JAPAN_VERIFY,
    timezone: "Asia/Tokyo",
  },
};

module.exports = { dotmeet };
