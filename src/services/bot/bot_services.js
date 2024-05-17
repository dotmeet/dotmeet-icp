const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.DOTMEET_BOT_TOKEN);

module.exports = bot;
