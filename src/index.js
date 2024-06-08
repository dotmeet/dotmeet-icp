// packages
const { session, Scenes } = require("telegraf");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

console.log("Running in " + process.env.NODE_ENV);

// services
const bot = require("./services/bot/bot_services");
const { findEventChannelLinkByRegion } = require("./services/channel_services");
const { populateEventTemplateToSession } = require("./services/event_services");

const {
  optimizeEvent,
  editEventDetails,

  reuploadEventPoster,
} = require("./services/bot/actions/edit_actions");
const {
  confirmEventSubmission,
  completeTheEventDetailsFilling,
  completeEventSubmission,
  fetchUpcomingEvents,
  fetchAllEvents,
} = require("./services/bot/actions/verify_actions");
const {
  cancelPosting,
  deleteEvent,
} = require("./services/bot/actions/cancel_actions");

// Scenes
const { startPosting } = require("./scenes/general");
const {
  eventName,

  eventDescription,

  eventRegLink,
} = require("./scenes/event/event_header");
const { eventDate, eventTiming } = require("./scenes/event/event_time");
const { eventLocation } = require("./scenes/event/event_location");

// utility functions
const {
  EVENT_NAME,

  EVENT_DESCRIPTION,

  EVENT_REG_LINK,
  EVENT_DATE,
  EVENT_TIMING,
  EVENT_LOCATION,
} = require("./utils/event_scene_types");

const { START_POSTING } = require("./utils/general_scene_types");

bot.use(session());

const stage = new Scenes.Stage([
  // headers
  startPosting(START_POSTING, () => START_POSTING),

  eventName(EVENT_NAME, () => EVENT_NAME),

  eventDescription(EVENT_DESCRIPTION, () => EVENT_DESCRIPTION),
  eventRegLink(EVENT_REG_LINK, () => EVENT_REG_LINK),
  // date and time info
  eventDate(EVENT_DATE, (ctx) => EVENT_DATE),
  eventTiming(EVENT_TIMING, () => EVENT_TIMING),

  // location info
  eventLocation(EVENT_LOCATION, () => EVENT_LOCATION),
]);

bot.use(stage.middleware());

bot.start((ctx) => {
  // check the user is an specific user
  if (ctx.chat.type === "private") {
    ctx.scene.enter(START_POSTING);
  }
});

bot.action("submit_event", (ctx) => {
  if (ctx.chat.type === "private") {
    populateEventTemplateToSession(ctx);
    ctx.session.event.region = "Dubai";
    ctx.session.event.channelLink = findEventChannelLinkByRegion("Dubai");
    ctx.scene.enter(EVENT_NAME);
  }
});
bot.action("all_events", async (ctx) => {
  if (ctx.chat.type === "private") {
    console.log("Fetching all events");
    await fetchAllEvents(ctx);
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
