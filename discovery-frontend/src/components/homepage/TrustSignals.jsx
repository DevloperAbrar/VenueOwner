import React from "react";

export default function TrustSignals({ stats }) {
  if (!stats) return null;

  const items = [
    { label: "Active Vendors", value: stats.total_vendors },
    { label: "Cities Covered", value: stats.cities_covered },
    { label: "Events Completed", value: stats.events_completed }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-3 gap-4 text-center">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-2xl md:text-3xl font-bold text-primary-700">{item.value}+</p>
          <p className="text-sm text-gray-500">{item.label}</p>
        </div>
      ))}
    </section>
  );
}