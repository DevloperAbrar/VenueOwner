import React from "react";
import PublicLayout from "../../components/layout/PublicLayout.jsx";
import Loader from "../../components/common/Loader";
import { useFetch } from "../../hooks/useFetch";
import HeroSection from "./venue-home/HeroSection.jsx";
import AboutSection from "./venue-home/AboutSection.jsx";
import ServicesSection from "./venue-home/ServicesSection.jsx";
import GallerySection from "./venue-home/GallerySection.jsx";
import TestimonialsSection from "./venue-home/TestimonialsSection.jsx";
import ContactSection from "./venue-home/ContactSection.jsx";
import AvailabilityCalendar from "./availability-calendar/AvailabilityCalendar.jsx";

const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // royal.localhost → ["royal", "localhost"] → return "royal"
  // royal.campussafar.com → ["royal", "campussafar", "com"] → return "royal"
  // localhost → ["localhost"] → fallback to ?venue= param
  // app.localhost → skip, return null

  const reserved = ["www", "app", "api", "admin"];

  if (parts.length >= 2 && !reserved.includes(parts[0]) && parts[0] !== "localhost") {
    return parts[0];
  }

  // Plain localhost fallback
  const params = new URLSearchParams(window.location.search);
  return params.get("venue") || null;
};

export default function VenueHomePage() {
  const subdomain = getSubdomain();
  const { data: venue, loading: venueLoading } = useFetch(
    subdomain ? `/venues/public/${subdomain}` : null
  );
  const { data: slots, loading: slotsLoading } = useFetch(
    venue ? `/venues/${venue.id}/slots?activeOnly=true` : null,
    { skip: !venue, deps: [venue?.id] }
  );

  if (venueLoading) return <Loader fullScreen />;

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Venue Not Found</h1>
          <p className="text-gray-500">
            {!subdomain
              ? "No venue specified. Add ?venue=your-slug to the URL."
              : "This venue page doesn't exist or isn't live yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout venueName={venue.hall_name} venue={venue}>
      <HeroSection venue={venue} />
      <AboutSection venue={venue} />
      <ServicesSection venue={venue} />
      <GallerySection venue={venue} />
      {!slotsLoading && <AvailabilityCalendar venue={venue} slots={slots} />}
      <TestimonialsSection venue={venue} />
      <ContactSection venue={venue} slots={slots} />
    </PublicLayout>
  );
}