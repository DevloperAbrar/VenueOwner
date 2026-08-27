const express = require("express");
const { handleWebhook } = require("./payment.controller");

// Razorpay webhooks need the RAW body for signature verification,
// so this route is mounted separately in app.js BEFORE express.json() applies globally.
const router = express.Router();

router.post("/razorpay", express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }), handleWebhook);

module.exports = router;