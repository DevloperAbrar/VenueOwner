const { whatsappClient } = require("../../config/whatsapp");
const { WhatsappMessage } = require("../../database/models");
const { getTemplateByCategory, renderTemplate } = require("./template.manager");
const env = require("../../config/env");

const TRIGGER_TO_CATEGORY = {
  new_inquiry: "custom",
  booking_confirmed: "custom",
  invoice_shared: "custom",
  payment_reminder: "custom",
  review_request: "custom",
  trial_expiry: "trial_expiry",
  subscription_expired: "renewal_reminder",
  bulk: "custom"
};

const FALLBACK_MESSAGES = {
  new_inquiry: "New inquiry received from {{customerName}} for {{eventDate}}. Please respond soon.",
  booking_confirmed: "Hi {{customerName}}, your booking for {{eventDate}} is confirmed. Thank you!",
  invoice_shared: "Hi {{customerName}}, here is your invoice {{invoiceNumber}}: {{pdfLink}}",
  payment_reminder: "Hi {{customerName}}, a balance payment of ₹{{amount}} is pending for your booking.",
  review_request: "Thank you for choosing us! We'd love your feedback: {{reviewLink}}",
  trial_expiry: "Your VenueSafar trial ends in {{daysLeft}} days. Renew now to stay live.",
  subscription_expired: "Your VenueSafar subscription has expired. Renew to restore dashboard access."
};

/**
 * The ONE function every feature in the platform must use to send WhatsApp messages.
 * Switching BSPs later means editing only this file.
 */
async function sendWhatsApp({ venueId = null, recipientPhone, triggerType = "manual", variables = {}, scheduledFor = null }) {
  if (!recipientPhone) {
    console.warn("[WHATSAPP] No recipient phone provided, skipping send.");
    return null;
  }

  const category = TRIGGER_TO_CATEGORY[triggerType] || "custom";
  let bodyTemplate;

  const dbTemplate = await getTemplateByCategory(category).catch(() => null);
  bodyTemplate = dbTemplate ? dbTemplate.body_template : FALLBACK_MESSAGES[triggerType] || "";

  const body = renderTemplate(bodyTemplate, variables);

  const message = await WhatsappMessage.create({
    venue_id: venueId,
    recipient_phone: recipientPhone,
    template_id: dbTemplate ? dbTemplate.id : null,
    body,
    status: scheduledFor ? "scheduled" : "sent",
    scheduled_for: scheduledFor,
    trigger_type: triggerType
  });

  if (scheduledFor) {
    return message; // picked up later by message.scheduler.js
  }

  try {
    if (!env.whatsapp.apiKey || !env.whatsapp.apiUrl) {
      console.warn("[WHATSAPP] BSP not configured — message logged but not actually sent.");
      return message;
    }

    await whatsappClient.post("/send", {
      apiKey: env.whatsapp.apiKey,
      destination: recipientPhone,
      message: body
    });

    message.status = "delivered";
    message.sent_at = new Date();
    await message.save();
  } catch (error) {
    message.status = "failed";
    await message.save();
    console.error("[WHATSAPP] Send failed:", error.message);
  }

  return message;
}

module.exports = { sendWhatsApp };