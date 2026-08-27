import React from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import { venueService } from "../../../services/venueService";
import { showSuccess, showError } from "../../../components/common/Toast";
import { VENUE_TYPE_OPTIONS } from "../../../lib/venueTypes";
import { BASE_DOMAIN } from "../../../lib/constants";

// Dev mein: royal.localhost:5173
// Production mein: royal.campussafar.com
const getSubdomainUrl = (subdomain) => {
  const isDev = import.meta.env.DEV;
  if (isDev) {
    return `http://${subdomain}.localhost:5173`;
  }
  return `https://${subdomain}.${BASE_DOMAIN}`;
};

export default function VenueProfileSettings() {
  const { venue, refetchVenue } = useVenue();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: venue ? {
      hall_name: venue.hall_name,
      owner_name: venue.owner_name,
      phone: venue.phone,
      city: venue.city,
      address: venue.address,
      google_maps_link: venue.google_maps_link,
      capacity: venue.capacity,
      venue_type: venue.venue_type,
    } : {}
  });

  const onSubmit = async (values) => {
    try {
      await venueService.update(venue.id, values);
      showSuccess("Profile updated");
      refetchVenue();
    } catch {
      showError("Failed to update profile");
    }
  };

  const subdomainUrl = venue?.subdomain ? getSubdomainUrl(venue.subdomain) : null;

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Venue Profile">

      {/* Subdomain URL Card */}
      {subdomainUrl && (
        <div className="max-w-lg mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-sm font-medium text-purple-700 mb-1">Your Public Website URL</p>
          <div className="flex items-center gap-2">
            
             <a href={subdomainUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 font-semibold text-sm underline break-all"
            >
              {subdomainUrl}
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(subdomainUrl);
                showSuccess("URL copied!");
              }}
              className="ml-auto shrink-0 text-xs bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
            >
              Copy
            </button>
          </div>
          <p className="text-xs text-purple-500 mt-2">
            Share this link with your customers. Your subdomain: <strong>{venue.subdomain}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg bg-white p-6 rounded-xl border border-gray-100 space-y-4">
        <Input label="Hall Name" {...register("hall_name")} />
        <Input label="Owner Name" {...register("owner_name")} />
        <Input label="Phone" {...register("phone")} />
        <Input label="City" {...register("city")} />
        <Input label="Address" {...register("address")} />
        <Input label="Google Maps Link" {...register("google_maps_link")} />
        <Input label="Capacity" type="number" {...register("capacity")} />
        <Select
          label="Venue Type"
          options={VENUE_TYPE_OPTIONS}
          {...register("venue_type")}
        />
        <Button type="submit" loading={isSubmitting}>Save Changes</Button>
      </form>
    </DashboardLayout>
  );
}