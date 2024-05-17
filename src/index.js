// packages
const { session, Scenes } = require("telegraf");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const { scheduleTheJobs } = require("./jobs/reminder_jobs");

const {
  scheduleTheListingNotification,
} = require("./jobs/event_listing_scheduler");

console.log(process.env.NODE_ENV);

scheduleTheJobs();
scheduleTheListingNotification();

// services
const bot = require("./services/bot/bot_services");
const { findEventChannelLinkByRegion } = require("./services/channel_services");
const { populateEventTemplateToSession } = require("./services/event_services");
const {
  optimizeEvent,
  editEventDetails,
  editEventPoster,
  reuploadEventPoster,
} = require("./services/bot/actions/edit_actions");
const {
  confirmEventSubmission,
  completeTheEventDetailsFilling,
  completeEventSubmission,
} = require("./services/bot/actions/verify_actions");
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

bot.use(session());

const stage = new Scenes.Stage([
  // headers
  startPosting(START_POSTING, () => START_POSTING),
  // // event stages
  eventPoster(EVENT_POSTER, () => EVENT_POSTER),
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
  // footer
  organizertg(EVENT_ORGANIZER, () => EVENT_ORGANIZER),
  communityName(EVENT_COMMUNITY_NAME, () => EVENT_COMMUNITY_NAME),
  communityTg(EVENT_COMMUNITY_TG, () => EVENT_COMMUNITY_TG),
  websiteUrl(EVENT_WEBSITE_URL, () => EVENT_WEBSITE_URL),
]);

bot.use(stage.middleware());

bot.start((ctx) => {
  // check the user is an specific user
  ctx.scene.enter(START_POSTING);
});

bot.command("Dubai", (ctx) => {
  populateEventTemplateToSession(ctx);
  ctx.session.event.region = "Dubai";
  ctx.session.event.channelLink = findEventChannelLinkByRegion("Dubai");
  ctx.scene.enter(EVENT_POSTER);
});

// event header commands
bot.command("name", (ctx) => {
  ctx.scene.enter(EVENT_NAME);
});

bot.command("caption", (ctx) => {
  ctx.scene.enter(EVENT_CAPTION);
});

bot.command("description", (ctx) => {
  ctx.scene.enter(EVENT_DESCRIPTION);
});

bot.command("note", (ctx) => {
  ctx.scene.enter(EVENT_NOTE);
});

bot.command("editregistrationlink", (ctx) => {
  ctx.scene.enter(EVENT_REG_LINK);
});

// event timing commands
bot.command("eventDate", (ctx) => {
  ctx.scene.enter(EVENT_DATE);
});

bot.command("eventTiming", (ctx) => {
  ctx.scene.enter(EVENT_TIMING);
});

// event location commands
bot.command("eventLocaltion", (ctx) => {
  ctx.scene.enter(EVENT_LOCATION);
});

bot.command("mapUrlToEvent", (ctx) => {
  ctx.scene.enter(EVENT_MAP_URL);
});

// bot  event actions
// all cancel actions

bot.action("cancel", (ctx) => cancelPosting(ctx));

bot.action(/delete_+/, async (ctx) => deleteEvent(ctx));

// all edit actions

bot.action("edit_event", (ctx) => editEventDetails(ctx));

bot.action("edit poster", (ctx) => editEventPoster(ctx));

bot.action("reupload_event", (ctx) => reuploadEventPoster(ctx));

bot.action(/optimize_+/, async (ctx) => optimizeEvent(ctx));

// all verify actions
bot.action("done", (ctx) => completeTheEventDetailsFilling(ctx));

bot.action("confirm", async (ctx) => confirmEventSubmission(ctx));

// verifier channel actions
bot.action(/verified_+/, async (ctx) => completeEventSubmission(ctx));


// date actions
bot.action("one_day_event", (ctx) => {
  ctx.session.event.singleDayEvent = true;
  ctx.scene.enter(EVENT_SINGLE_DATE);
});

bot.action("multiple_days_event", (ctx) => {
  ctx.session.event.singleDayEvent = false;
  ctx.scene.enter(EVENT_MULTIPLE_DATE);
});

// event listing commands
bot.action(/deletelisting_+/, async (ctx) => {
  deleteEventListing(ctx);
});

bot.launch();
