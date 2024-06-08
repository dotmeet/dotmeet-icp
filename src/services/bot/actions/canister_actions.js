const bot = require("../bot_services");
const { START_POSTING } = require("../../../utils/general_scene_types");
const {
  generateEventConfirmationMessage,
  generateEventDetailsMessage,
} = require("../../message/event_message_services");

// this contains and all verification and confirmation actions
const { Actor, HttpAgent } = require("@dfinity/agent");
// Create an HttpAgent to connect to your local or remote Internet Computer replica
const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

let actor;
// Use dynamic import to import the idlFactory
const idlFactoryPromise = import("../../../dotmeet_telegram.did.mjs").then(
  (module) => module.idlFactory
);

// Wait for the idlFactory to resolve and then create the actor
idlFactoryPromise
  .then((idlFactory) => {
    // Actor creation logic goes here
    actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: process.env.TELEGRAM_CANISTER_ID, // Replace this with your canister ID
    });

    // Now you can use the actor object
    console.log("Actor created successfully:", actor);
  })
  .catch((error) => {
    console.error("Error importing idlFactory:", error);
  });
const completeTheEventDetailsFilling = async (ctx) => {
  // we need an validation setup here for checking if all the required fields are filled

  ctx.deleteMessage();
  generateEventConfirmationMessage(ctx);
};

// confirm the event submission by looking through the event details
const confirmEventSubmission = async (ctx) => {
  try {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
    console.log(ctx.session.event.name);
    // Example: Call createEvent function

    const result = await actor.createEvent(
      ctx.session.event.name.toString(),
      ctx.session.event.description.toString(),
      ctx.session.event.location.toString(),
      ctx.session.event.eventDate.toString(),
      ctx.session.event.eventTiming.toString()
    );
    console.log("Event created:", result);
    ctx.deleteMessage();
    ctx.answerCbQuery(
      "Event is send successfully, Event will be posted to dotmeet channel just after verification."
    );
  } catch (error) {
    console.error("Error:", error);
  }

  ctx.scene.enter(START_POSTING);
};
const fetchUpcomingEvents = async (ctx) => {
  try {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
    const allEvents = await actor.fetchUpcomingEvents();

    generateEventDetailsMessage(ctx, allEvents);
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = {
  completeTheEventDetailsFilling,
  confirmEventSubmission,
  fetchUpcomingEvents,
};
