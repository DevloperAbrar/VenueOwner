import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";
import BreadcrumbNav from "../components/seo/BreadcrumbNav";
import ResultsGrid from "../components/search/ResultsGrid";

export default function CityCategoryLocalityPage() {
  const { city, category, slug: locality } = useParams();
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get(`/city/${city}/category/${category}/locality/${locality}`, { params: { page } })
      .then(({ data }) => setData(data.data));
  }, [city, category, locality, page]);

  if (!data) return <div className="max-w-6xl mx-auto px-4 py-16 text-gray-400">Loading...</div>;

  return (
    <>
      <Helmet>
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
      </Helmet>

      <BreadcrumbNav items={[
        { label: data.city_name, to: `/${city}` },
        { label: data.category.name, to: `/${city}/${category}` },
        { label: data.locality_name }
      ]} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Best {data.category.name} in {data.locality_name}, {data.city_name}
        </h1>
        <ResultsGrid vendors={data.vendors} page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      </div>
    </>
  );
}