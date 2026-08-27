import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { adminSidebarItems } from "../adminSidebarItems.js";
import { useFetch } from "../../../hooks/useFetch";
import Card from "../../../components/common/Card";
import Loader from "../../../components/common/Loader";
import ChurnChart from "./ChurnChart.jsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminAnalytics() {
  const { data: churn, loading: churnLoading } = useFetch("/analytics/admin/churn");
  const { data: distribution, loading: distLoading } = useFetch("/analytics/admin/distribution");
  const { data: conversion, loading: convLoading } = useFetch("/analytics/admin/trial-conversion");

  if (churnLoading || distLoading || convLoading) return <Loader fullScreen />;

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} pageTitle="Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChurnChart churnRate={churn?.churnRate} />

        <Card title="Trial → Paid Conversion" className="lg:col-span-2 flex flex-col justify-center">
          <p className="text-4xl font-bold text-primary-600">{conversion?.conversionRate}%</p>
          <p className="text-sm text-gray-400 mt-2">
            {conversion?.convertedTrials} of {conversion?.totalTrials} trials converted
          </p>
        </Card>

        <Card title="Venues by City" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={distribution?.byCity}>
              <XAxis dataKey="city" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </DashboardLayout>
  );
}