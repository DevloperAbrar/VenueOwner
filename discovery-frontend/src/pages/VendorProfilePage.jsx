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
import {
  MapPin, Award, Users, Calendar, Languages,
  ShieldCheck, Banknote, Copy, MessageCircle, ExternalLink,
  Link, Video, Globe2
} from "lucide-react";

function SectionCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h2 className="font-semibold text-gray-800 mb-4 text-base">{title}</h2>
      {children}
    </div>
  );
}

function copyText(text) {
  navigator.clipboard.writeText(text);
}

export default function VendorProfilePage() {
  const { city, category, slug: vendorSlug } = useParams();
  const [data, setData] = useState(null);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    api.get(`/vendor/${city}/${category}/${vendorSlug}`).then(({ data }) => setData(data.data));
  }, [city, category, vendorSlug]);

  if (!data) return <div className="max-w-6xl mx-auto px-4 py-16 text-gray-400">Loading...</div>;

  const { venue, similar_vendors, seo } = data;
  const categoryLabel = category.replace(/-/g, " ");

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
      </Helmet>

      <BreadcrumbNav items={[
        { label: venue.city, to: `/${city}` },
        { label: categoryLabel, to: `/${city}/${category}` },
        { label: venue.hall_name }
      ]} />

      {/* Hero */}
      <HeroSection venue={venue} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <Banknote size={16} className="text-primary-500 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Starting Price</p>
            <p className="font-semibold text-gray-800 text-sm">
              {venue.starting_price ? `₹${Number(venue.starting_price).toLocaleString("en-IN")}` : "On request"}
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <Users size={16} className="text-primary-500 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Team Size</p>
            <p className="font-semibold text-gray-800 text-sm">{venue.team_size ? `${venue.team_size} members` : "—"}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <Calendar size={16} className="text-primary-500 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Est.</p>
            <p className="font-semibold text-gray-800 text-sm">{venue.year_established || "—"}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <Languages size={16} className="text-primary-500 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Languages</p>
            <p className="font-semibold text-gray-800 text-sm">
              {venue.languages_spoken?.length ? venue.languages_spoken.join(", ") : "—"}
            </p>
          </div>
        </div>

        {/* Specialty tagline */}
        {venue.specialty_tagline && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-3 mb-8">
            <p className="text-primary-700 text-sm font-medium italic">"{venue.specialty_tagline}"</p>
          </div>
        )}

        {/* Contact buttons */}
        <div className="mb-8">
          <ContactButtons venue={venue} onSendInquiry={() => setShowInquiry(true)} />
        </div>

        {/* Social links */}
        {/* Social links */}
        {(venue.instagram_handle || venue.youtube_channel_link || venue.external_website || venue.video_intro_url) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {venue.instagram_handle && (
              <a href={`https://instagram.com/${venue.instagram_handle.replace("@", "")}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm px-4 py-2 rounded-lg transition-colors">
                📷 Instagram
              </a>
            )}
            {venue.youtube_channel_link && (
              <a href={venue.youtube_channel_link} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm px-4 py-2 rounded-lg transition-colors">
                ▶ YouTube
              </a>
            )}
            {venue.external_website && (
              <a href={venue.external_website} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm px-4 py-2 rounded-lg transition-colors">
                🌐 Website
              </a>
            )}
            {venue.video_intro_url && (
              <a href={venue.video_intro_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 border border-primary-200 text-primary-700 hover:bg-primary-50 text-sm px-4 py-2 rounded-lg transition-colors">
                <ExternalLink size={14} /> Watch Intro Video
              </a>
            )}
          </div>
        )}

        {/* Photo Gallery */}
        <div className="mb-8">
          <PhotoGallery gallery={venue.gallery} />
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            {venue.long_description && (
              <SectionCard title="About">
                <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {venue.long_description}
                </p>
              </SectionCard>
            )}

            {/* Services */}
            <SectionCard title="Services & Amenities">
              <ServicesGrid services={venue.marketplace_services} />
            </SectionCard>

            {/* Pricing */}
            {(venue.starting_price || venue.pricing_mode === "per_service" || venue.pricing_note) && (
              <SectionCard title="Pricing">
                {venue.pricing_mode === "per_service" && venue.service_prices && Object.keys(venue.service_prices).length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {Object.entries(venue.service_prices).map(([service, price]) =>
                      price ? (
                        <div key={service} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                          <span className="text-gray-600">{service}</span>
                          <span className="font-semibold text-gray-900">₹{Number(price).toLocaleString("en-IN")}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-8 mb-4">
                    {venue.starting_price && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Starting from</p>
                        <p className="text-2xl font-bold text-primary-700">₹{Number(venue.starting_price).toLocaleString("en-IN")}</p>
                      </div>
                    )}
                    {venue.maximum_price && (
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Up to</p>
                        <p className="text-2xl font-bold text-gray-600">₹{Number(venue.maximum_price).toLocaleString("en-IN")}</p>
                      </div>
                    )}
                  </div>
                )}

                {venue.pricing_note && (
                  <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-3">
                    {venue.pricing_note}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {venue.advance_payment_percentage && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400">Advance required</p>
                      <p className="text-sm font-semibold text-gray-700">{venue.advance_payment_percentage}%</p>
                    </div>
                  )}
                  {venue.cancellation_policy && (
                    <div className="bg-gray-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400">Cancellation policy</p>
                      <p className="text-sm font-semibold text-gray-700">{venue.cancellation_policy}</p>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {/* Famous Events */}
            {venue.famous_events_handled && (
              <SectionCard title="Notable Events Handled">
                <p className="text-sm text-gray-600 leading-relaxed">{venue.famous_events_handled}</p>
              </SectionCard>
            )}

            {/* Awards */}
            {venue.awards_recognition && (
              <SectionCard title="Awards & Recognition">
                <div className="flex items-start gap-3">
                  <Award size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 leading-relaxed">{venue.awards_recognition}</p>
                </div>
              </SectionCard>
            )}

            {/* Reviews */}
            <ReviewsSection venueId={venue.id} />

            {/* Similar Vendors */}
            <SimilarVendors vendors={similar_vendors} />
          </div>

          {/* RIGHT — sidebar */}
          <div className="space-y-5">

            {/* Contact card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Get in touch</h3>
              {venue.whatsapp_number && (
                <>

                  <a href={`https://wa.me/${venue.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <MessageCircle size={15} /> WhatsApp Now
                  </a>
                  <button
                    onClick={() => copyText(venue.whatsapp_number)}
                    className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <Copy size={14} /> Copy Number
                  </button>
                </>
              )}
              <button
                onClick={() => setShowInquiry(true)}
                className="flex items-center justify-center gap-2 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Send Inquiry
              </button>
            </div>

            {/* Service Areas */}
            {(venue.serviceAreas?.length > 0 || venue.service_travel_note) && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Areas</h3>
                {venue.serviceAreas?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {venue.serviceAreas.map((c) => (
                      <span key={c.id} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100">
                        {c.name}
                      </span>
                    ))}
                  </div>
                )}
                {venue.service_travel_note && (
                  <p className="text-xs text-gray-500 leading-relaxed">{venue.service_travel_note}</p>
                )}
              </div>
            )}

            {/* Trust signals */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Why trust this listing</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldCheck size={14} className="text-green-500" /> Verified on VenueSafar
                </div>
                {venue.year_established && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar size={14} className="text-blue-400" /> In business since {venue.year_established}
                  </div>
                )}
                {venue.languages_spoken?.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Languages size={14} className="text-purple-400" /> Speaks {venue.languages_spoken.join(", ")}
                  </div>
                )}
                {venue.team_size && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Users size={14} className="text-orange-400" /> Team of {venue.team_size}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Location</h3>
              <p className="text-xs text-gray-500 mb-3">
                {venue.primary_locality && `${venue.primary_locality}, `}{venue.city}
                {venue.full_pincode && ` — ${venue.full_pincode}`}
              </p>

              <a href={venue.google_maps_link || `https://www.google.com/maps/search/${encodeURIComponent(`${venue.hall_name} ${venue.city}`)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary-600 hover:underline font-medium"
              >
                <MapPin size={13} /> View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {showInquiry && <InquiryModal venue={venue} onClose={() => setShowInquiry(false)} />}
    </>
  );
}