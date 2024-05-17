const { dotmeet } = require("../../constants/channel_info");
const { admin, bucket } = require("../../firebase/firebase-admin");
const { startAndEndDateTimeFilter } = require("../date_services");
const moment = require("moment-timezone");

const db = admin.firestore();

const curiousPeoplesCollection = db.collection("curiousPeoples");
const eventCollection = db.collection("events");

const eventListings = db.collection("eventListings");

// create a new event
const createEvent = async (event) => {
  const docRef = await eventCollection.add(event);
  return docRef.id;
};

// create a new curious people
const createCuriousPeople = async (curiousPeople) => {
  const docRef = await curiousPeoplesCollection.add(curiousPeople);
  return docRef.id;
};

// get the event by id
const getEventById = async (id) => {
  const docRef = await db.collection("events").doc(id).get();
  return docRef.data();
};

// we need to fetch the event from the database and update the status to verified
const updateEvent = (id, event) => {
  // update the event
  eventCollection.doc(id).update(event);

  return id;
};

// delete the event by id
const deleteEventById = async (id) => {
  await eventCollection.doc(id).delete();
};

const deleteEventListingById = async (id) => {
  await eventListings.doc(id).delete();
};

// fetch all the event that is happening today after 12:00 PM
const fetchAllEventsToday = async (region) => {
  const currentDate = new Date(
    moment().tz(dotmeet[region].timezone).format("YYYY-MM-DD")
  );

  const { startTimeStamp, endTimeStamp } =
    startAndEndDateTimeFilter(currentDate);
  const docRef = await eventCollection
    .where("isVerified", "==", true)
    .where("region", "==", region)
    .where("eventStartDateTime", ">=", startTimeStamp)
    .where("eventStartDateTime", "<", endTimeStamp)
    .get();
  return docRef.docs.map((doc) => doc.data());
};

// fetch all the 2 days conferences that is happening from after 4 days
const fetchAllEventsAfter4Days = async (region) => {
  // get date after 4 days
  const after4Days = new Date(
    moment().tz(dotmeet[region].timezone).format("YYYY-MM-DD")
  );
  console.log("after 4 days date", after4Days);
  after4Days.setDate(after4Days.getDate() + 4);
  after4Days.setHours(0, 0, 0, 0);
  const { startTimeStamp, endTimeStamp } =
    startAndEndDateTimeFilter(after4Days);

  // fetch all the events that is happening after 4 days and it not an single day event
  var docRef = await eventCollection
    .where("isVerified", "==", true)
    .where("region", "==", region)
    .where("singleDayEvent", "==", false)
    .where("eventStartDateTime", ">=", startTimeStamp)
    .where("eventStartDateTime", "<", endTimeStamp)
    .get();

  return docRef.docs.map((doc) => doc.data());
};

// fetch all events in London and change that region "London" to "LDN"
const updateTheLondonToLDN = async () => {
  var docRef = await eventCollection.where("region", "==", "London").get();

  docRef.docs.forEach((doc) => {
    eventCollection.doc(doc.id).update({ region: "LDN" });

    console.log("updated", doc.id);
  });

  console.log("updated finished");
};

// fetch all the events that is happening tomorrow till 12:00 PM
const fetchAllEventsTomorrow = async (region) => {
  const tomorrow = new Date(
    moment().tz(dotmeet[region].timezone).format("YYYY-MM-DD")
  );

  tomorrow.setDate(tomorrow.getDate() + 1);

  const { startTimeStamp, endTimeStamp } = startAndEndDateTimeFilter(tomorrow);

  var docRef = await eventCollection
    .where("isVerified", "==", true)
    .where("region", "==", region)
    .where("eventStartDateTime", ">=", startTimeStamp)
    .where("eventStartDateTime", "<", endTimeStamp)
    .get();
  return docRef.docs.map((doc) => doc.data());
};

// fetch all listed events
const fetchAllListedEvents = async () => {
  const docRef = await eventListings.get();

  return docRef.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// snapshot listner for the event listings

// const eventListingsSnapshotListner = (callBack) => {
//   eventListings.onSnapshot((snapshot) => {
//     snapshot.docChanges().forEach((change) => {
//       console.log("change type", change.type);
//       if (change.type === "added")
//         callBack(change.doc.data(), change.doc.id, "added");
//     });
//   });
// };

module.exports = {
  createEvent,
  createCuriousPeople,
  getEventById,
  updateEvent,
  deleteEventById,
  fetchAllEventsToday,
  fetchAllEventsTomorrow,
  fetchAllEventsAfter4Days,
  createCuriousPeople,
  fetchAllListedEvents,
  deleteEventListingById,
  updateTheLondonToLDN,
};
