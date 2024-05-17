const formateDateForView = (date) => {
  var weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  // get month full
  var month = date.toLocaleDateString("en-US", { month: "long" });
  // get day
  var day = date.toLocaleDateString("en-US", { day: "numeric" });
  // get year
  var year = date.toLocaleDateString("en-US", { year: "numeric" });
  return `${weekday}, ${day} ${month} ${year}`;
};

const formatDateFor2DaysEvent = (startDate, endDate) => {
  var startDay = startDate.toLocaleDateString("en-US", { day: "numeric" });
  var startMonth = startDate.toLocaleDateString("en-US", { month: "short" });
  var endDay = endDate.toLocaleDateString("en-US", { day: "numeric" });
  var endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
  var startYear = startDate.toLocaleDateString("en-US", { year: "numeric" });
  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth} ${startYear}`;
  } else {
    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear}`;
  }
};

module.exports = {
  formateDateForView,
  formatDateFor2DaysEvent,
};
