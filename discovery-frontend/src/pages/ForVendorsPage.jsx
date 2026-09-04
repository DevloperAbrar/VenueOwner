import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { BASE_DOMAIN, BRAND_NAME } from "../lib/constants";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

const benefits = [
  "Get discovered by customers actively searching for your service",
  "Free listing to start, no subscription required",
  "Direct inquiries and WhatsApp contact, no middleman",
  "A branded page with your photos, pricing and reviews",
  "Manage bookings, payments and your calendar from one dashboard"
];

export default function ForVendorsPage() {
  return (
    <>
      <Helmet>
        <title>List Your Wedding or Event Business on {BRAND_NAME}</title>
        <meta name="description" content={`Grow your wedding or event business with a free listing on ${BRAND_NAME}. Get discovered by real customers searching for banquet halls, decorators, caterers, photographers and more.`} />
        <link rel="canonical" href={`https://www.${BASE_DOMAIN}/for-vendors`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold text-navy-900 mb-4">
          Grow Your Wedding or Event Business with {BRAND_NAME}
        </h1>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Whether you run a banquet hall, work as a decorator, caterer, photographer or event management company,
          {" "}{BRAND_NAME} connects you with couples and families actively planning their event.
        </p>

        <div className="space-y-3 mb-10">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-primary-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{b}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/register-free"
            className="bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-700"
          >
            List Your Business Free
          </Link>
          
          <a  href={`${APP_URL}/login`}
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium hover:border-gray-300"
          >
            Already Listed? Log In
          </a>
        </div>
      </div>
    </>
  );
}