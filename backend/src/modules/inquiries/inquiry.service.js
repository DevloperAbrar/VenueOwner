const { Inquiry, Venue } = require("../../database/models");
const { AppError } = require("../../middleware/error.middleware");
const { sendWhatsApp } = require("../whatsapp/whatsapp.service");

const VALID_TRANSITIONS = {
  new: ["contacted", "lost"],
  contacted: ["negotiating", "lost"],
  negotiating: ["advance_received", "lost"],
  advance_received: ["confirmed", "lost"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
  lost: []
};

/**
 * Called from the PUBLIC inquiry form on a venue's website — no auth.
 */
async function createPublicInquiry(venueId, payload) {
  const venue = await Venue.findByPk(venueId);
  if (!venue) throw new AppError("Venue not found", 404);

  const inquiry = await Inquiry.create({
    venue_id: venueId,
    slot_id: payload.slot_id,
    customer_name: payload.customer_name,
    phone: payload.phone,
    email: payload.email,
    event_date: payload.event_date,
    event_type: payload.event_type,
    guest_count: payload.guest_count,
    message: payload.message,
    status: "new"
  });

  // Automated trigger: new inquiry -> notify owner
  sendWhatsApp({
    venueId,
    recipientPhone: venue.phone,
    triggerType: "new_inquiry",
    variables: { customerName: payload.customer_name, eventDate: payload.event_date }
  }).catch((err) => console.error("[WHATSAPP] Failed to notify owner of new inquiry:", err.message));

  return inquiry;
}

async function getInquiriesByVenue(venueId, filters = {}) {
  const where = { venue_id: venueId };
  if (filters.status) where.status = filters.status;
  if (filters.event_type) where.event_type = filters.event_type;

  return Inquiry.findAll({ where, order: [["created_at", "DESC"]] });
}

async function getInquiryById(inquiryId, venueId) {
  const inquiry = await Inquiry.findOne({ where: { id: inquiryId, venue_id: venueId } });
  if (!inquiry) throw new AppError("Inquiry not found", 404);
  return inquiry;
}

async function updateInquiryStatus(inquiryId, venueId, newStatus) {
  const inquiry = await getInquiryById(inquiryId, venueId);

  const allowed = VALID_TRANSITIONS[inquiry.status] || [];
  if (!allowed.includes(newStatus)) {
    throw new AppError(`Cannot move inquiry from '${inquiry.status}' to '${newStatus}'`, 400);
  }

  inquiry.status = newStatus;
  await inquiry.save();
  return inquiry;
}

async function updateInternalNotes(inquiryId, venueId, notes) {
  const inquiry = await getInquiryById(inquiryId, venueId);
  inquiry.internal_notes = notes;
  await inquiry.save();
  return inquiry;
}

module.exports = {
  createPublicInquiry,
  getInquiriesByVenue,
  getInquiryById,
  updateInquiryStatus,
  updateInternalNotes
};