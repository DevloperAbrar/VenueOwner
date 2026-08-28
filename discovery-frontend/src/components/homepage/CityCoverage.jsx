import React from "react";
import { Link } from "react-router-dom";
import { slugify } from "../../lib/seoHelpers";

export default function CityCoverage({ cities = [] }) {
  if (!cities.length) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-xl font-bold text-gray-800 mb-5">Explore by City</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {cities.map((c) => (
          <Link
            key={c.city}
            to={`/${slugify(c.city)}`}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-primary-300"
          >
            <p className="font-medium text-gray-800 text-sm">{c.city}</p>
            <p className="text-xs text-gray-400">{c.vendor_count} vendors</p>
          </Link>
        ))}
      </div>
    </section>
  );
}