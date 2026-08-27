const { startTrialExpiryChecker } = require("./trialExpiryChecker");
const { startPaymentReminder } = require("./paymentReminder");
const { startReviewRequestSender } = require("./reviewRequestSender");
const { startMessageScheduler } = require("../modules/whatsapp/message.scheduler");

function startJobs() {
  startTrialExpiryChecker();
  startPaymentReminder();
  startReviewRequestSender();
  startMessageScheduler();
  console.log("[JOBS] All background jobs started.");
}

module.exports = { startJobs };