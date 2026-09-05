import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import Button from "../../../components/common/Button";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { showSuccess, showError } from "../../../components/common/Toast";
import { formatCurrency, formatDate } from "../../../lib/formatters";
import api from "../../../services/api";
import {
  Check,
  Zap,
  Star,
  Crown,
  Rocket,
  CalendarDays,
  CreditCard,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

// Map plan names to icons + accent colours
const PLAN_STYLE = {
  Free:    { icon: Zap,    color: "text-navy-400",   ring: "border-navy-200",    badge: "bg-navy-50 text-navy-600" },
  Basic:   { icon: Star,   color: "text-sky-500",    ring: "border-sky-200",     badge: "bg-sky-50 text-sky-700" },
  Starter: { icon: Rocket, color: "text-primary-500", ring: "border-primary-200", badge: "bg-primary-50 text-primary-700" },
  Growth:  { icon: Crown,  color: "text-gold-600",   ring: "border-gold-400",    badge: "bg-gold-50 text-gold-600" },
  Pro:     { icon: Crown,  color: "text-emerald-500",ring: "border-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
};

function getPlanStyle(name) {
  return PLAN_STYLE[name] || PLAN_STYLE.Basic;
}

// Days left helper
function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86400000);
  return diff > 0 ? diff : 0;
}

