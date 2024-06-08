const { Markup } = require("telegraf");
const {
  convertToReadable12HourFormat,
  shortenUrl,
} = require("../utils/string_utils");

const { URLSearchParams } = require("url");


const createInlineCalender = (date) => {
  var currentYear = date.getFullYear();
  var currentMonth = date.getMonth() + 1;
  var currentDate = date.getDate();
  // get month in words
  var monthInWords = date.toLocaleString("default", { month: "long" });
  var row = [];
  var keyboard = [];
  row.push(Markup.button.callback(`${monthInWords} ${currentYear}`, "ignore"));
  keyboard.push(row);
  row = [];
  weeks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  for (var i = 0; i < weeks.length; i++) {
    row.push(Markup.button.callback(weeks[i], "ignore"));
  }
  keyboard.push(row);

  // find first day offset for the montn in week
  var weekDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  // number of days in current month
  var numberOfDays = new Date(currentYear, currentMonth, 0).getDate();

  // create a row for each week
  var row = [];
  var currentDay = 1;
  for (var i = 0; i < 6; i++) {
    // create a row for each week
    var row = [];
    for (var j = 0; j < 7; j++) {
      if (i === 0 && j < weekDay - 1) {
        // add empty button for days before the first day of the month
        row.push(Markup.button.callback(" ", "selectDate_action:IGNORE"));
      } else if (currentDay > numberOfDays) {
        // add empty button for days after the last day of the month
        row.push(Markup.button.callback(" ", "selectDate_action:IGNORE"));
      } else {
        // add button for the current day and make it clickable by getting the date
        row.push(
          Markup.button.callback(
            `${currentDay}`,
            `selectDate_action:DAY_date:${currentYear}-${currentMonth}-${currentDay}`
          )
        );
        currentDay++;
      }
    }

    keyboard.push(row);
  }
  row = [];
  // previous month selector
  row.push(
    Markup.button.callback(
      "<",
      `selectDate_action:PREV-MONTH_date:${currentYear}-${currentMonth}-${currentDate}`
    )
  );
  // current month selector
  row.push(Markup.button.callback(" ", "selectDate_action:IGNORE"));

  // next month selector
  row.push(
    Markup.button.callback(
      ">",
      `selectDate_action:NEXT-MONTH_date:${currentYear}-${currentMonth}-${currentDate}`
    )
  );

  keyboard.push(row);

  row = [];
  // cancel button
  row.push(Markup.button.callback("❌ Cancel", "selectDate_action:CANCEL"));
  keyboard.push(row);

  return Markup.inlineKeyboard(keyboard);
};

const createInlineTimeChooser = (isItFirst, message, skip) => {
  var row = [];
  var keyboard = [];
  row.push(Markup.button.callback(message, "ignore"));
  keyboard.push(row);

  var timeArray = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "00",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
  ];
  if (isItFirst) {
    timeArray = timeArray.slice(0, 12);
  } else {
    timeArray = timeArray.slice(12, 24);
  }

  for (var i = 0; i < timeArray.length; i += 2) {
    row = [];
    row.push(
      Markup.button.callback(
        convertToReadable12HourFormat(timeArray[i], "00"),
        `timeChooser_action:TIME_time:${timeArray[i]}-00`
      )
    );
    row.push(
      Markup.button.callback(
        convertToReadable12HourFormat(timeArray[i], "30"),
        `timeChooser_action:TIME_time:${timeArray[i]}-30`
      )
    );
    row.push(
      Markup.button.callback(
        convertToReadable12HourFormat(timeArray[i + 1], "00"),
        `timeChooser_action:TIME_time:${timeArray[i + 1]}-00`
      )
    );
    row.push(
      Markup.button.callback(
        convertToReadable12HourFormat(timeArray[i + 1], "30"),
        `timeChooser_action:TIME_time:${timeArray[i + 1]}-30`
      )
    );
    keyboard.push(row);
  }
  row = [];
  if (isItFirst) {
    row.push(
      Markup.button.callback(" ", "timeChooser_action:IGNORE_time:null")
    );
    row.push(
      Markup.button.callback(" ", "timeChooser_action:IGNORE_time:null")
    );
    row.push(
      Markup.button.callback(">", "timeChooser_action:FORWARD_time:null")
    );
  } else {
    row.push(
      Markup.button.callback("<", "timeChooser_action:BACKWARD_time:null")
    );
    row.push(
      Markup.button.callback(" ", "timeChooser_action:IGNORE_time:null")
    );
    row.push(
      Markup.button.callback(" ", "timeChooser_action:IGNORE_time:null")
    );
  }
  keyboard.push(row);
  row = [];
  if (skip) {
    row.push(
      Markup.button.callback("Skip", "timeChooser_action:SKIP_time:null")
    );
  }
  keyboard.push(row);

  row = [];
  // cancel button
  row.push(
    Markup.button.callback("❌ Cancel", "timeChooser_action:CANCEL_time:null")
  );
  keyboard.push(row);
  return Markup.inlineKeyboard(keyboard);
};

const createGoogleCalendarLink = (event) => {
  // convert time timestamp to date
  // formate startDateTiming into YYYYMMDDTHHMMSSZ for google calendar
  var startTimeStamp = new Date(event.eventStartDateTime._seconds * 1000);
  var endTimeStamp = new Date(event.eventEndDateTime._seconds * 1000);
  var startDate = convertDateToGoogleCalendarFormat(startTimeStamp);

  var endDate = convertDateToGoogleCalendarFormat(endTimeStamp);

  // generate telegram
  var messageUrl = `https://t.me/${event.channelLink}/${event.messageId}`;

  // copy the event name, description and location to new variables
  var name = event.name;
  var description = `${event.description}`;
  var location = event.location;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: name,
    dates: `${startDate}/${endDate}`,
    details: description,
    location: location,
    sf: true,
    output: "xml",
  });
  // google calendar link with google
  var link = `https://www.google.com/calendar/render?${params.toString()}`;
  return link;
};

module.exports = {
  createInlineCalender,
  createInlineTimeChooser,
  createGoogleCalendarLink,
};
