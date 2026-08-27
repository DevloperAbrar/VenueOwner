const { sequelize } = require("../../config/database");
const { DataTypes } = require("sequelize");

const User = require("./user.model")(sequelize, DataTypes);
const Venue = require("./venue.model")(sequelize, DataTypes);
const Plan = require("./plan.model")(sequelize, DataTypes);
const Subscription = require("./subscription.model")(sequelize, DataTypes);
const Payment = require("./payment.model")(sequelize, DataTypes);
const Slot = require("./slot.model")(sequelize, DataTypes);
const Inquiry = require("./inquiry.model")(sequelize, DataTypes);
const Booking = require("./booking.model")(sequelize, DataTypes);
const Client = require("./client.model")(sequelize, DataTypes);
const PaymentLedger = require("./paymentLedger.model")(sequelize, DataTypes);
const Invoice = require("./invoice.model")(sequelize, DataTypes);
const ServiceItem = require("./serviceItem.model")(sequelize, DataTypes);
const WhatsappTemplate = require("./whatsappTemplate.model")(sequelize, DataTypes);
const WhatsappMessage = require("./whatsappMessage.model")(sequelize, DataTypes);
const TeamMember = require("./teamMember.model")(sequelize, DataTypes);

// ---- Associations ----

// A User (owner) can own multiple Venues (multi-hall support, day-one design)
User.hasMany(Venue, { foreignKey: "owner_id", as: "venues" });
Venue.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

Venue.hasOne(Subscription, { foreignKey: "venue_id", as: "subscription" });
Subscription.belongsTo(Venue, { foreignKey: "venue_id" });

Plan.hasMany(Subscription, { foreignKey: "plan_id", as: "subscriptions" });
Subscription.belongsTo(Plan, { foreignKey: "plan_id", as: "plan" });

Venue.hasMany(Payment, { foreignKey: "venue_id", as: "payments" });
Payment.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(Slot, { foreignKey: "venue_id", as: "slots" });
Slot.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(Inquiry, { foreignKey: "venue_id", as: "inquiries" });
Inquiry.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(Client, { foreignKey: "venue_id", as: "clients" });
Client.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(Booking, { foreignKey: "venue_id", as: "bookings" });
Booking.belongsTo(Venue, { foreignKey: "venue_id" });

Client.hasMany(Booking, { foreignKey: "client_id", as: "bookings" });
Booking.belongsTo(Client, { foreignKey: "client_id", as: "client" });

Slot.hasMany(Booking, { foreignKey: "slot_id", as: "bookings" });
Booking.belongsTo(Slot, { foreignKey: "slot_id", as: "slot" });

Inquiry.belongsTo(Slot, { foreignKey: "slot_id", as: "slot" });
Inquiry.hasOne(Booking, { foreignKey: "inquiry_id", as: "booking" });
Booking.belongsTo(Inquiry, { foreignKey: "inquiry_id" });

Booking.hasMany(PaymentLedger, { foreignKey: "booking_id", as: "ledger" });
PaymentLedger.belongsTo(Booking, { foreignKey: "booking_id" });

Booking.hasMany(Invoice, { foreignKey: "booking_id", as: "invoices" });
Invoice.belongsTo(Booking, { foreignKey: "booking_id" });

Client.hasMany(Invoice, { foreignKey: "client_id", as: "invoices" });
Invoice.belongsTo(Client, { foreignKey: "client_id", as: "client" });

Venue.hasMany(Invoice, { foreignKey: "venue_id", as: "invoices" });
Invoice.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(ServiceItem, { foreignKey: "venue_id", as: "serviceItems" });
ServiceItem.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(TeamMember, { foreignKey: "venue_id", as: "teamMembers" });
TeamMember.belongsTo(Venue, { foreignKey: "venue_id" });

Venue.hasMany(WhatsappMessage, { foreignKey: "venue_id", as: "whatsappMessages" });
WhatsappMessage.belongsTo(Venue, { foreignKey: "venue_id" });

module.exports = {
  sequelize,
  User,
  Venue,
  Plan,
  Subscription,
  Payment,
  Slot,
  Inquiry,
  Booking,
  Client,
  PaymentLedger,
  Invoice,
  ServiceItem,
  WhatsappTemplate,
  WhatsappMessage,
  TeamMember
};