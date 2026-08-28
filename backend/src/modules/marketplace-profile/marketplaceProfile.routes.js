const express = require("express");
const controller = require("./marketplaceProfile.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");

const router = express.Router({ mergeParams: true });

router.get("/", authenticate, requireRole("venue_owner"), controller.getProfile);
router.put("/", authenticate, requireRole("venue_owner"), controller.updateProfile);
router.put("/service-areas", authenticate, requireRole("venue_owner"), controller.updateServiceAreas);
router.get("/completion", authenticate, requireRole("venue_owner"), controller.getCompletion);

module.exports = router;