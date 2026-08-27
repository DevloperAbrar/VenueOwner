const { WhatsappTemplate } = require("../models");

const DEFAULT_TEMPLATES = [
  {
    name: "New Inquiry Alert",
    category: "custom",
    body_template: "New inquiry received from {{customerName}} for {{eventDate}}. Please respond soon."
  },
  {
    name: "Trial Expiry Reminder",
    category: "trial_expiry",
    body_template: "Hi! Your VenueSafar trial ends in {{daysLeft}} days. Renew now to keep your website live."
  },
  {
    name: "Renewal Reminder",
    category: "renewal_reminder",
    body_template: "Your VenueSafar subscription needs renewal. Renew today to avoid dashboard access loss."
  },
  {
    name: "Payment Receipt",
    category: "payment_receipt",
    body_template: "Thank you {{customerName}}! We've received your payment of ₹{{amount}}."
  },
  {
    name: "Festival Greeting",
    category: "festival_greeting",
    body_template: "Wishing you and your venue a joyful festive season from the VenueSafar team! 🎉"
  }
];

async function seedWhatsappTemplates() {
  for (const template of DEFAULT_TEMPLATES) {
    const existing = await WhatsappTemplate.findOne({ where: { name: template.name } });
    if (!existing) {
      await WhatsappTemplate.create(template);
      console.log(`[SEED] WhatsApp template created: ${template.name}`);
    }
  }
}

module.exports = { seedWhatsappTemplates };