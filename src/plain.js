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

const { Actor, HttpAgent } = require("@dfinity/agent");
// Create an HttpAgent to connect to your local or remote Internet Computer replica
const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

let actor;
// Use dynamic import to import the idlFactory
const idlFactoryPromise = import("./dotmeet_backend.did.mjs").then(
  (module) => module.idlFactory
);

// Wait for the idlFactory to resolve and then create the actor
idlFactoryPromise
  .then((idlFactory) => {
    // Actor creation logic goes here
    actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: "a4tbr-q4aaa-aaaaa-qaafq-cai", // Replace this with your canister ID
    });

    // Now you can use the actor object
    console.log("Actor created successfully:", actor);
  })
  .catch((error) => {
    console.error("Error importing idlFactory:", error);
  });
bot.use(session());

bot.start((ctx) => {
  // check the user is an specific user
  ctx.scene.enter(START_POSTING);
});

bot.command("canistertest", async (ctx) => {
  try {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });

    // // Example: Call createEvent function
    // const result = await actor.createEvent(
    //   "Event Name",
    //   "Event Description",
    //   "Location",
    //   "2024-06-06",
    //   "12:00"
    // );
    // console.log("Event created:", result);

    // Example: Call readEvents function
    const events = await actor.readEvents();
    console.log("All Events:", events);

    // Example: Call readEventById function
    // const eventId = events[0].id;
    // const eventById = await actor.readEventById(eventId);
    // console.log("Event by ID:", eventById);

    // // Example: Call deleteEvent function
    // const deletedEvent = await actor.deleteEvent(eventId);
    // console.log("Deleted Event:", deletedEvent);

    // // Example: Call fetchUpcomingEvents function
    // const upcomingEvents = await actor.fetchUpcomingEvents();
    // console.log("Upcoming Events:", upcomingEvents);
  } catch (error) {
    console.error("Error:", error);
  }
});

bot.command("addEvent", async (ctx) => {
  if (ctx.chat.type === "private") {
    populateEventTemplateToSession(ctx);
    ctx.session.event.region = "Dubai";
    ctx.session.event.channelLink = findEventChannelLinkByRegion("Dubai");
    ctx.scene.enter(EVENT_POSTER);
  }
  try {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });

    // Example: Call createEvent function
    const result = await actor.createEvent(
      "Event Name",
      "Event Description",
      "Location",
      "2024-06-06",
      "12:00"
    );
    console.log("Event created:", result);
  } catch (error) {
    console.error("Error:", error);
  }
});

bot.launch();
