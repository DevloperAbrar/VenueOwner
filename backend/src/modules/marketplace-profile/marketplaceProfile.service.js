const { Venue, City, VenueServiceArea } = require("../../database/models");
const { AppError } = require("../../middleware/error.middleware");
const { getRedisClient } = require("../../config/redis");

// Fields the venue owner is allowed to edit from the Marketplace Profile tabs.
// Verification badges and featured_on_homepage are intentionally excluded — admin only.
const EDITABLE_FIELDS = [
  "business_category", "secondary_categories", "whatsapp_number",
  "instagram_handle", "youtube_channel_link", "external_website", "video_intro_url",
  "primary_locality", "full_pincode", "service_travel_note",
  "year_established", "total_events_completed", "team_size", "languages_spoken",
  "starting_price", "maximum_price", "pricing_note", "advance_payment_percentage", "cancellation_policy",
  "long_description", "specialty_tagline", "famous_events_handled", "awards_recognition",
  "booking_advance_notice_days", "peak_season_months", "off_season_discount_enabled",
  "marketplace_services"
];

const MANDATORY_FIELDS = [
  "business_category", "long_description", "specialty_tagline", "primary_locality",
  "whatsapp_number", "starting_price", "cancellation_policy", "marketplace_services", "video_intro_url"
];

function wordCount(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean).length;
}

function isFieldFilled(venue, field) {
  const value = venue[field];
  if (field === "long_description") return wordCount(value) >= 150;
  if (field === "marketplace_services") return Array.isArray(value) && value.length > 0;
  if (value === null || value === undefined || value === "") return false;
  return true;
}

async function getOwnedVenue(venueId, ownerId) {
  const venue = await Venue.findByPk(venueId, {
    include: [{ model: City, as: "serviceAreas", attributes: ["id", "name", "slug", "state"] }]
  });
  if (!venue) throw new AppError("Venue not found", 404);
  if (venue.owner_id !== ownerId) throw new AppError("You do not have access to this venue", 403);
  return venue;
}

function calculateCompletion(venue) {
  const missing = MANDATORY_FIELDS.filter((field) => !isFieldFilled(venue, field));
  const percentage = Math.round(((MANDATORY_FIELDS.length - missing.length) / MANDATORY_FIELDS.length) * 100);
  return { percentage, missing_fields: missing };
}

async function getProfile(venueId, ownerId) {
  const venue = await getOwnedVenue(venueId, ownerId);
  const { percentage, missing_fields } = calculateCompletion(venue);
  return { venue, completion: { percentage, missing_fields } };
}

async function updateProfile(venueId, ownerId, payload) {
  const venue = await getOwnedVenue(venueId, ownerId);

  const updates = {};
  for (const field of EDITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      updates[field] = payload[field];
    }
  }

  if (updates.long_description !== undefined && wordCount(updates.long_description) < 150 && updates.long_description !== "") {
    throw new AppError("Long description must be at least 150 words", 400);
  }

  await venue.update(updates);

  const redis = await getRedisClient();
  if (redis && refreshed.business_category) {
    const { slugify } = require("../../utils/slugify");
    const citySlug = slugify(venue.city);
    const keys = await redis.keys(`marketplace:city:${citySlug}:cat:${venue.business_category}:*`);
    if (keys.length) await redis.del(keys);
  }

  const refreshed = await getOwnedVenue(venueId, ownerId);
  const { percentage, missing_fields } = calculateCompletion(refreshed);
  const isComplete = percentage === 100;

  if (isComplete !== refreshed.marketplace_profile_complete) {
    await refreshed.update({ marketplace_profile_complete: isComplete });
  }

  return { venue: refreshed, completion: { percentage, missing_fields } };
}

async function updateServiceAreas(venueId, ownerId, cityIds) {
  await getOwnedVenue(venueId, ownerId); // ownership check

  if (!Array.isArray(cityIds)) throw new AppError("city_ids must be an array", 400);
  if (cityIds.length > 5) throw new AppError("You can select up to 5 additional service cities", 400);

  const validCities = await City.findAll({ where: { id: cityIds, active: true } });
  if (validCities.length !== cityIds.length) throw new AppError("One or more cities are invalid", 400);

  await VenueServiceArea.destroy({ where: { venue_id: venueId } });
  await VenueServiceArea.bulkCreate(cityIds.map((city_id) => ({ venue_id: venueId, city_id })));

  return City.findAll({ where: { id: cityIds } });
}

async function getCompletion(venueId, ownerId) {
  const venue = await getOwnedVenue(venueId, ownerId);
  return calculateCompletion(venue);
}

module.exports = { getProfile, updateProfile, updateServiceAreas, getCompletion, MANDATORY_FIELDS };