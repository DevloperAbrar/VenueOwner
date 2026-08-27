import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import { formatCurrency, formatDate } from "../../../lib/formatters";

export default function SubscriptionDetails() {
  const { venue } = useVenue();
  const { data: subscription, loading } = useFetch(venue ? `/subscriptions/${venue.id}` : null, { skip: !venue });
  const { data: payments, loading: paymentsLoading } = useFetch(venue ? `/payments?venueId=${venue.id}` : null, { skip: !venue });

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Subscription">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Current Plan">
          <p className="text-lg font-semibold mb-1">{subscription?.plan?.name}</p>
          <p className="text-sm text-gray-500 mb-2">{formatCurrency(subscription?.locked_price)}/month</p>
          <Badge status={subscription?.status} />
          <p className="text-xs text-gray-400 mt-3">Renews on {formatDate(subscription?.current_period_end)}</p>
        </Card>

        <Card title="Payment History">
          {paymentsLoading ? (
            <Loader />
          ) : (
            <ul className="space-y-2">
              {(payments || []).map((p) => (
                <li key={p.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <span>{formatDate(p.created_at)}</span>
                  <span>{formatCurrency(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}