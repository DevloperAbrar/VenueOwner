import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Loader from "../../../components/common/Loader";
import Card from "../../../components/common/Card";
import SetupChecklist from "./SetupChecklist.jsx";
import { formatCurrency } from "../../../lib/formatters";
import { Copy } from "lucide-react";
import { showSuccess } from "../../../components/common/Toast";
import { BASE_DOMAIN } from "../../../lib/constants";
import MarketplaceProfileChecklist from "../marketplace-profile/MarketplaceProfileChecklist.jsx";

export default function OwnerDashboard() {
  const { venue, loading: venueLoading } = useVenue();

  if (venueLoading) return <Loader fullScreen />;
  if (!venue) return <Navigate to="/dashboard/onboarding/plan" replace />;

  return <DashboardContent venue={venue} />;
}

function DashboardContent({ venue }) {
  const { data: analytics, loading } = useFetch(`/analytics/owner/${venue.id}`);
  const { data: marketplace } = useFetch(`/venues/${venue.id}/marketplace-profile/completion`);
  const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const publicUrl = isDev
    ? `${window.location.protocol}//${venue.subdomain}.${window.location.host}`
    : `https://${venue.subdomain}.${BASE_DOMAIN}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    showSuccess("Link copied to clipboard");
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle={venue.hall_name}>
      <SetupChecklist
        completedSteps={venue.setup_completed_steps || []}
        planFeatures={venue.subscription?.plan?.features || []}
        pageSections={venue.page_sections || []}
      />
      <MarketplaceProfileChecklist percentage={marketplace?.percentage ?? 0} />

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Your public website</p>
          <p className="font-medium text-primary-700">{publicUrl}</p>
        </div>
        <button onClick={copyLink} className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <Copy size={14} /> Copy Link
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><p className="text-xs text-gray-400">This Month's Bookings</p><p className="text-xl font-bold">{analytics?.monthlyBookings}</p></Card>
          <Card><p className="text-xs text-gray-400">This Month's Revenue</p><p className="text-xl font-bold">{formatCurrency(analytics?.monthlyRevenue)}</p></Card>
          <Card><p className="text-xs text-gray-400">Conversion Rate</p><p className="text-xl font-bold">{analytics?.conversionRate}%</p></Card>
          <Card><p className="text-xs text-gray-400">Pending Payments</p><p className="text-xl font-bold">{formatCurrency(analytics?.totalPendingPayments)}</p></Card>
        </div>
      )}
    </DashboardLayout>
  );
}