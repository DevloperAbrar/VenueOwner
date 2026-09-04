import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CATEGORIES, BASE_DOMAIN, BRAND_NAME } from "../lib/constants";
import BreadcrumbNav from "../components/seo/BreadcrumbNav";

export default function CategoriesIndexPage() {
  return (
    <>
      <Helmet>
        <title>All Wedding and Event Categories | {BRAND_NAME}</title>
        <meta name="description" content={`Browse every wedding and event vendor category on ${BRAND_NAME}, from banquet halls and marriage halls to photographers, decorators, caterers, DJs, mehndi artists and event management companies.`} />
        <link rel="canonical" href={`https://www.${BASE_DOMAIN}/categories`} />
      </Helmet>

      <BreadcrumbNav items={[{ label: "Categories" }]} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Browse by Category</h1>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">
          Every wedding and event category available on {BRAND_NAME}. Pick one to see verified vendors near you.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <p className="text-sm font-medium text-gray-700">{cat.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}