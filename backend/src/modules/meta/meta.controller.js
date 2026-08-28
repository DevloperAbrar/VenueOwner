const { City, Category } = require("../../database/models");
const { getChecklistForCategory } = require("../../utils/servicesChecklist");

async function listCities(req, res, next) {
  try {
    const cities = await City.findAll({
      where: { active: true },
      order: [["name", "ASC"]]
    });
    res.json({ success: true, data: cities });
  } catch (error) {
    next(error);
  }
}

async function listCategories(req, res, next) {
  try {
    const categories = await Category.findAll({
      where: { active: true },
      order: [["display_order", "ASC"]]
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

async function getServicesChecklist(req, res, next) {
  try {
    const checklist = getChecklistForCategory(req.params.categorySlug);
    res.json({ success: true, data: checklist });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCities, listCategories, getServicesChecklist };