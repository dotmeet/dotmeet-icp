// packages
const { session, Scenes } = require("telegraf");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const ps = require("process");

// // log the process memeory usage in every 1 minutes
// setInterval(() => {
//   const used = ps.memoryUsage();
//   for (let key in used) {
//     console.log(
//       `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
//     );
//   }
// }, 60000);

const { scheduleTheJobs } = require("./jobs/reminder_jobs");

const { cronJobNews } = require("./jobs/news_listing_jobs");
const {
  scheduleTheListingNotification,
} = require("./jobs/event_listing_scheduler");

console.log("Running in " + process.env.NODE_ENV);

cronJobNews();
scheduleTheJobs();
scheduleTheListingNotification();

// services
const bot = require("./services/bot/bot_services");
const {
  findEventChannelLinkByRegion,
  findNewsChannelLinkByRegion,
} = require("./services/channel_services");
const { populateEventTemplateToSession } = require("./services/event_services");
const {
  sendNewEventMessage,
  sendWelcomeTestMessage,
} = require("./services/firebase_messaging_services");
const {
  optimizeEvent,
  editEventDetails,
  editEventPoster,
  reuploadEventPoster,
  editNewsPoster,
  reuploadNewsPoster,
  editNewsDetails,
} = require("./services/bot/actions/edit_actions");
const {
  completeNewsSubmission,
  confirmEventSubmission,
  completeTheEventDetailsFilling,
  completeEventSubmission,
  completeTheNewsDetailsFilling,
  confirmNewsSubmission,
  verifyCommunity,
} = require("./services/bot/actions/canister_actions");
const {
  cancelPosting,
  deleteEvent,
  deleteEventListing,
} = require("./services/bot/actions/cancel_actions");

// Scenes
const { startPosting } = require("./scenes/general");
const {
  eventName,
  eventCaption,
  eventDescription,
  eventNote,
  eventRegLink,
  eventPoster,
} = require("./scenes/event/event_header");
const {
  eventDate,
  eventTiming,
  singleDayEvent,
  multipleDayEvent,
} = require("./scenes/event/event_time");
const {
  eventLocation,
  mapUrl,
  floor,
  locationNote,
} = require("./scenes/event/event_location");
const {
  organizertg,
  communityName,
  communityTg,
  websiteUrl,
} = require("./scenes/event/event_footer");

// utility functions
const {
  EVENT_POSTER,
  EVENT_NAME,
  EVENT_CAPTION,
  EVENT_DESCRIPTION,
  EVENT_NOTE,
  EVENT_REG_LINK,
  EVENT_DATE,
  EVENT_TIMING,
  EVENT_LOCATION,
  EVENT_MAP_URL,
  EVENT_FLOOR,
  EVENT_LOCATION_NOTE,
  EVENT_ORGANIZER,
  EVENT_COMMUNITY_NAME,
  EVENT_COMMUNITY_TG,
  EVENT_SINGLE_DATE,
  EVENT_MULTIPLE_DATE,
  EVENT_WEBSITE_URL,
} = require("./utils/event_scene_types");

const { START_POSTING } = require("./utils/general_scene_types");

const {
  NEWS_POSTER,
  NEWS_SUMMARY,
  NEWS_SOURCE,
  NEWS_SOURCE_LINK,
  NEWS_TOPICS,
} = require("./utils/news_scene_types");
const {
  createCuriousPeople,
  updateTheLondonToLDN,
} = require("./services/firestore/event_services");
const { getEventById } = require("./services/firestore/event_services");
const {
  generateDotmeetFinalMessage,
  populateDotmeetFinalMessage,
} = require("./services/message/event_message_services");
const { populateNewsTemplateToSession } = require("./services/news_services");
const {
  newsPoster,
  newsSource,
  newslink,
  newsSummary,
  newsTopics,
} = require("./scenes/news/news_scene");
const {
  generateListEventMessage,
  generateBotAlerts,
} = require("./services/message/general_message_services");
const { getBotGroupsAndChannels } = require("./services/bot/bot_utils");
const { isWeNeedtoStore } = require("./utils/storing_filters");
const {
  createGroupActivity,
  createOrRemoveNewsChat,
} = require("./services/firestore/general_services");

bot.use(session());

const stage = new Scenes.Stage([
  // headers
  startPosting(START_POSTING, () => START_POSTING),

  eventName(EVENT_NAME, () => EVENT_NAME),
  eventCaption(EVENT_CAPTION, () => EVENT_CAPTION),
  eventDescription(EVENT_DESCRIPTION, () => EVENT_DESCRIPTION),
  eventNote(EVENT_NOTE, () => EVENT_NOTE),
  eventRegLink(EVENT_REG_LINK, () => EVENT_REG_LINK),
  // date and time info
  eventDate(EVENT_DATE, (ctx) => EVENT_DATE),
  eventTiming(EVENT_TIMING, () => EVENT_TIMING),
  singleDayEvent(EVENT_SINGLE_DATE, () => EVENT_SINGLE_DATE),
  multipleDayEvent(EVENT_MULTIPLE_DATE, () => EVENT_MULTIPLE_DATE),
  // location info
  eventLocation(EVENT_LOCATION, () => EVENT_LOCATION),
  mapUrl(EVENT_MAP_URL, () => EVENT_MAP_URL),
  floor(EVENT_FLOOR, () => EVENT_FLOOR),
  locationNote(EVENT_LOCATION_NOTE, () => EVENT_LOCATION_NOTE),
]);

bot.use(stage.middleware());

bot.start((ctx) => {
  // check the user is an specific user
  if (ctx.chat.type === "private") {
    ctx.scene.enter(START_POSTING);
  }
});
// bot.command("calendar", (ctx) => {
//   generateListEventMessage(ctx);
// });

bot.command("Dubai", (ctx) => {
  if (ctx.chat.type === "private") {
    populateEventTemplateToSession(ctx);
    ctx.session.event.region = "Dubai";
    ctx.session.event.channelLink = findEventChannelLinkByRegion("Dubai");
    ctx.scene.enter(EVENT_NAME);
  }
});

// event header commands
bot.command("name", (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter(EVENT_NAME);
  }
});

bot.command("description", (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter(EVENT_DESCRIPTION);
  }
});

bot.command("editregistrationlink", (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter(EVENT_REG_LINK);
  }
});

// event timing commands
bot.command("eventDate", (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter(EVENT_DATE);
  }
});

bot.command("eventTiming", (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter(EVENT_TIMING);
  }
});

// event location commands
bot.command("eventLocaltion", (ctx) => {
  if (ctx.chat.type === "private") {
    ctx.scene.enter(EVENT_LOCATION);
  }
});

bot.action("cancel", (ctx) => cancelPosting(ctx));

bot.action(/delete_+/, async (ctx) => deleteEvent(ctx));

// all edit actions

bot.action("edit_event", (ctx) => editEventDetails(ctx));

bot.action("reupload_event", (ctx) => reuploadEventPoster(ctx));

bot.action(/optimize_+/, async (ctx) => optimizeEvent(ctx));

// all verify actions
bot.action("done", (ctx) => completeTheEventDetailsFilling(ctx));

bot.action("confirm", async (ctx) => confirmEventSubmission(ctx));

// verifier channel actions
bot.action(/verified_+/, async (ctx) => completeEventSubmission(ctx));

bot.launch();
