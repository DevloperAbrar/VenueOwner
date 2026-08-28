import React from "react";
import StarRating from "../common/StarRating";
import Badge from "../common/Badge";

export default function HeroSection({ venue }) {
  return (
    <div className="relative">
      <div className="h-64 md:h-80 bg-gray-200">
        {venue.hero_image_url && <img src={venue.hero_image_url} alt={venue.hall_name} className="w-full h-full object-cover" />}
      </div>
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative">
        <div className="bg-white rounded-xl shadow-md p-5">
          <p className="text-xs uppercase text-primary-600 font-medium">{venue.business_category?.replace(/-/g, " ")}</p>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">{venue.hall_name}</h1>
          <p className="text-sm text-gray-500">{venue.primary_locality ? `${venue.primary_locality}, ` : ""}{venue.city}</p>
          <div className="mt-2"><StarRating rating={venue.average_rating} reviewCount={venue.review_count} /></div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {venue.badge_verified_business && <Badge type="verified_business" />}
            {venue.badge_documents_verified && <Badge type="documents_verified" />}
            {venue.badge_premium_partner && <Badge type="premium_partner" />}
          </div>
        </div>
      </div>
    </div>
  );
}