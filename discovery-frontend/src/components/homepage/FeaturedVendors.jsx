import React from "react";
import VendorCard from "../search/VendorCard";

export default function FeaturedVendors({ vendors = [] }) {
  if (!vendors.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Featured Vendors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
      </div>
    </section>
  );
}