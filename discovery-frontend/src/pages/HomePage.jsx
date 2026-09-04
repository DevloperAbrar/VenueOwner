import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";
import HeroSearch from "../components/homepage/HeroSearch";
import FeaturedVendors from "../components/homepage/FeaturedVendors";
import HowItWorks from "../components/homepage/HowItWorks";
import TrustSignals from "../components/homepage/TrustSignals";
import CityCoverage from "../components/homepage/CityCoverage";
import HomeFAQ, { homeFaqItems } from "../components/home/HomeFAQ";
import { HomeSchema, FAQSchema } from "../lib/seo/Schema"
import { buildTitle, buildDescription } from "../lib/seo/meta";
import { BASE_DOMAIN } from "../lib/constants";

export default function HomePage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/homepage").then(({ data }) => setData(data.data));
  }, []);

  return (
    <>
      <Helmet>
        <title>{buildTitle("home")}</title>
        <meta name="description" content={buildDescription("home")} />
        <link rel="canonical" href={`https://www.${BASE_DOMAIN}/`} />
      </Helmet>

      <HomeSchema />
      <FAQSchema items={homeFaqItems} />

      <HeroSearch topCities={data?.top_cities || []} />
      <FeaturedVendors vendors={data?.featured_vendors || []} />
      <HowItWorks />
      <TrustSignals stats={data?.trust_stats} />
      <CityCoverage cities={data?.top_cities || []} />
      <HomeFAQ />
    </>
  );
}