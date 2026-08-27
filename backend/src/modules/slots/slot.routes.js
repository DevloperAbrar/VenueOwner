const express = require("express");
const controller = require("./slot.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");

const router = express.Router({ mergeParams: true });

// Public — needed for the public availability calendar
router.get("/", controller.getSlots);

// Venue Owner only
router.post("/", authenticate, requireRole("venue_owner"), controller.createSlot);
router.patch("/:slotId", authenticate, requireRole("venue_owner"), controller.updateSlot);
router.delete("/:slotId", authenticate, requireRole("venue_owner"), controller.deleteSlot);

module.exports = router;