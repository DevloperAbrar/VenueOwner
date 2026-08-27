const express = require("express");
const controller = require("./analytics.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");

const router = express.Router();

// Super Admin
router.get("/admin/dashboard", authenticate, requireRole("super_admin"), controller.getAdminDashboardStats);
router.get("/admin/mrr-trend", authenticate, requireRole("super_admin"), controller.getMrrTrend);
router.get("/admin/churn", authenticate, requireRole("super_admin"), controller.getChurnRate);
router.get("/admin/distribution", authenticate, requireRole("super_admin"), controller.getDistribution);
router.get("/admin/trial-conversion", authenticate, requireRole("super_admin"), controller.getTrialConversion);

// Venue Owner
router.get("/owner/:venueId", authenticate, requireRole("venue_owner"), controller.getOwnerAnalytics);
router.get("/owner/:venueId/slot-popularity", authenticate, requireRole("venue_owner"), controller.getSlotPopularity);

module.exports = router;