export default function SubscriptionDetails() {
  const { venue, refetchVenue } = useVenue();
  const { data: subscription, loading, refetch: refetchSub } = useFetch(
    venue ? `/subscriptions/${venue.id}` : null,
    { skip: !venue }
  );
  const { data: plans, loading: plansLoading } = useFetch("/plans");
  const { data: payments, loading: paymentsLoading } = useFetch(
    venue ? `/payments?venueId=${venue.id}` : null,
    { skip: !venue }
  );

  const [upgradeTarget, setUpgradeTarget] = useState(null); // plan object user wants to switch to
  const [switching, setSwitching] = useState(false);

  if (loading || plansLoading) return <Loader fullScreen />;

  const currentPlanId = subscription?.plan?.id;
  const trialDays = daysLeft(subscription?.trial_ends_at);
  const isTrial = subscription?.status === "trial";

  const handleChangePlan = async () => {
    if (!upgradeTarget) return;
    setSwitching(true);
    try {
      await api.patch(`/subscriptions/${venue.id}/change-plan`, { planId: upgradeTarget.id });
      showSuccess(`Switched to ${upgradeTarget.name} plan!`);
      setUpgradeTarget(null);
      refetchSub();
      refetchVenue?.();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to change plan");
    } finally {
      setSwitching(false);
    }
  };

  const isDowngrade = (plan) => plan.monthly_price < (subscription?.plan?.monthly_price ?? 0);

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Subscription">

      {/* ── Current plan banner ── */}
      <CurrentPlanBanner subscription={subscription} trialDays={trialDays} isTrial={isTrial} />

      {/* ── Plan grid ── */}
      <div className="mb-8">
        <h2 className="text-base font-display font-semibold text-navy-800 mb-1">All Plans</h2>
        <p className="text-sm text-navy-400 mb-5">
          {isTrial
            ? `You're on a free trial. Upgrade anytime  - your trial carries over.`
            : "Switch plans anytime. Price changes take effect immediately."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(plans || []).map((plan) => {
            const style = getPlanStyle(plan.name);
            const Icon = style.icon;
            const isCurrent = plan.id === currentPlanId;
            const down = isDowngrade(plan);

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-5 border-2 flex flex-col transition-all ${
                  isCurrent ? `${style.ring} shadow-card` : "border-navy-100 hover:border-navy-200 hover:shadow-card"
                }`}
              >
                {isCurrent && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full ${style.badge}`}>
                    Current Plan
                  </span>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className={style.color} />
                  <span className="font-display font-semibold text-navy-800">{plan.name}</span>
                </div>

                <div className="mb-1">
                  <span className="text-2xl font-display font-bold text-navy-900">{formatCurrency(plan.monthly_price)}</span>
                  <span className="text-sm text-navy-400">/mo</span>
                </div>

                {plan.trial_days > 0 && (
                  <p className="text-xs text-sky-600 font-medium mb-3">{plan.trial_days}-day free trial</p>
                )}
                {plan.trial_days === 0 && <p className="text-xs text-navy-400 mb-3">No trial  - start immediately</p>}

                <ul className="space-y-1.5 mb-5 flex-1">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-navy-600">
                      <Check size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium justify-center py-2">
                    <CheckCircle2 size={14} /> Active
                  </div>
                ) : (
                  <Button
                    variant={down ? "outline" : "primary"}
                    className="w-full text-sm"
                    onClick={() => setUpgradeTarget(plan)}
                  >
                    {down ? "Switch" : "Upgrade"} <ArrowRight size={13} className="ml-1" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Payment history ── */}
      <div className="bg-white rounded-2xl shadow-card border border-navy-100/60 p-4 md:p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-navy-400" />
          <h2 className="font-display font-semibold text-navy-800">Payment History</h2>
        </div>
        {paymentsLoading ? (
          <Loader />
        ) : (payments || []).length === 0 ? (
          <p className="text-sm text-navy-400 py-4 text-center">No payments yet</p>
        ) : (
          <>
            {/* Mobile: stacked rows */}
            <div className="md:hidden divide-y divide-navy-100/60">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-navy-800 text-sm">{formatCurrency(p.amount)}</p>
                    <p className="text-xs text-navy-400 mt-0.5">{formatDate(p.created_at)}</p>
                  </div>
                  <Badge status={p.status || "paid"} />
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <table className="hidden md:table w-full text-sm">
              <thead>
                <tr className="text-left text-navy-400 text-xs border-b border-navy-100/60">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-navy-100/60 last:border-0">
                    <td className="py-2.5 text-navy-600">{formatDate(p.created_at)}</td>
                    <td className="py-2.5 font-medium text-navy-900">{formatCurrency(p.amount)}</td>
                    <td className="py-2.5"><Badge status={p.status || "paid"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* ── Confirm plan change dialog ── */}
      <ConfirmDialog
        isOpen={!!upgradeTarget}
        onClose={() => setUpgradeTarget(null)}
        onConfirm={handleChangePlan}
        loading={switching}
        title={`Switch to ${upgradeTarget?.name}?`}
        message={
          upgradeTarget
            ? isDowngrade(upgradeTarget)
              ? `You'll move from ${subscription?.plan?.name} (${formatCurrency(subscription?.plan?.monthly_price)}/mo) to ${upgradeTarget.name} (${formatCurrency(upgradeTarget.monthly_price)}/mo). Some features will no longer be available.`
              : `You'll upgrade from ${subscription?.plan?.name} to ${upgradeTarget?.name} at ${formatCurrency(upgradeTarget?.monthly_price)}/month. New features unlock immediately.`
            : ""
        }
        confirmText={upgradeTarget && isDowngrade(upgradeTarget) ? "Yes, switch" : "Upgrade now"}
      />
    </DashboardLayout>
  );
}

function CurrentPlanBanner({ subscription, trialDays, isTrial }) {
  if (!subscription) return null;
  const plan = subscription.plan;
  const style = getPlanStyle(plan?.name);
  const Icon = style.icon;

  return (
    <div className="bg-white rounded-2xl shadow-card border border-navy-100/60 p-4 md:p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${style.badge}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="font-display font-semibold text-navy-900 text-base">{plan?.name} Plan</span>
          <Badge status={subscription.status} />
        </div>
        <p className="text-sm text-navy-500">
          {formatCurrency(subscription.locked_price)}/month
          {isTrial && trialDays !== null && (
            <span className="ml-2 text-gold-600 font-medium">
              · {trialDays} day{trialDays !== 1 ? "s" : ""} left in trial
            </span>
          )}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-navy-400">
          <CalendarDays size={13} />
          <span>{isTrial ? "Trial ends" : "Renews"} {formatDate(subscription.current_period_end)}</span>
        </div>
      </div>
    </div>
  );
}