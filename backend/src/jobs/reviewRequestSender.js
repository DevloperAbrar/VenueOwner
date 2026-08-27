const cron = require("node-cron");
const dayjs = require("dayjs");
const { Booking, Client, Venue } = require("../database/models");
const { sendWhatsApp } = require("../modules/whatsapp/whatsapp.service");

/**
 * Runs daily at 11 AM: sends a review request 2 days after event completion.
 */
function startReviewRequestSender() {
  cron.schedule("0 11 * * *", async () => {
    console.log("[JOB] Running post-event review request job...");

    const twoDaysAgo = dayjs().subtract(2, "day").format("YYYY-MM-DD");

    const completedBookings = await Booking.findAll({
      where: { status: "completed", event_date: twoDaysAgo },
      include: [{ model: Client, as: "client" }, { model: Venue, attributes: ["hall_name"] }]
    });

    for (const booking of completedBookings) {
      await sendWhatsApp({
        venueId: booking.venue_id,
        recipientPhone: booking.client.phone,
        triggerType: "review_request",
        variables: {
          customerName: booking.client.name,
          reviewLink: "https://g.page/r/your-google-review-link/review" // replace per-venue if stored later
        }
      });
    }

    console.log(`[JOB] Review requests sent for ${completedBookings.length} bookings.`);
  });

  console.log("[JOB] Review request sender scheduled (daily 11 AM).");
}

module.exports = { startReviewRequestSender };