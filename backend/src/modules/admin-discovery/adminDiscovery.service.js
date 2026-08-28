const { Op, fn, col } = require("sequelize");
const { Venue, City, Inquiry } = require("../../database/models");
const { AppError } = require("../../middleware/error.middleware");

async function getFeaturedVendors() {
  return Venue.findAll({ where: { featured_on_homepage: true }, order: [["hall_name", "ASC"]] });
}

async function setFeaturedVendors(venueIds) {
  if (!Array.isArray(venueIds) || venueIds.length > 10) {
    throw new AppError("Provide up to 10 venue IDs", 400);
  }
  await Venue.update({ featured_on_homepage: false }, { where: {} });
  await Venue.update({ featured_on_homepage: true }, { where: { id: venueIds } });
  return Venue.findAll({ where: { id: venueIds } });
}

async function setVenueBadges(venueId, badges) {
  const venue = await Venue.findByPk(venueId);
  if (!venue) throw new AppError("Venue not found", 404);

  await venue.update({
    badge_verified_business: !!badges.badge_verified_business,
    badge_documents_verified: !!badges.badge_documents_verified,
    badge_premium_partner: !!badges.badge_premium_partner
  });

  return venue;
}

async function listCities() {
  return City.findAll({ order: [["name", "ASC"]] });
}

async function createCity(payload) {
  const { slugify } = require("../../utils/slugify");
  return City.create({
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    state: payload.state,
    state_slug: payload.state_slug || slugify(payload.state),
    latitude: payload.latitude,
    longitude: payload.longitude,
    active: true
  });
}

async function updateCity(cityId, payload) {
  const city = await City.findByPk(cityId);
  if (!city) throw new AppError("City not found", 404);
  await city.update(payload);
  return city;
}

async function getAnalytics() {
  const topCities = await Venue.findAll({
    where: { is_active: true, marketplace_listed: true },
    attributes: ["city", [fn("COUNT", col("id")), "count"]],
    group: ["city"],
    order: [[fn("COUNT", col("id")), "DESC"]],
    limit: 10
  });

  const topCategories = await Venue.findAll({
    where: { is_active: true, marketplace_listed: true, business_category: { [Op.ne]: null } },
    attributes: ["business_category", [fn("COUNT", col("id")), "count"]],
    group: ["business_category"],
    order: [[fn("COUNT", col("id")), "DESC"]],
    limit: 10
  });

  const marketplaceInquiries = await Inquiry.count({ where: { source: "marketplace" } });
  const subdomainInquiries = await Inquiry.count({ where: { source: "subdomain" } });

  const mostViewedVendors = await Venue.findAll({
    where: { is_active: true, marketplace_listed: true },
    order: [["review_count", "DESC"]],
    limit: 10,
    attributes: ["id", "hall_name", "city", "review_count", "average_rating"]
  });

  return {
    top_cities: topCities.map((c) => ({ city: c.city, count: Number(c.get("count")) })),
    top_categories: topCategories.map((c) => ({ category: c.business_category, count: Number(c.get("count")) })),
    marketplace_inquiries: marketplaceInquiries,
    subdomain_inquiries: subdomainInquiries,
    most_viewed_vendors: mostViewedVendors
  };
}

module.exports = {
  getFeaturedVendors, setFeaturedVendors, setVenueBadges,
  listCities, createCity, updateCity, getAnalytics
};