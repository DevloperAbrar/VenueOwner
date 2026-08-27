const { Op, fn, col, literal } = require("sequelize");
const dayjs = require("dayjs");
const {
  Venue,
  Subscription,
  Payment,
  Booking,
  Inquiry,
  Slot
} = require("../../database/models");

// ---------- SUPER ADMIN ANALYTICS ----------

async function getMrrTrend(req, res, next) {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = dayjs().subtract(i, "month").startOf("month");
      const monthEnd = dayjs().subtract(i, "month").endOf("month");

      const revenue = await Payment.sum("amount", {
        where: {
          status: "success",
          created_at: { [Op.between]: [monthStart.toDate(), monthEnd.toDate()] }
        }
      });

      months.push({ month: monthStart.format("MMM YYYY"), revenue: revenue || 0 });
    }

    res.json({ success: true, data: months });
  } catch (error) {
    next(error);
  }
}

async function getChurnRate(req, res, next) {
  try {
    const totalActive = await Subscription.count({ where: { status: ["active", "trial", "expiring_soon"] } });
    const expiredThisMonth = await Subscription.count({
      where: {
        status: "expired",
        updated_at: { [Op.gte]: dayjs().startOf("month").toDate() }
      }
    });

    const churnRate = totalActive > 0 ? +((expiredThisMonth / (totalActive + expiredThisMonth)) * 100).toFixed(2) : 0;

    res.json({ success: true, data: { churnRate, totalActive, expiredThisMonth } });
  } catch (error) {
    next(error);
  }
}

async function getDistribution(req, res, next) {
  try {
    const byCity = await Venue.findAll({
      attributes: ["city", [fn("COUNT", col("id")), "count"]],
      group: ["city"]
    });

    const byPlan = await Subscription.findAll({
      attributes: [[col("plan.name"), "planName"], [fn("COUNT", col("Subscription.id")), "count"]],
      include: [{ association: "plan", attributes: [] }],
      group: ["plan.id", "plan.name"]
    });

    res.json({ success: true, data: { byCity, byPlan } });
  } catch (error) {
    next(error);
  }
}

async function getTrialConversion(req, res, next) {
  try {
    const totalTrials = await Subscription.count({
      where: { trial_ends_at: { [Op.ne]: null } }
    });
    const convertedTrials = await Subscription.count({
      where: { trial_ends_at: { [Op.ne]: null }, status: "active" }
    });

    const conversionRate = totalTrials > 0 ? +((convertedTrials / totalTrials) * 100).toFixed(2) : 0;

    res.json({ success: true, data: { totalTrials, convertedTrials, conversionRate } });
  } catch (error) {
    next(error);
  }
}

async function getAdminDashboardStats(req, res, next) {
  try {
    const totalVenues = await Venue.count();
    const activeSubs = await Subscription.count({ where: { status: "active" } });
    const trialSubs = await Subscription.count({ where: { status: "trial" } });
    const expiredSubs = await Subscription.count({ where: { status: "expired" } });
    const suspendedVenues = await Venue.count({ where: { is_active: false } });

    const mrr = await Subscription.sum("locked_price", { where: { status: "active" } });

    const newSignupsThisWeek = await Venue.count({
      where: { created_at: { [Op.gte]: dayjs().subtract(7, "day").toDate() } }
    });

    const expiringSoon = await Subscription.count({ where: { status: "expiring_soon" } });

    res.json({
      success: true,
      data: {
        totalVenues,
        activeSubs,
        trialSubs,
        expiredSubs,
        suspendedVenues,
        mrr: mrr || 0,
        newSignupsThisWeek,
        expiringSoon
      }
    });
  } catch (error) {
    next(error);
  }
}

// ---------- VENUE OWNER ANALYTICS ----------

async function getOwnerAnalytics(req, res, next) {
  try {
    const venueId = req.params.venueId;

    const monthlyBookings = await Booking.count({
      where: {
        venue_id: venueId,
        created_at: { [Op.gte]: dayjs().startOf("month").toDate() }
      }
    });

    const monthlyRevenue = await Booking.sum("amount_received", {
      where: {
        venue_id: venueId,
        created_at: { [Op.gte]: dayjs().startOf("month").toDate() }
      }
    });

    const totalInquiries = await Inquiry.count({ where: { venue_id: venueId } });
    const convertedInquiries = await Inquiry.count({ where: { venue_id: venueId, status: "confirmed" } });

    const totalPendingPayments = await Booking.sum("balance_pending", { where: { venue_id: venueId } });

    // 6-month revenue trend
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const start = dayjs().subtract(i, "month").startOf("month");
      const end = dayjs().subtract(i, "month").endOf("month");
      const revenue = await Booking.sum("amount_received", {
        where: { venue_id: venueId, created_at: { [Op.between]: [start.toDate(), end.toDate()] } }
      });
      trend.push({ month: start.format("MMM YYYY"), revenue: revenue || 0 });
    }

    res.json({
      success: true,
      data: {
        monthlyBookings,
        monthlyRevenue: monthlyRevenue || 0,
        totalInquiries,
        convertedInquiries,
        conversionRate: totalInquiries > 0 ? +((convertedInquiries / totalInquiries) * 100).toFixed(2) : 0,
        totalPendingPayments: totalPendingPayments || 0,
        revenueTrend: trend
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getSlotPopularity(req, res, next) {
  try {
    const venueId = req.params.venueId;

    const popularity = await Booking.findAll({
      where: { venue_id: venueId },
      attributes: [[col("slot.name"), "slotName"], [fn("COUNT", col("Booking.id")), "bookingCount"]],
      include: [{ model: Slot, as: "slot", attributes: [] }],
      group: ["slot.id", "slot.name"]
    });

    res.json({ success: true, data: popularity });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMrrTrend,
  getChurnRate,
  getDistribution,
  getTrialConversion,
  getAdminDashboardStats,
  getOwnerAnalytics,
  getSlotPopularity
};