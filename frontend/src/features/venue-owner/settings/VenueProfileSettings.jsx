import React from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import MultiSelect from "../../../components/common/MultiSelect";
import { useFetch } from "../../../hooks/useFetch";
import { useState } from "react";
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
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
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

  const [selectedStateIso, setSelectedStateIso] = useState("");
  const { data: states, loading: statesLoading } = useFetch("/meta/states");
  const { data: citiesForState, loading: citiesLoading } = useFetch(
    selectedStateIso ? `/meta/states/${selectedStateIso}/cities` : null
  );

  const stateOptions = [
    { value: "", label: statesLoading ? "Loading states..." : "Change state to pick a new city" },
    ...(states || []).map((s) => ({ value: s.iso2, label: s.name }))
  ];

  const currentCity = watch("city");
  const cityOptions = [
    { value: "", label: citiesLoading ? "Loading cities..." : "Select a city" },
    ...(currentCity && !(citiesForState || []).some((c) => c.name === currentCity)
      ? [{ value: currentCity, label: currentCity }]
      : []),
    ...(citiesForState || []).map((c) => ({ value: c.name, label: c.name }))
  ];

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <div className="grid grid-cols-2 gap-3">
            <Select
              options={stateOptions}
              value={selectedStateIso}
              onChange={(e) => setSelectedStateIso(e.target.value)}
            />
            <Select
              options={cityOptions}
              value={currentCity || ""}
              onChange={(e) => setValue("city", e.target.value, { shouldValidate: true })}
            />
          </div>
        </div>
        <Input label="Address" {...register("address")} />
        <Input label="Google Maps Link" {...register("google_maps_link")} />
        <Input label="Capacity" type="number" {...register("capacity")} />
        <MultiSelect
          label="Venue Type"
          options={VENUE_TYPE_OPTIONS}
          value={watch("venue_type") || []}
          onChange={(val) => setValue("venue_type", val, { shouldValidate: true })}
          placeholder="Select venue type(s)"
        />
        <Button type="submit" loading={isSubmitting}>Save Changes</Button>
      </form>
    </DashboardLayout>
  );
}