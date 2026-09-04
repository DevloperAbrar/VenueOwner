import React from "react";
import { Link } from "react-router-dom";

export default function CategoryGrid({ categories = [] }) {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-gray-900">
            Browse by category
          </h2>
          <Link to="/categories" className="text-sm font-semibold hover:underline" style={{ color: "#e8192c" }}>
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              className="bg-gray-50 hover:bg-primary-50 border border-gray-100 hover:border-primary-200 rounded-xl px-4 py-4 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors text-center"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}