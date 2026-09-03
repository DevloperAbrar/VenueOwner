const express = require("express");
const controller = require("./venue.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { requireRole } = require("../../middleware/role.middleware");
const { upload } = require("../../middleware/upload.middleware");
const { requirePlanFeature } = require("../../middleware/planFeature.middleware");

const router = express.Router();

// Public (no auth) — used by the public venue website
router.get("/public/:subdomain", controller.getPublicVenue);

// Preview (auth required) — owner can preview their own venue even if not is_live yet
router.get("/preview/:subdomain", authenticate, controller.previewVenue);

// Venue Owner
router.post("/", authenticate, requireRole("venue_owner"), controller.createVenue);
router.get("/my", authenticate, requireRole("venue_owner"), controller.getMyVenues);
router.patch("/:id", authenticate, requireRole("venue_owner"), controller.updateVenue);
router.post(
  "/:id/hero-image",
  authenticate,
  requireRole("venue_owner"),
  requirePlanFeature("website_builder"),
  upload.single("heroImage"),
  controller.uploadHeroImage
);
router.post(
  "/:id/gallery",
  authenticate,
  requireRole("venue_owner"),
  requirePlanFeature("website_builder"),
  upload.array("galleryImages", 20),
  controller.addGalleryImages
);

router.post(
  "/:id/section-image",
  authenticate,
  requireRole("venue_owner"),
  requirePlanFeature("website_builder"),
  upload.single("sectionImage"),
  controller.uploadSectionImage
);
// Shared (owner or admin can view)
router.get("/:id", authenticate, controller.getVenue);

// Super Admin only
router.get("/", authenticate, requireRole("super_admin"), controller.listAllVenues);
router.patch("/:id/status", authenticate, requireRole("super_admin"), controller.toggleVenueActive);
router.delete("/:id", authenticate, requireRole("super_admin"), controller.deleteVenue);

router.delete(
  "/:id/gallery/:imageId",
  authenticate,
  requireRole("venue_owner"),
  requirePlanFeature("website_builder"),
  controller.deleteGalleryImage
);

module.exports = router;