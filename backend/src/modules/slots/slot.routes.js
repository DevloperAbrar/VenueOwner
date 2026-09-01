const express = require("express");
const controller = require("./slot.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { requirePlanFeature } = require("../../middleware/planFeature.middleware");

const router = express.Router({ mergeParams: true });

// Public — needed for the public availability calendar
router.get("/", controller.getSlots);

// Venue Owner only
router.post("/", authenticate, requireRole("venue_owner"), requirePlanFeature("slots"), controller.createSlot);
router.patch("/:slotId", authenticate, requireRole("venue_owner"), requirePlanFeature("slots"), controller.updateSlot);
router.delete("/:slotId", authenticate, requireRole("venue_owner"), requirePlanFeature("slots"), controller.deleteSlot);

module.exports = router;