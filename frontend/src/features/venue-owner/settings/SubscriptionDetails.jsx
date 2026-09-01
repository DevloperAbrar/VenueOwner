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
  Free:    { icon: Zap,    color: "text-gray-500",   ring: "border-gray-200",    badge: "bg-gray-100 text-gray-600" },
  Basic:   { icon: Star,   color: "text-blue-500",   ring: "border-blue-200",    badge: "bg-blue-50 text-blue-700" },
  Starter: { icon: Rocket, color: "text-purple-500", ring: "border-purple-200",  badge: "bg-purple-50 text-purple-700" },
  Growth:  { icon: Crown,  color: "text-amber-500",  ring: "border-amber-300",   badge: "bg-amber-50 text-amber-700" },
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
        <h2 className="text-base font-semibold text-gray-800 mb-1">All Plans</h2>
        <p className="text-sm text-gray-500 mb-5">
          {isTrial
            ? `You're on a free trial. Upgrade anytime — your trial carries over.`
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
                  isCurrent ? `${style.ring} shadow-md` : "border-gray-100 hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                {isCurrent && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full ${style.badge}`}>
                    Current Plan
                  </span>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className={style.color} />
                  <span className="font-semibold text-gray-800">{plan.name}</span>
                </div>

                <div className="mb-1">
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(plan.monthly_price)}</span>
                  <span className="text-sm text-gray-400">/mo</span>
                </div>

                {plan.trial_days > 0 && (
                  <p className="text-xs text-blue-600 font-medium mb-3">{plan.trial_days}-day free trial</p>
                )}
                {plan.trial_days === 0 && <p className="text-xs text-gray-400 mb-3">No trial — start immediately</p>}

                <ul className="space-y-1.5 mb-5 flex-1">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
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
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-gray-400" />
          <h2 className="font-semibold text-gray-800">Payment History</h2>
        </div>
        {paymentsLoading ? (
          <Loader />
        ) : (payments || []).length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No payments yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b border-gray-50">
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 text-gray-600">{formatDate(p.created_at)}</td>
                  <td className="py-2.5 font-medium">{formatCurrency(p.amount)}</td>
                  <td className="py-2.5"><Badge status={p.status || "paid"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${style.badge}`}>
        <Icon size={22} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="font-semibold text-gray-900 text-base">{plan?.name} Plan</span>
          <Badge status={subscription.status} />
        </div>
        <p className="text-sm text-gray-500">
          {formatCurrency(subscription.locked_price)}/month
          {isTrial && trialDays !== null && (
            <span className="ml-2 text-amber-600 font-medium">
              · {trialDays} day{trialDays !== 1 ? "s" : ""} left in trial
            </span>
          )}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <CalendarDays size={13} />
          <span>{isTrial ? "Trial ends" : "Renews"} {formatDate(subscription.current_period_end)}</span>
        </div>
      </div>
    </div>
  );
}