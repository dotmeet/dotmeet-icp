const { START_POSTING } = require("../../utils/event_scene_types");
const {
  generateEditableEventMessage,
  generateEditEventPhotoMessage,
} = require("./event_message_services");

// validate photo message
const validatePhotoMessage = (ctx, message) => {
  if (ctx.callbackQuery.data == "cancel question") {
    ctx.scene.leave();
    ctx.scene.enter(START_POSTING);
  } else if (!ctx.message.photo) {
    ctx.reply("Please send a valid poster");
    return;
  } else {
    ctx.session.event.poster = ctx.message.photo[0].file_id;
    // send the uploaded file to the user
    generateEditEventPhotoMessage(ctx);
  }
};

// validate question message
const validateQuestionMessage = (ctx, message) => {
  if (ctx.callbackQuery.data == "cancel question") {
    ctx.scene.leave();
    generateEditableEventMessage(ctx);
  } else if (!ctx.message.text) {
    ctx.reply("Please send a valid question");
    return;
  }
};

const validateIsItText = (ctx) => {
  if (ctx.message.text) {
    return true;
  } else {
    ctx.reply("Please send a valid text");
    return false;
  }
};

const validateMinimumLength = (ctx, threshold, outMessage) => {
  if (!validateIsItText(ctx)) return false;

  if (ctx.message.text.length < threshold) {
    ctx.reply(outMessage);
    return false;
  } else {
    return true;
  }
};

const validateMaximumLength = (ctx, threshold, outMessage) => {
  if (ctx.message.text.length > threshold) {
    ctx.reply(outMessage);
    return false;
  } else {
    return true;
  }
};

const validateStartWith = (ctx, startWith, outMessage) => {
  if (!ctx.message.text.startsWith(startWith)) {
    ctx.reply(outMessage);
    return false;
  } else {
    return true;
  }
};

const escapeMarkdown = (text) => {
  const SPECIAL_CHARS = [
    "\\",
    "_",
    "*",
    "[",
    "]",
    "(",
    ")",
    "~",
    "`",
    ">",
    "<",
    "&",
    "#",
    "+",
    "-",
    "=",
    "|",
    "{",
    "}",
    ".",
    "!",
  ];
  SPECIAL_CHARS.forEach((char) => (text = text.replaceAll(char, `\\${char}`)));
  return text;
};

const escapeHTML = (text) => {
  if (!text) return text;
  const SPECIAL_CHARS = ["&", "<", ">", '"', "'"];
  const SPECIAL_CHARS_ESCAPED = ["&amp;", "&lt;", "&gt;", "&quot;", "&#039;"];
  SPECIAL_CHARS.forEach((char, index) => {
    text = text.replaceAll(char, SPECIAL_CHARS_ESCAPED[index]);
  });
  return text;
};

module.exports = {
  validatePhotoMessage,
  validateQuestionMessage,
  validateIsItText,
  validateMinimumLength,
  validateMaximumLength,
  validateStartWith,
  escapeMarkdown,
  escapeHTML,
};
