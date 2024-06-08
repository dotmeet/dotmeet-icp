const bot = require("../bot_services");
const { START_POSTING } = require("../../../utils/general_scene_types");
const { getEventById } = require("../../firestore/event_services");
const { prepareForStoringEventIntoDB } = require("../../event_services");
const {
  generateEventConfirmationMessage,
  generateEventVerificationMessage,
  generateDotmeetFinalMessage,
} = require("../../message/event_message_services");
const { splitTheParameter } = require("../../../utils/string_utils");
const { getVerifyChnnelIdByRegion } = require("../../channel_services");
const { downloadAndStoreImageIntoDB } = require("../../api_services");
const { sendNewEventMessage } = require("../../firebase_messaging_services");

// this contains and all verification and confirmation actions
const { Actor, HttpAgent } = require("@dfinity/agent");
// Create an HttpAgent to connect to your local or remote Internet Computer replica
const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

let actor;
// Use dynamic import to import the idlFactory
const idlFactoryPromise = import("../../../dotmeet_backend.did.mjs").then(
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
const completeTheEventDetailsFilling = async (ctx) => {
  // we need an validation setup here for checking if all the required fields are filled

  ctx.deleteMessage();
  generateEventConfirmationMessage(ctx);
};

// confirm the event submission by looking through the event details
const confirmEventSubmission = async (ctx) => {
  // ctx.deleteMessage();
  ctx.answerCbQuery(
    "Event is send successfully, Event will be posted to dotmeet channel just after verification."
  );
  console.log(ctx.session.event);
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
  } catch (error) {
    console.error("Error:", error);
  }

  ctx.scene.enter(START_POSTING);
};

// complete the event submission after verification
const completeEventSubmission = async (ctx) => {
  var param = splitTheParameter(ctx.update.callback_query.data);
  var channelId = getVerifyChnnelIdByRegion(param["region"]);
  ctx.telegram.deleteMessage(channelId, param["messageId"]);
  // we need to fetch the event from the database and update the status to verified
  var event = await getEventById(param["eventId"]);
  generateDotmeetFinalMessage(event, param["eventId"]);
  event.id = param["eventId"];
  sendNewEventMessage(event);
};

module.exports = {
  completeTheEventDetailsFilling,
  confirmEventSubmission,
  completeEventSubmission,
};
