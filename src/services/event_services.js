const {
  createEvent,
  getEventById,
  updateEvent,
} = require("./firestore/event_services");

const { eventTemplate } = require("../constants/events/event_datas");
const { getTimezoneValue } = require("./date_services");


const populateEventTemplateToSession = (ctx) => {
  ctx.session.event = Object.assign({}, eventTemplate);
};

const populateServerEventToSession = (ctx, event, eventId) => {
  userEvent = eventTemplate;
  userEvent.id = eventId;
  userEvent.name = event.name;
  userEvent.region = event.region;
  userEvent.poster = event.poster;
  userEvent.description = event.description;
  userEvent.eventDate = event.eventDate;
  userEvent.eventTime = event.eventTime;
  userEvent.startDate = event.startDate;
  userEvent.endDate = event.endDate;
  userEvent.startTime = event.endDate;
  userEvent.endTime = event.endTime;
  userEvent.location = event.location;
  userEvent.mapUrl = event.mapUrl;

  if (event.caption) {
    userEvent.caption = event.caption;
  }
  if (event.note) {
    userEvent.note = event.note;
  }
  if (event.registrationLink) {
    userEvent.registrationLink = event.registrationLink;
  }
  if (event.floor) {
    userEvent.floor = event.floor;
  }
  if (event.locationNote) {
    userEvent.locationNote = event.locationNote;
  }
  if (event.organizer) {
    userEvent.organizer = event.organizer;
  }
  if (event.communityName) {
    userEvent.communityName = event.communityName;
  }
  if (event.communityTg) {
    userEvent.communityTg = event.communityTg;
  }
  if (event.websiteUrl) {
    userEvent.websiteUrl = event.websiteUrl;
  }
  if (event.singleDayEvent) {
    userEvent.singleDayEvent = event.singleDayEvent;
  }

  ctx.session.event = userEvent;
};

const prepareForStoringEventIntoDB = async (uploadedEvent) => {
  const {
    id,
    region,
    poster,
    name,
    caption,
    description,
    note,
    registrationLink,
    eventDate,
    eventTiming,
    startDate,
    endDate,
    startTime,
    endTime,
    location,
    mapUrl,
    floor,
    locationNote,
    organizer,
    communityName,
    communityTg,
    websiteUrl,
    singleDayEvent,
  } = uploadedEvent;

  var eventToStoreinDB = {
    isVerified: false,
    timeStamp: new Date(),
    region: region,
    poster: poster,
    name: name,
    description: description,
    eventDate: eventDate,
    eventTiming: eventTiming,
    location: location,
    mapUrl: mapUrl,
    singleDayEvent: singleDayEvent,
  };

  // combine both start date and start time into a single field and need to convert it into a date object and make seconds to 0 and also consider the time zone

  if (startDate && startTime) {
    eventToStoreinDB.eventStartDateTime = new Date(
      startDate + " " + startTime + ":00" + getTimezoneValue(region)
    );
  }

  // we need to combine the eventEndDate and eventEndTime into a single field and need to convert it into a date object
  if (endDate) {
    var time = endTime != eventTemplate.endTime ? endTime : "23:59";
    eventToStoreinDB.eventEndDateTime = new Date(
      endDate + " " + time + ":00" + getTimezoneValue(region)
    );
  }

  // now check optional fields are filled, if add to the eventToStoreinDB object
  if (caption && caption !== eventTemplate.caption) {
    eventToStoreinDB.caption = caption;
  }
  if (note && note !== eventTemplate.note) {
    eventToStoreinDB.note = note;
  }
  if (registrationLink && registrationLink !== eventTemplate.registrationLink) {
    eventToStoreinDB.registrationLink = registrationLink;
  }
  if (floor && floor !== eventTemplate.floor) {
    eventToStoreinDB.floor = floor;
  }
  if (locationNote && locationNote !== eventTemplate.locationNote) {
    eventToStoreinDB.locationNote = locationNote;
  }
  if (organizer && organizer !== eventTemplate.organizer) {
    eventToStoreinDB.organizer = organizer;
  }
  if (communityName && communityName !== eventTemplate.communityName) {
    eventToStoreinDB.communityName = communityName;
  }
  if (communityTg && communityTg !== eventTemplate.communityTg) {
    eventToStoreinDB.communityTg = communityTg;
  }
  if (websiteUrl && websiteUrl !== eventTemplate.websiteUrl) {
    eventToStoreinDB.websiteUrl = websiteUrl;
  }

  return { eventToStoreinDB };
};

const fetchFromDB = async (id) => {
  var event = await getEventById(id);
  return event;
};

module.exports = {
  
  prepareForStoringEventIntoDB,
  populateEventTemplateToSession,
  fetchFromDB,
  populateServerEventToSession,
};
