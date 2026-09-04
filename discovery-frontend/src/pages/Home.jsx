import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import HeroBackground from "../components/common/HeroBackground";
import HeroSearch from "../components/homepage/HeroSearch";
import api from "../lib/api";
import { CATEGORIES, BASE_DOMAIN, BRAND_NAME } from "../lib/constants";

import TrustStats from "../components/home/TrustStats";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedVendorsSection from "../components/home/FeaturedVendorsSection";
import WhyUs from "../components/home/WhyUs";
import WhyDifferent from "../components/home/WhyDifferent";
import BudgetCalculator from "../components/home/BudgetCalculator";
import Testimonials from "../components/home/Testimonials";
import VendorCTA from "../components/home/VendorCTA";

export default function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/homepage")
      .then(({ data }) => setHomeData(data.data))
      .catch(() => setHomeData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats     = homeData?.trust_stats;
  const featured  = homeData?.featured_vendors || [];
  const topCities = homeData?.top_cities || [];

  return (
    <>
      <Helmet>
        <title>{BRAND_NAME} - Find Verified Wedding & Event Vendors Near You</title>
        <meta
          name="description"
          content={`Search, compare and directly contact verified banquet halls, decorators, caterers, photographers and every other wedding or event vendor on ${BRAND_NAME}.`}
        />
        <link rel="canonical" href={`https://www.${BASE_DOMAIN}/`} />
      </Helmet>

      {/* Hero — real photo layer + search, untouched */}
      <HeroBackground file="hero.png" opacity={0.35}>
        <HeroSearch topCities={topCities} />
      </HeroBackground>

      <TrustStats stats={stats} />
      <CategoryGrid categories={CATEGORIES} />
      {!loading && <FeaturedVendorsSection vendors={featured} />}
      <WhyUs />
      <WhyDifferent />
      <BudgetCalculator />
      <Testimonials />
      <VendorCTA />
    </>
  );
}