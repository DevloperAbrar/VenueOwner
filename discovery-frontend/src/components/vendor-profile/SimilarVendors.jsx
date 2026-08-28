import React from "react";
import VendorCard from "../search/VendorCard";

export default function SimilarVendors({ vendors = [] }) {
  if (!vendors.length) return null;
  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Similar Vendors</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
      </div>
    </div>
  );
}