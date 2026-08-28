const service = require("./adminDiscovery.service");

async function getFeaturedVendors(req, res, next) {
  try { res.json({ success: true, data: await service.getFeaturedVendors() }); }
  catch (error) { next(error); }
}

async function setFeaturedVendors(req, res, next) {
  try { res.json({ success: true, data: await service.setFeaturedVendors(req.body.venue_ids) }); }
  catch (error) { next(error); }
}

async function setVenueBadges(req, res, next) {
  try { res.json({ success: true, data: await service.setVenueBadges(req.params.venueId, req.body) }); }
  catch (error) { next(error); }
}

async function listCities(req, res, next) {
  try { res.json({ success: true, data: await service.listCities() }); }
  catch (error) { next(error); }
}

async function createCity(req, res, next) {
  try { res.status(201).json({ success: true, data: await service.createCity(req.body) }); }
  catch (error) { next(error); }
}

async function updateCity(req, res, next) {
  try { res.json({ success: true, data: await service.updateCity(req.params.cityId, req.body) }); }
  catch (error) { next(error); }
}

async function getAnalytics(req, res, next) {
  try { res.json({ success: true, data: await service.getAnalytics() }); }
  catch (error) { next(error); }
}

module.exports = {
  getFeaturedVendors, setFeaturedVendors, setVenueBadges,
  listCities, createCity, updateCity, getAnalytics
};