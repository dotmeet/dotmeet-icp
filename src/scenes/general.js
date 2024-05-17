const { composeWizardScene } = require("../services/wizard_services");

const {
  generateBotStartMessage,
} = require("../services/message/general_message_services");

const startPosting = composeWizardScene((ctx) => {
  ctx.session.event = {};
  generateBotStartMessage(ctx);
  return ctx.scene.leave();
});

module.exports = {
  startPosting,
};
