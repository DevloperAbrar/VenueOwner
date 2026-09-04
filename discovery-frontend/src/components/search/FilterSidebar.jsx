import React from "react";
import { CATEGORIES, SORT_OPTIONS } from "../../lib/constants";

export default function FilterSidebar({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="w-full md:w-64 flex-shrink-0 space-y-5 bg-white border border-gray-100 rounded-xl p-4">
      <div>
        <label className="text-sm font-medium text-gray-700">City</label>
        <input
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          value={filters.city || ""}
          onChange={(e) => update("city", e.target.value)}
          placeholder="e.g. Indore"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          value={filters.category || ""}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Min budget</label>
          <input type="number" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filters.budget_min || ""} onChange={(e) => update("budget_min", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Max budget</label>
          <input type="number" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            value={filters.budget_max || ""} onChange={(e) => update("budget_max", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Minimum rating</label>
        <select
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          value={filters.rating || ""}
          onChange={(e) => update("rating", e.target.value)}
        >
          <option value="">Any</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="4.5">4.5+</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Sort by</label>
        <select
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          value={filters.sort || "relevant"}
          onChange={(e) => update("sort", e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  );
}