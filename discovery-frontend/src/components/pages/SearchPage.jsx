import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";
import FilterSidebar from "../components/search/FilterSidebar";
import ResultsGrid from "../components/search/ResultsGrid";
import SearchBar from "../components/search/SearchBar";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState({ results: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const filters = Object.fromEntries(params.entries());

  useEffect(() => {
    setLoading(true);
    api.get("/search", { params: filters }).then(({ data }) => {
      setResult(data.data);
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
            {loading ? (
              <p className="text-gray-400 text-sm">Loading...</p>
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