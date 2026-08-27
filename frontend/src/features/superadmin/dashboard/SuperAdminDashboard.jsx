import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { adminSidebarItems } from "../adminSidebarItems.js";
import { useFetch } from "../../../hooks/useFetch";
import StatsCards from "./StatsCards.jsx";
import RevenueGraph from "./RevenueGraph.jsx";
import ActivityFeed from "./ActivityFeed.jsx";
import Loader from "../../../components/common/Loader";

export default function SuperAdminDashboard() {
  const { data: stats, loading: statsLoading } = useFetch("/analytics/admin/dashboard");
  const { data: mrrTrend, loading: trendLoading } = useFetch("/analytics/admin/mrr-trend");

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} pageTitle="Dashboard">
      {statsLoading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <StatsCards stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {!trendLoading && <RevenueGraph data={mrrTrend} />}
            <ActivityFeed activities={[]} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}