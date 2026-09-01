const { Venue, Subscription, Plan, User } = require("../../database/models");
const { calculateCompletion } = require("../marketplace-profile/marketplaceProfile.service");
const { AppError } = require("../../middleware/error.middleware");
const { compressImage } = require("../../utils/imageCompress");
const path = require("path");

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generateUniqueSubdomain(hallName) {
  let base = slugify(hallName) || "venue";
  let subdomain = base;
  let counter = 1;

  while (await Venue.findOne({ where: { subdomain } })) {
    subdomain = `${base}-${counter}`;
    counter++;
  }

  return subdomain;
}

async function createVenue(payload) {
  const existingVenue = await Venue.findOne({ where: { owner_id: payload.owner_id } });
  if (existingVenue) {
    throw new AppError("You already have a business profile. Only one profile is allowed per account.", 409);
  }

  const subdomain = await generateUniqueSubdomain(payload.hall_name);

  const venue = await Venue.create({
    owner_id: payload.owner_id,
    hall_name: payload.hall_name,
    owner_name: payload.owner_name,
    phone: payload.phone,
    city: payload.city,
    address: payload.address,
    google_maps_link: payload.google_maps_link,
    capacity: payload.capacity,
    venue_type: payload.venue_type,
    business_category: payload.business_category,
    secondary_categories: Array.isArray(payload.secondary_categories) ? payload.secondary_categories : [],
    primary_locality: payload.primary_locality,
    team_size: payload.team_size,
    starting_price: payload.starting_price,
    subdomain
  });

  const { createSubscription, createFreeSubscription } = require("../subscriptions/subscription.service");
  if (payload.plan_id) {
    await createSubscription(venue.id, payload.plan_id);
  } else {
    await createFreeSubscription(venue.id);
  }

  return venue;
}

async function getVenueById(venueId) {
  const venue = await Venue.findByPk(venueId, {
    include: [
      { model: Subscription, as: "subscription", include: [{ model: Plan, as: "plan" }] },
      { model: User, as: "owner", attributes: ["id", "email"] }
    ]
  });

  if (!venue) throw new AppError("Venue not found", 404);

  const { percentage, missing_fields } = calculateCompletion(venue);
  venue.setDataValue("marketplace_completion", { percentage, missing_fields });

  return venue;
}
async function getVenuesByOwner(ownerId) {
  return Venue.findAll({
    where: { owner_id: ownerId },
    include: [
      { model: Subscription, as: "subscription", include: [{ model: Plan, as: "plan" }] }
    ]
  });
}

async function updateVenue(venueId, ownerId, updates) {
  const venue = await Venue.findOne({ where: { id: venueId, owner_id: ownerId } });
  if (!venue) throw new AppError("Venue not found or access denied", 404);

  const allowedFields = [
    "hall_name", "owner_name", "phone", "city", "address", "google_maps_link",
    "capacity", "venue_type", "template_id", "theme_color",
    "hero_heading", "hero_subheading", "hero_button_text", "about_text",
    "about_highlights", "services", "testimonials", "show_pricing_section",
    "upi_id", "bank_details", "gst_enabled", "gst_number"
  ];

  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) venue[field] = updates[field];
  });

  await venue.save();
  await recalculateSetupChecklist(venue);
  return venue;
}

async function uploadHeroImage(venueId, ownerId, file) {
  const venue = await Venue.findOne({ where: { id: venueId, owner_id: ownerId } });
  if (!venue) throw new AppError("Venue not found or access denied", 404);

  await compressImage(file.path, { maxWidth: 1920, quality: 78 });
  venue.hero_image_url = `/uploads/venues/${path.basename(file.path)}`;
  await venue.save();
  await recalculateSetupChecklist(venue);
  return venue;
}

async function addGalleryImages(venueId, ownerId, files) {
  const venue = await Venue.findOne({ where: { id: venueId, owner_id: ownerId } });
  if (!venue) throw new AppError("Venue not found or access denied", 404);

  const existing = venue.gallery || [];
  if (existing.length + files.length > 20) {
    throw new AppError("Gallery limit is 20 photos", 400);
  }

  for (const file of files) {
    await compressImage(file.path, { maxWidth: 1600, quality: 72 });
  }

  const newImages = files.map((f, idx) => ({
    id: `${Date.now()}-${idx}`,
    url: `/uploads/gallery/${path.basename(f.path)}`,
    category: null,
    order: existing.length + idx
  }));

  venue.gallery = [...existing, ...newImages];
  await venue.save();
  await recalculateSetupChecklist(venue);
  return venue;
}

async function recalculateSetupChecklist(venue) {
  const { Slot } = require("../../database/models");

  const steps = [];
  if (venue.hero_image_url) steps.push("hero_image");
  if (venue.gallery && venue.gallery.length > 0) steps.push("gallery");
  if (venue.services && venue.services.length > 0) steps.push("services");
  if (venue.about_text) steps.push("about");

  const slotCount = await Slot.count({ where: { venue_id: venue.id, is_active: true } });
  if (slotCount > 0) steps.push("slots");

  venue.setup_completed_steps = steps;

  const minimumMet = steps.includes("hero_image") && steps.includes("services") && venue.phone && venue.address;
  venue.is_live = Boolean(minimumMet);


  await venue.save();
}

async function toggleVenueActive(venueId, isActive) {
  const venue = await Venue.findByPk(venueId);
  if (!venue) throw new AppError("Venue not found", 404);
  venue.is_active = isActive;
  await venue.save();
  return venue;
}

async function deleteVenue(venueId) {
  const venue = await Venue.findByPk(venueId);
  if (!venue) throw new AppError("Venue not found", 404);
  await venue.destroy();
  return true;
}

async function listAllVenues(filters = {}) {
  const where = {};
  if (filters.city) where.city = filters.city;
  if (filters.is_active !== undefined) where.is_active = filters.is_active;

  return Venue.findAll({
    where,
    include: [{ model: Subscription, as: "subscription", include: [{ model: Plan, as: "plan" }] }],
    order: [["created_at", "DESC"]]
  });
}

async function getPublicVenueBySubdomain(subdomain) {
  const venue = await Venue.findOne({
    where: { subdomain, is_active: true }, // is_live only gates discovery search, not direct URL access
    attributes: {
      exclude: ["upi_id", "bank_details", "gst_number", "owner_id"]
    }
  });

  if (!venue) throw new AppError("Venue not found", 404);
  return venue;
}

async function deleteGalleryImage(venueId, ownerId, imageId) {
  const venue = await Venue.findOne({ where: { id: venueId, owner_id: ownerId } });
  if (!venue) throw new AppError("Venue not found or access denied", 404);

  const existing = venue.gallery || [];
  const imageToDelete = existing.find((img) => img.id === imageId);
  if (!imageToDelete) throw new AppError("Image not found", 404);

  const fs = require("fs");
  const filePath = path.join(process.cwd(), imageToDelete.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  venue.gallery = existing.filter((img) => img.id !== imageId);
  await venue.save();
  await recalculateSetupChecklist(venue);
  return venue;
}

module.exports = {
  createVenue,
  getVenueById,
  getVenuesByOwner,
  updateVenue,
  uploadHeroImage,
  addGalleryImages,
  toggleVenueActive,
  deleteVenue,
  listAllVenues,
  getPublicVenueBySubdomain,
  recalculateSetupChecklist,
  deleteGalleryImage
};