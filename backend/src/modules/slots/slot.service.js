const { Slot, Venue } = require("../../database/models"); // ADD Venue
const { AppError } = require("../../middleware/error.middleware");
const { recalculateSetupChecklist } = require("../venues/venue.service"); // ADD

async function createSlot(venueId, payload) {
  const slot = await Slot.create({
    venue_id: venueId,
    name: payload.name,
    start_time: payload.start_time,
    end_time: payload.end_time,
    base_price: payload.base_price,
    weekend_price: payload.weekend_price,
    days_of_operation: payload.days_of_operation
  });

  // ADD — update checklist after slot created
  const venue = await Venue.findByPk(venueId);
  if (venue) await recalculateSetupChecklist(venue);

  return slot;
}

async function getSlotsByVenue(venueId, activeOnly = false) {
  const where = { venue_id: venueId };
  if (activeOnly) where.is_active = true;
  return Slot.findAll({ where, order: [["start_time", "ASC"]] });
}

async function updateSlot(slotId, venueId, updates) {
  const slot = await Slot.findOne({ where: { id: slotId, venue_id: venueId } });
  if (!slot) throw new AppError("Slot not found", 404);

  const allowedFields = ["name", "start_time", "end_time", "base_price", "weekend_price", "days_of_operation", "is_active"];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) slot[field] = updates[field];
  });

  await slot.save();
  return slot;
}

async function deleteSlot(slotId, venueId) {
  const slot = await Slot.findOne({ where: { id: slotId, venue_id: venueId } });
  if (!slot) throw new AppError("Slot not found", 404);
  await slot.destroy();

  // ADD — update checklist after slot deleted
  const remainingSlots = await Slot.count({ where: { venue_id: venueId } });
  const venue = await Venue.findByPk(venueId);
  if (venue) await recalculateSetupChecklist(venue);

  return true;
}

module.exports = { createSlot, getSlotsByVenue, updateSlot, deleteSlot };