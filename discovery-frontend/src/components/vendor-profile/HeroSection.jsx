import React from "react";
import StarRating from "../common/StarRating";
import Badge from "../common/Badge";
import { getImageUrl } from "../../lib/constants";

// Decorative trust bar shown under the hero card when any badge is present
function TrustBar({ venue }) {
  const badges = [
    venue.badge_verified_business && "verified_business",
    venue.badge_documents_verified && "documents_verified",
    venue.badge_premium_partner && "premium_partner",
  ].filter(Boolean);

  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
      {/* "Verified by In2Fest" label */}
      <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-gray-400">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verified by In2Fest
      </span>
      {badges.map((type) => (
        <Badge key={type} type={type} variant="pill" />
      ))}
    </div>
  );
}

export default function HeroSection({ venue }) {
  const imageUrl = getImageUrl(venue.hero_image_url);

  return (
    <div className="relative">
      {/* Cover image */}
      <div className="h-64 md:h-80 bg-gray-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={venue.hall_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-primary-400">
              <path d="M3 21V9l9-7 9 7v12H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" opacity="0.2" />
              <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        {/* Premium badge on the image itself */}
        {venue.badge_premium_partner && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 7L7 17H17L21 7L16 11L12 4L8 11L3 7Z"
                  fill="white" opacity="0.9" stroke="white" strokeWidth="1.5" strokeLinejoin="round"
                />
                <path d="M7 20h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Premium Partner
            </span>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-primary-600 font-semibold mb-1">
                {venue.business_category?.replace(/-/g, " ")}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {venue.hall_name}
              </h1>
              {(venue.primary_locality || venue.city) && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  {venue.primary_locality ? `${venue.primary_locality}, ` : ""}{venue.city}
                </p>
              )}
              <div className="mt-2">
                <StarRating rating={venue.average_rating} reviewCount={venue.review_count} />
              </div>
            </div>
          </div>

           {/* Trust bar, badges and "Verified by In2Fest" */}
          <TrustBar venue={venue} />
        </div>
      </div>
    </div>
  );
}