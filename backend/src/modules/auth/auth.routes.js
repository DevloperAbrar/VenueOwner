const express = require("express");
const passport = require("./google.strategy");
const {
  adminLogin,
  googleCallback,
  refreshAccessToken,
  logout,
  getCurrentUser
} = require("./auth.controller");
const { authenticate } = require("../../middleware/auth.middleware");
const { authLimiter } = require("../../middleware/rateLimiter.middleware");

const router = express.Router();

// Super Admin
router.post("/admin/login", authLimiter, adminLogin);

// Venue Owner (Google OAuth)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=auth_failed" }),
  googleCallback
);

// Shared
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;