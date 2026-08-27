const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const venueRoutes = require("../modules/venues/venue.routes");
const planRoutes = require("../modules/plans/plan.routes");
const subscriptionRoutes = require("../modules/subscriptions/subscription.routes");
const paymentRoutes = require("../modules/payments/payment.routes");
const razorpayWebhookRoutes = require("../modules/payments/razorpay.webhook");
const slotRoutes = require("../modules/slots/slot.routes");
const inquiryRoutes = require("../modules/inquiries/inquiry.routes");
const bookingRoutes = require("../modules/bookings/booking.routes");
const clientRoutes = require("../modules/clients/client.routes");
const billingRoutes = require("../modules/billing/billing.routes");
const publicInvoiceVerifyRoutes = require("../modules/billing/verify.routes");
const whatsappRoutes = require("../modules/whatsapp/whatsapp.routes");
const analyticsRoutes = require("../modules/analytics/analytics.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/venues", venueRoutes);
router.use("/plans", planRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/payments", paymentRoutes);
router.use("/webhooks", razorpayWebhookRoutes);

// Nested-by-venue resources (mergeParams routers)
router.use("/venues/:venueId/slots", slotRoutes);
router.use("/venues/:venueId/inquiries", inquiryRoutes);
router.use("/venues/:venueId/bookings", bookingRoutes);
router.use("/venues/:venueId/clients", clientRoutes);
router.use("/venues/:venueId/billing", billingRoutes);

// Public, unauthenticated — invoice authenticity verification (scanned via QR on PDF)
router.use("/public/invoices", publicInvoiceVerifyRoutes);

router.use("/whatsapp", whatsappRoutes);
router.use("/analytics", analyticsRoutes);

module.exports = router;