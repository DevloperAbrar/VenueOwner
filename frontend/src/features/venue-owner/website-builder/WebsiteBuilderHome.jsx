import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { BASE_DOMAIN } from "../../../lib/constants";
import {
  Image, Images, Wrench, Info, Star, Phone
} from "lucide-react";

const SECTIONS = [
  {
    path: "/dashboard/website/hero",
    label: "Hero Section",
    description: "Main banner image, heading, subheading and call-to-action button",
    icon: Image,
    color: "bg-purple-50 text-purple-600"
  },
  {
    path: "/dashboard/website/about",
    label: "About Section",
    description: "Tell visitors about your venue — history, highlights, and what makes you special",
    icon: Info,
    color: "bg-blue-50 text-blue-600"
  },
  {
    path: "/dashboard/website/services",
    label: "Services Section",
    description: "List your services, packages, and amenities with pricing",
    icon: Wrench,
    color: "bg-green-50 text-green-600"
  },
  {
    path: "/dashboard/website/gallery",
    label: "Gallery",
    description: "Upload photos of your venue, events, and facilities",
    icon: Images,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    path: "/dashboard/website/testimonials",
    label: "Testimonials",
    description: "Add client reviews and testimonials to build trust",
    icon: Star,
    color: "bg-orange-50 text-orange-600"
  },
  {
    path: "/dashboard/website/contact",
    label: "Contact Section",
    description: "Contact details, address, Google Maps link displayed to visitors",
    icon: Phone,
    color: "bg-red-50 text-red-600"
  }
];

export default function WebsiteBuilderHome() {
  const navigate = useNavigate();
  const { venue } = useVenue();

  const isDev = import.meta.env.DEV;
  const publicUrl = venue?.subdomain
  ? isDev
    ? `http://${venue.subdomain}.localhost:5173`
    : `https://${venue.subdomain}.${BASE_DOMAIN}`
  : null;

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Website Builder">
      <div className="max-w-4xl">
        {/* Public URL banner */}
        {publicUrl && (
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your public website</p>
              <p className="font-medium text-primary-700">{publicUrl}</p>
            </div>
            
          <a    href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary-600 hover:underline"
            >
              Preview →
            </a>
          </div>
        )}

        <p className="text-gray-500 mb-6 text-sm">
          Customize each section of your public venue website. Changes are saved instantly.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.path}
                onClick={() => navigate(section.path)}
                className="bg-white border border-gray-100 rounded-xl p-5 text-left hover:shadow-md hover:border-primary-200 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                      {section.label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}