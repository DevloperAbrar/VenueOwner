import React from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { adminSidebarItems } from "../adminSidebarItems.js";
import { useFetch } from "../../../hooks/useFetch";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import VenueActions from "./VenueActions.jsx";
import { formatDate, formatCurrency } from "../../../lib/formatters";

export default function VenueDetail() {
  const { id } = useParams();
  const { data: venue, loading, refetch } = useFetch(`/venues/${id}`);

  if (loading) return <Loader fullScreen />;
  if (!venue) return null;

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} pageTitle={venue.hall_name}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Venue Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-gray-400">Owner</dt><dd>{venue.owner_name}</dd></div>
            <div><dt className="text-gray-400">Phone</dt><dd>{venue.phone}</dd></div>
            <div><dt className="text-gray-400">City</dt><dd>{venue.city}</dd></div>
            <div><dt className="text-gray-400">Capacity</dt><dd>{venue.capacity}</dd></div>
            <div><dt className="text-gray-400">Subdomain</dt><dd>{venue.subdomain}.venuesafar.com</dd></div>
            <div><dt className="text-gray-400">Live</dt><dd>{venue.is_live ? "Yes" : "No"}</dd></div>
          </dl>
        </Card>

        <Card title="Subscription">
          <p className="text-sm mb-1">Plan: <strong>{venue.subscription?.plan?.name || "-"}</strong></p>
          <p className="text-sm mb-1">Locked Price: {formatCurrency(venue.subscription?.locked_price)}</p>
          <p className="text-sm mb-2">Status: <Badge status={venue.subscription?.status} /></p>
          <p className="text-xs text-gray-400">Renews: {formatDate(venue.subscription?.current_period_end)}</p>
        </Card>
      </div>

      <div className="mt-6">
        <VenueActions venue={venue} onUpdated={refetch} />
      </div>
    </DashboardLayout>
  );
}