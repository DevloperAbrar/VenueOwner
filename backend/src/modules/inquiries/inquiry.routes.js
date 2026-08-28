const express = require("express");
const controller = require("./inquiry.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { publicInquiryLimiter } = require("../../middleware/rateLimiter.middleware");

const router = express.Router({ mergeParams: true });

// Public — inquiry form submission from venue website
router.post("/", publicInquiryLimiter, controller.createPublicInquiry);

router.post("/marketplace", publicInquiryLimiter, controller.createMarketplaceInquiry);

// Venue Owner (dashboard)
router.get("/", authenticate, requireRole("venue_owner"), controller.getInquiries);
router.get("/:inquiryId", authenticate, requireRole("venue_owner"), controller.getInquiry);
router.patch("/:inquiryId/status", authenticate, requireRole("venue_owner"), controller.updateStatus);
router.patch("/:inquiryId/notes", authenticate, requireRole("venue_owner"), controller.updateNotes);

module.exports = router;