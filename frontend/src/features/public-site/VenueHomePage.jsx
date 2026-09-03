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
import DynamicSectionRenderer from "./venue-home/DynamicSectionRenderer.jsx";

const CORE_COMPONENTS = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  gallery: GallerySection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

const FALLBACK_ORDER = [
  { type: "hero", visible: true },
  { type: "about", visible: true },
  { type: "services", visible: true },
  { type: "gallery", visible: true },
  { type: "testimonials", visible: true },
  { type: "contact", visible: true },
];

const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  const reserved = ["www", "app", "api", "admin"];
  if (parts.length >= 2 && !reserved.includes(parts[0]) && parts[0] !== "localhost") {
    return parts[0];
  }
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

  const sections =
    venue.page_sections && venue.page_sections.length > 0 ? venue.page_sections : FALLBACK_ORDER;
  const visibleSections = sections.filter((s) => s.visible !== false);

  // Track dynamic section index separately for alternating tones
  let dynamicIdx = 0;

  return (
    <PublicLayout venueName={venue.hall_name} venue={venue}>
      {visibleSections.map((section, index) => {
        if (section.type === "contact") {
          return (
            <React.Fragment key="contact">
              {!slotsLoading && <AvailabilityCalendar venue={venue} slots={slots} />}
              <ContactSection venue={venue} slots={slots} />
            </React.Fragment>
          );
        }

        const CoreComponent = CORE_COMPONENTS[section.type];
        if (CoreComponent) {
          return <CoreComponent key={section.type} venue={venue} />;
        }

        const dIdx = dynamicIdx++;
        return (
          <DynamicSectionRenderer
            key={section.type}
            type={section.type}
            config={section.config}
            venue={venue}
            index={dIdx}
          />
        );
      })}
    </PublicLayout>
  );
}