import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Map, LayoutGrid } from "lucide-react";
import api from "../lib/api";
import FilterSidebar from "../components/search/FilterSidebar";
import ResultsGrid from "../components/search/ResultsGrid";
import SearchBar from "../components/search/SearchBar";
import MapView from "../components/search/MapView";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState({ results: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const filters = Object.fromEntries(params.entries());

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get("/search", { params: filters })
      .then(({ data }) => {
        setResult(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Search API failed:", err);
        setError(err?.response?.data?.message || err.message || "Something went wrong.");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  const updateFilters = (next) => {
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== "" && v !== undefined));
    setParams(clean);
  };

  return (
    <>
      <Helmet><title>Search Vendors - CampusSafar</title></Helmet>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6"><SearchBar /></div>

        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar filters={filters} onChange={updateFilters} />

          <div className="flex-1">
            {/* Map / List toggle */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {!loading && result.total > 0 && `${result.total} vendors found`}
              </p>
              <button
                onClick={() => setShowMap((v) => !v)}
                className={[
                  "flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors",
                  showMap
                    ? "bg-primary-50 border-primary-200 text-primary-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50",
                ].join(" ")}
              >
                {showMap
                  ? <><LayoutGrid size={15} /> List View</>
                  : <><Map size={15} /> Map View</>
                }
              </button>
            </div>

            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
            ) : error ? (
              <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {error}
              </p>
            ) : showMap ? (
              <MapView
                vendors={result.results}
                onClose={() => setShowMap(false)}
              />
            ) : (
              <ResultsGrid
                vendors={result.results}
                page={result.page}
                totalPages={result.totalPages}
                onPageChange={(p) => updateFilters({ ...filters, page: p })}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}