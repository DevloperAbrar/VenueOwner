const express = require("express");
const controller = require("./booking.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const ledgerController = require("../clients/paymentLedger.controller");


const router = express.Router({ mergeParams: true });

// Public — availability check for the public calendar
router.get("/availability", controller.checkAvailability);

// Venue Owner
router.post("/", authenticate, requireRole("venue_owner"), controller.createManualBooking);
router.post(
  "/from-inquiry/:inquiryId",
  authenticate,
  requireRole("venue_owner"),
  controller.convertInquiryToBooking
);
router.get("/", authenticate, requireRole("venue_owner"), controller.getBookings);
router.get("/:bookingId", authenticate, requireRole("venue_owner"), controller.getBooking);
router.patch("/:bookingId/status", authenticate, requireRole("venue_owner"), controller.updateStatus);
router.patch("/:bookingId", authenticate, requireRole("venue_owner"), controller.updateBooking);

router.post("/:bookingId/payments", authenticate, requireRole("venue_owner"), ledgerController.addLedgerEntry);
router.get("/:bookingId/payments", authenticate, requireRole("venue_owner"), ledgerController.getLedgerForBooking);

router.patch("/:bookingId", authenticate, requireRole("venue_owner"), controller.updateBooking);
router.delete("/:bookingId", authenticate, requireRole("venue_owner"), controller.deleteBooking);

module.exports = router;