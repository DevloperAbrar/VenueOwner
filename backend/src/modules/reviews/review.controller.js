const reviewService = require("./review.service");
const { generateOtp, verifyOtp, issueVerificationToken } = require("../../utils/otpService");
const { ReviewRequest } = require("../../database/models");
const { AppError } = require("../../middleware/error.middleware");

async function requestOtp(req, res, next) {
  try {
    const { phone } = req.body;
    if (!phone) throw new AppError("Phone is required", 400);
    const otp = generateOtp(phone);
    console.log(`[OTP] Review OTP for ${phone}: ${otp}`); // TODO(Phase 6): real SMS/WhatsApp OTP provider
    res.json({ success: true, message: "OTP sent" });
  } catch (error) {
    next(error);
  }
}

async function verifyOtpHandler(req, res, next) {
  try {
    const { phone, otp } = req.body;
    const isValid = verifyOtp(phone, otp);
    if (!isValid) throw new AppError("Invalid or expired OTP", 400);
    const token = issueVerificationToken(phone);
    res.json({ success: true, data: { verified: true, token } });
  } catch (error) {
    next(error);
  }
}

async function submit(req, res, next) {
  try {
    const review = await reviewService.submitMarketplaceReview(req.body.venue_id, req.body);
    res.status(201).json({ success: true, message: "Review submitted for approval", data: { id: review.id } });
  } catch (error) {
    next(error);
  }
}

// Pre-authenticated via unique token (from the post-booking WhatsApp link) — no OTP needed
async function submitViaToken(req, res, next) {
  try {
    const { token } = req.params;
    const request = await ReviewRequest.findOne({ where: { review_token: token, review_submitted: false } });
    if (!request) throw new AppError("This review link is invalid or has already been used", 404);

    const review = await reviewService.submitBookingReview(request.venue_id, request.booking_id, req.body);

    request.review_submitted = true;
    await request.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

async function getByVenue(req, res, next) {
  try {
    const result = await reviewService.getVenueReviews(req.params.venueId);
    const responseRateBadge = await reviewService.getResponseRateBadge(req.params.venueId);
    res.json({ success: true, data: { ...result, response_rate_badge: responseRateBadge } });
  } catch (error) {
    next(error);
  }
}

async function reply(req, res, next) {
  try {
    const review = await reviewService.ownerReply(req.params.reviewId, req.user.id, req.body.reply_text);
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

// Admin
async function adminPending(req, res, next) {
  try {
    const reviews = await reviewService.adminGetPending();
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
}

async function adminApprove(req, res, next) {
  try {
    const review = await reviewService.adminApprove(req.params.reviewId);
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

async function adminReject(req, res, next) {
  try {
    const review = await reviewService.adminReject(req.params.reviewId);
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requestOtp, verifyOtpHandler, submit, submitViaToken, getByVenue, reply,
  adminPending, adminApprove, adminReject
};