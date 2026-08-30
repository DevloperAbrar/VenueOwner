import React from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";
import { slugify } from "../../lib/seoHelpers";
import { getImageUrl } from "../../lib/constants";

export default function VendorCard({ vendor }) {
  // Defensive: a venue should always have a business_category (onboarding
  // requires picking one), but never let a missing one leak "null"/"undefined"
  // into the URL — that produces a dead link that 404s on the detail page.
  if (!vendor.business_category) return null;

  const url = `/${slugify(vendor.city)}/${vendor.business_category}/${vendor.subdomain}`;
  const imageUrl = getImageUrl(vendor.hero_image_url);

  return (
    <Link to={url} className="block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-gray-100">
        {imageUrl && (
          <img src={imageUrl} alt={vendor.hall_name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="font-semibold text-gray-800 text-sm truncate">{vendor.hall_name}</p>
        <p className="text-xs text-gray-500 capitalize">{vendor.business_category?.replace(/-/g, " ")} · {vendor.city}</p>
        <StarRating rating={vendor.average_rating} reviewCount={vendor.review_count} />
        {vendor.starting_price && (
          <p className="text-sm font-medium text-primary-700">Starts at ₹{Number(vendor.starting_price).toLocaleString("en-IN")}</p>
        )}
        <div className="flex gap-1 flex-wrap pt-1">
          {(vendor.marketplace_services || []).map((s) => (
            <span key={s} className="text-[11px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}