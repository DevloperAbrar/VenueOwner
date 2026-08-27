import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Card from "../../../components/common/Card";
import Loader from "../../../components/common/Loader";
import SlotPopularityChart from "./SlotPopularityChart.jsx";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../../../lib/formatters";

export default function OwnerAnalytics() {
  const { venue } = useVenue();
  const { data: analytics, loading } = useFetch(venue ? `/analytics/owner/${venue.id}` : null, { skip: !venue });
  const { data: slotPopularity, loading: slotLoading } = useFetch(venue ? `/analytics/owner/${venue.id}/slot-popularity` : null, { skip: !venue });

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Analytics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card><p className="text-xs text-gray-400">Monthly Bookings</p><p className="text-xl font-bold">{analytics?.monthlyBookings}</p></Card>
        <Card><p className="text-xs text-gray-400">Monthly Revenue</p><p className="text-xl font-bold">{formatCurrency(analytics?.monthlyRevenue)}</p></Card>
        <Card><p className="text-xs text-gray-400">Inquiry Conversion</p><p className="text-xl font-bold">{analytics?.conversionRate}%</p></Card>
        <Card><p className="text-xs text-gray-400">Pending Payments</p><p className="text-xl font-bold">{formatCurrency(analytics?.totalPendingPayments)}</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="6-Month Revenue Trend">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={analytics?.revenueTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {!slotLoading && <SlotPopularityChart data={slotPopularity} />}
      </div>
    </DashboardLayout>
  );
}