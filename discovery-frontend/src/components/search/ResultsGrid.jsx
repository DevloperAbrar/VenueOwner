import React from "react";
import VendorCard from "./VendorCard";

export default function ResultsGrid({ vendors = [], page, totalPages, onPageChange }) {
  if (!vendors.length) {
    return <div className="text-center py-16 text-gray-400">No vendors found. Try adjusting your filters.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm ${p === page ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}