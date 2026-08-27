import React from "react";
import Card from "../../../components/common/Card";
import { formatCurrency } from "../../../lib/formatters";

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Total Venues", value: stats.totalVenues },
    { label: "MRR", value: formatCurrency(stats.mrr) },
    { label: "New Signups (7d)", value: stats.newSignupsThisWeek },
    { label: "Expiring Soon", value: stats.expiringSoon },
    { label: "Active", value: stats.activeSubs },
    { label: "Trial", value: stats.trialSubs }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <p className="text-xs text-gray-400 mb-1">{item.label}</p>
          <p className="text-xl font-bold text-gray-800">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}