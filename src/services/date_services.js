const admin = require("firebase-admin");

const moment = require("moment-timezone");
const { dotmeet } = require("../constants/channel_info");
const convertDateToGoogleCalendarFormat = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // add 1 to month because Date object counts months from 0-11
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const dateTimeString = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;

  return dateTimeString;
};

const startAndEndDateTimeFilter = (date) => {
  var startTimeStamp = admin.firestore.Timestamp.fromDate(date);
  var endTimeStamp = admin.firestore.Timestamp.fromMillis(
    startTimeStamp.toMillis() + 24 * 60 * 60 * 1000
  );
  return { startTimeStamp, endTimeStamp };
};

// get timezone value like GMT+5:30 from the timezone string like Asia/Kolkata
const getTimezoneValue = (region) => {
  // timezone value like Asia/Kolkata from the region
  var timezone = dotmeet[region].timezone;
  // get the timezone value like GMT+5:30 from the timezone string like Asia/Kolkata
  var timezoneValue = moment.tz(timezone).format("Z");
  console.log("timezone value" + timezoneValue);
  return timezoneValue;
};

const getTimeDifference = (serverTimezone, regionTimezone) => {
  // find time difference between server and region
  const timeDifference =
    moment.tz(serverTimezone).utcOffset() -
    moment.tz(regionTimezone).utcOffset();

  console.log("The time difference" + timeDifference);
  return timeDifference;
};

// get the relative time in cron format with timedifferene
const getCronTimeAccordingToServer = (
  serverTimezone,
  timeDifference,
  hours,
  minutes
) => {
  // find the relative time in server timezone for the entered time in region timezone
  const relativeTime = moment

    .tz(serverTimezone)
    .hour(hours)
    .minute(minutes)
    .add(timeDifference, "minutes");

  console.log("Relative time in minutes" + relativeTime);

  const cronTime = `${relativeTime.minute()} ${relativeTime.hour()} * * *`;

  console.log("converted time to cron time" + cronTime);
  return cronTime;
};

const getCronsByRegion = (region) => {
  // timezone of the region
  const regionTimezone = dotmeet[region].timezone;
  // get the server time zone
  const serverTimezone = moment.tz.guess();

  var timeDifference = getTimeDifference(serverTimezone, regionTimezone);

  var cronTime10AM = getCronTimeAccordingToServer(
    serverTimezone,
    timeDifference,
    9,
    0
  );

  // get cron time for 2:00 PM
  var crontTime2PM = getCronTimeAccordingToServer(
    serverTimezone,
    timeDifference,
    14,
    00
  );

  var cronTime930PM = getCronTimeAccordingToServer(
    serverTimezone,
    timeDifference,
    21,
    30
  );

  return {
    cronTime10AM,
    cronTime930PM,
    crontTime2PM,
  };
};

module.exports = {
  convertDateToGoogleCalendarFormat,
  startAndEndDateTimeFilter,
  getTimezoneValue,
  getTimeDifference,
  getCronTimeAccordingToServer,
  getCronsByRegion,
};
