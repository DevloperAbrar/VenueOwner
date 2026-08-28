import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "../search/SearchBar";
import { CATEGORY_SLUGS } from "../../lib/constants";
import { titleCase } from "../../lib/seoHelpers";

export default function HeroSearch({ topCities = [] }) {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Find the perfect vendor for your wedding & events
        </h1>
        <SearchBar large />

        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {topCities.slice(0, 10).map((c) => (
            <Link key={c.city} to={`/search?city=${c.city}`} className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full text-gray-600 hover:border-primary-300">
              {c.city} ({c.vendor_count})
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORY_SLUGS.slice(0, 8).map((slug) => (
            <Link key={slug} to={`/search?category=${slug}`} className="text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-100">
              {titleCase(slug)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}