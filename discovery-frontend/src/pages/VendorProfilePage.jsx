import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../lib/api";
import HeroSection from "../components/vendor-profile/HeroSection";
import PhotoGallery from "../components/vendor-profile/PhotoGallery";
import ServicesGrid from "../components/vendor-profile/ServicesGrid";
import ContactButtons from "../components/vendor-profile/ContactButtons";
import SimilarVendors from "../components/vendor-profile/SimilarVendors";
import InquiryModal from "../components/vendor-profile/InquiryModal";
import BreadcrumbNav from "../components/seo/BreadcrumbNav";
import ReviewsSection from "../components/vendor-profile/ReviewsSection.jsx";

export default function VendorProfilePage() {
  const { city, category, slug: vendorSlug } = useParams();
  const [data, setData] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    api.get(`/vendor/${city}/${category}/${vendorSlug}`).then(({ data }) => setData(data.data));
  }, [city, category, vendorSlug]);

  if (!data) return <div className="max-w-6xl mx-auto px-4 py-16 text-gray-400">Loading...</div>;

  const { venue, similar_vendors, seo } = data;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      <BreadcrumbNav items={[
        { label: venue.city, to: `/${city}` },
        { label: category.replace(/-/g, " "), to: `/${city}/${category}` },
        { label: venue.hall_name }
      ]} />

      <HeroSection venue={venue} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Starting Price</p>
            <p className="font-semibold text-gray-800">{venue.starting_price ? `₹${Number(venue.starting_price).toLocaleString("en-IN")}` : "On request"}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Capacity</p>
            <p className="font-semibold text-gray-800">{venue.capacity || "—"}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-400">Years Established</p>
            <p className="font-semibold text-gray-800">{venue.year_established || "—"}</p>
          </div>
        </div>

        <ContactButtons venue={venue} onSendInquiry={() => setShowInquiry(true)} />

        <PhotoGallery gallery={venue.gallery} />

        {venue.long_description && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{venue.long_description}</p>
          </div>
        )}

        <ServicesGrid services={venue.marketplace_services} />

        {venue.pricing_note && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Pricing</h2>
            <p className="text-sm text-gray-600">{venue.pricing_note}</p>
            {venue.advance_payment_percentage && (
              <p className="text-sm text-gray-500 mt-1">Advance required: {venue.advance_payment_percentage}%</p>
            )}
            {venue.cancellation_policy && (
              <p className="text-sm text-gray-500 mt-1">Cancellation policy: {venue.cancellation_policy}</p>
            )}
          </div>
        )}

        {venue.google_maps_link && (
          <div>
            <h2 className="font-semibold text-gray-800 mb-2">Location</h2>
            <a href={venue.google_maps_link} target="_blank" rel="noreferrer" className="text-sm text-primary-600 hover:underline">
              View on Google Maps
            </a>
          </div>
        )}

        <SimilarVendors vendors={similar_vendors} />
        <ReviewsSection venueId={venue.id} />
      </div>

      {showInquiry && <InquiryModal venue={venue} onClose={() => setShowInquiry(false)} />}
    </>
  );
}