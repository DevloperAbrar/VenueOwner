const { Venue, City } = require("../../database/models");
const { FIXED_CATEGORIES } = require("../../config/categories");
const { slugify } = require("../../utils/slugify");
const env = require("../../config/env");

async function generateSitemapXml() {
  const discoveryDomain = `https://${env.baseDomain}`; // adjust if discovery frontend has its own domain in production
  const urls = [];

  urls.push({ loc: `${discoveryDomain}/`, priority: "1.0" });

  const cities = await City.findAll({ where: { active: true } });
  const states = [...new Set(cities.map((c) => c.state_slug))];

  states.forEach((stateSlug) => {
    urls.push({ loc: `${discoveryDomain}/state/${stateSlug}`, priority: "0.9" });
  });

  cities.forEach((city) => {
    urls.push({ loc: `${discoveryDomain}/${city.slug}`, priority: "0.9" });
    FIXED_CATEGORIES.forEach((cat) => {
      urls.push({ loc: `${discoveryDomain}/${city.slug}/${cat.slug}`, priority: "0.8" });
    });
  });

  const venues = await Venue.findAll({
    where: { is_active: true, marketplace_listed: true },
    attributes: ["subdomain", "city", "business_category"]
  });

  venues.forEach((v) => {
    if (!v.business_category) return;
    urls.push({
      loc: `${discoveryDomain}/${slugify(v.city)}/${v.business_category}/${v.subdomain}`,
      priority: "0.7"
    });
  });

  const xmlBody = urls
    .map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlBody}\n</urlset>`;
}

module.exports = { generateSitemapXml };