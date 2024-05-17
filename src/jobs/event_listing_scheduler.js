// import node schedule
const schedule = require("node-schedule");
// import moment
const moment = require("moment-timezone");

// Services
const {
  generateNewListingMessage,
} = require("../services/message/event_message_services");

// import firestore
const {
  fetchAllListedEvents,
} = require("../services/firestore/event_services");

// now we need actually one function that will schedule the job

const scheduleTheListingNotification = () => {
  // schedule for every 30 minutes
  schedule.scheduleJob("*/40 * * * *", async () => {
    await fetchAllListedEvents().then((listedEvents) => {
      listedEvents.forEach((listing) => {
        generateNewListingMessage(listing, listing.id);
      });
    });
  });
};

module.exports = {
  scheduleTheListingNotification,
};
