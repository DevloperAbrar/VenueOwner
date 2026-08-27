import React from "react";
import { Routes, Route } from "react-router-dom";

import SuperAdminDashboard from "../features/superadmin/dashboard/SuperAdminDashboard.jsx";
import VenueList from "../features/superadmin/venues/VenueList.jsx";
import VenueDetail from "../features/superadmin/venues/VenueDetail.jsx";
import PlanList from "../features/superadmin/plans/PlanList.jsx";
import PaymentList from "../features/superadmin/payments/PaymentList.jsx";
import MessageComposer from "../features/superadmin/whatsapp-center/MessageComposer.jsx";
import AdminAnalytics from "../features/superadmin/analytics/AdminAnalytics.jsx";
import PlatformSettings from "../features/superadmin/settings/PlatformSettings.jsx";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route index element={<SuperAdminDashboard />} />
      <Route path="venues" element={<VenueList />} />
      <Route path="venues/:id" element={<VenueDetail />} />
      <Route path="plans" element={<PlanList />} />
      <Route path="payments" element={<PaymentList />} />
      <Route path="whatsapp" element={<MessageComposer />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="settings" element={<PlatformSettings />} />
    </Routes>
  );
}