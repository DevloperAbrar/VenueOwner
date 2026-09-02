import React from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";
import Badge from "../common/Badge";
import { slugify } from "../../lib/seoHelpers";
import { getImageUrl } from "../../lib/constants";

// Premium ribbon SVG — sits on the image corner
function PremiumRibbon() {
  return (
    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 7L7 17H17L21 7L16 11L12 4L8 11L3 7Z"
          fill="white"
          opacity="0.9"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7 20h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Premium
    </span>
  );
}

export default function VendorCard({ vendor }) {
  if (!vendor.business_category) return null;

  const url = `/${slugify(vendor.city)}/${vendor.business_category}/${vendor.subdomain}`;
  const imageUrl = getImageUrl(vendor.hero_image_url);

  const hasVerified = vendor.badge_verified_business || vendor.badge_documents_verified;

  return (
    <Link
      to={url}
      className="group block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={vendor.hall_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-primary-300">
              <path d="M3 21V9l9-7 9 7v12H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" opacity="0.2" />
              <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {vendor.badge_premium_partner && <PremiumRibbon />}
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-1.5">
        {/* Name row + trust chip icons */}
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-800 text-sm leading-snug truncate flex-1">
            {vendor.hall_name}
          </p>
          {hasVerified && (
            <div className="flex gap-1 flex-shrink-0 mt-0.5">
              {vendor.badge_verified_business && (
                <Badge type="verified_business" variant="chip" />
              )}
              {vendor.badge_documents_verified && (
                <Badge type="documents_verified" variant="chip" />
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 capitalize">
          {vendor.business_category?.replace(/-/g, " ")} · {vendor.city}
        </p>

        <StarRating rating={vendor.average_rating} reviewCount={vendor.review_count} />

        {vendor.starting_price && (
          <p className="text-sm font-semibold text-primary-700">
            Starts at ₹{Number(vendor.starting_price).toLocaleString("en-IN")}
          </p>
        )}

        {/* Service tags */}
        {(vendor.marketplace_services || []).length > 0 && (
          <div className="flex gap-1 flex-wrap pt-0.5">
            {vendor.marketplace_services.map((s) => (
              <span
                key={s}
                className="text-[11px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}