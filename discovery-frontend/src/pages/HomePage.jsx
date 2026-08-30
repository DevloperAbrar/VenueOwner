import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";
import HeroSearch from "../components/homepage/HeroSearch";
import FeaturedVendors from "../components/homepage/FeaturedVendors";
import HowItWorks from "../components/homepage/HowItWorks";
import TrustSignals from "../components/homepage/TrustSignals";
import CityCoverage from "../components/homepage/CityCoverage";

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/homepage").then(({ data }) => setData(data.data));
  }, []);

  return (
    <>
      <Helmet>
        <title>Wedding & Event Venue Booking Platform - CampusSafar</title>
        <meta name="description" content="Find and book verified wedding and event vendors near you. Compare prices, check availability, and contact directly." />
      </Helmet>

      <HeroSearch topCities={data?.top_cities || []} />
      <FeaturedVendors vendors={data?.featured_vendors || []} />
      <HowItWorks />
      <TrustSignals stats={data?.trust_stats} />
      <CityCoverage cities={data?.top_cities || []} />
    </>
  );
}