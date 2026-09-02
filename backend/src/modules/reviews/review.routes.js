const express = require("express");
const controller = require("./review.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { publicInquiryLimiter } = require("../../middleware/rateLimiter.middleware");

const router = express.Router();

// Public — manual marketplace review submission (Google sign-in verified, no OTP/SMS cost)
router.post("/submit", publicInquiryLimiter, controller.submit);

// Public — post-booking review via unique token link (no OTP)
router.post("/token/:token", publicInquiryLimiter, controller.submitViaToken);

// Public — fetch approved reviews for a venue
router.get("/venue/:venueId", controller.getByVenue);

// Vendor auth — see and self-moderate every review on their own venue
router.get("/owner/:venueId", authenticate, requireRole("venue_owner"), controller.ownerGetByVenue);
router.put("/:reviewId/owner-approve", authenticate, requireRole("venue_owner"), controller.ownerApprove);
router.delete("/:reviewId/owner", authenticate, requireRole("venue_owner"), controller.ownerDelete);

// Vendor auth — reply to a review
router.post("/:reviewId/reply", authenticate, requireRole("venue_owner"), controller.reply);

// Super Admin — moderation queue
router.get("/admin/pending", authenticate, requireRole("super_admin"), controller.adminPending);
router.put("/admin/:reviewId/approve", authenticate, requireRole("super_admin"), controller.adminApprove);
router.put("/admin/:reviewId/reject", authenticate, requireRole("super_admin"), controller.adminReject);

module.exports = router;