import React from "react";
import VendorCard from "../search/VendorCard";

export default function FeaturedVendorsSection({ vendors = [] }) {
  if (vendors.length === 0) return null;

  return (
    <section className="py-14" style={{ background: "#f8f9fb" }}>
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900 mb-6">
          Featured this week
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </div>
      </div>
    </section>
  );
}