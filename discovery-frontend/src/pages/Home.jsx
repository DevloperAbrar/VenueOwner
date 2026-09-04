import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import HeroBackground from "../components/common/HeroBackground";
import HeroSearch from "../components/homepage/HeroSearch";
import SectionDivider from "../components/common/SectionDivider";
import api from "../lib/api";
import { BASE_DOMAIN, BRAND_NAME } from "../lib/constants";

import CategoriesShowcase from "../components/home/CategoriesShowcase";
import TrustVerification from "../components/home/TrustVerification";
import FeaturedThisWeek from "../components/home/FeaturedThisWeek";
import BuiltForVendors from "../components/home/BuiltForVendors";
import WeddingBudgetPlanner from "../components/home/WeddingBudgetPlanner";
import Testimonials from "../components/home/Testimonials";
import VendorCTA from "../components/home/VendorCTA";

export default function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/homepage")
      .then(({ data }) => setHomeData(data.data))
      .catch(() => setHomeData(null))
      .finally(() => setLoading(false));
  }, []);

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

      {/* Hero — untouched, exactly as it was */}
      <HeroBackground file="hero.png" opacity={0.35}>
        <HeroSearch topCities={topCities} />
      </HeroBackground>
      <SectionDivider variant="curve" from="#1a2035" to="#ffffff" />

      <CategoriesShowcase />
      <SectionDivider variant="wave" from="#ffffff" to="#f8f9fb" />

      <TrustVerification />
      <SectionDivider variant="angle" from="#f8f9fb" to="#fff9f5" />

      <FeaturedThisWeek vendors={featured} loading={loading} />
      <SectionDivider variant="curve" from="#fff9f5" to="#ffffff" flip />

      <BuiltForVendors />
      <SectionDivider variant="zigzag" from="#ffffff" to="#f8f9fb" />

      <WeddingBudgetPlanner />
      <SectionDivider variant="wave" from="#f8f9fb" to="#fff9f5" />

      <Testimonials />
      <SectionDivider variant="curve" from="#fff9f5" to="#1a2035" flip />

      <VendorCTA />
    </>
  );
}