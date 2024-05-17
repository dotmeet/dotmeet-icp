const shortenUrl = async (url) => {
  var shortUrl = await shortUrl.short(url);
  return shortUrl;
};

const splitTheParameter = (str) => {
  var callbackData = str.split("_");
  callbackData = Array.from(callbackData);
  const command = callbackData[0];
  var param = {};
  callbackData.shift();

  for (var i = 0; i < callbackData.length; i++) {
    const [key, value] = callbackData[i].split(":");
    param[key] = value;
  }

  return param;
};

const convertToReadable12HourFormat = (hour, minute) => {
  if (hour > 12) {
    hour = hour - 12;
    return `${hour}:${minute} PM`;
  } else if (hour == 12) {
    return `${hour}:${minute} PM`;
  } else if (hour == 0) {
    return `12:${minute} AM`;
  } else {
    return `${hour}:${minute} AM`;
  }
};

module.exports = {
  splitTheParameter,
  convertToReadable12HourFormat,
  shortenUrl,
};
