const jwt = require("jsonwebtoken");
const env = require("../config/env");

// In-memory store — fine for a single-instance MVP.
// TODO(Phase 6): move to Redis once Redis is added, so this survives restarts and works across multiple app instances.
const otpStore = new Map();

function generateOtp(phone) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
  return otp;
}

function verifyOtp(phone, otp) {
  const entry = otpStore.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }
  if (entry.otp !== otp) return false;
  otpStore.delete(phone);
  return true;
}

// Short-lived proof-of-verification token, issued after a successful verifyOtp call.
function issueVerificationToken(phone) {
  return jwt.sign({ phone, purpose: "otp_verified" }, env.jwt.secret, { expiresIn: "15m" });
}

function verifyVerificationToken(token, phone) {
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    return decoded.purpose === "otp_verified" && decoded.phone === phone;
  } catch {
    return false;
  }
}

module.exports = { generateOtp, verifyOtp, issueVerificationToken, verifyVerificationToken };