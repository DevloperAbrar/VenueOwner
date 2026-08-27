import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import { venueDetailsSchema } from "../../../components/forms/validationSchemas";
import Input from "../../../components/common/Input";
import MultiSelect from "../../../components/common/MultiSelect";
import Button from "../../../components/common/Button";
import { venueService } from "../../../services/venueService";
import { subscriptionService } from "../../../services/subscriptionService";
import { showSuccess, showError } from "../../../components/common/Toast";
import { useVenue } from "../../../context/VenueContext.jsx";
import { VENUE_TYPE_OPTIONS } from "../../../lib/venueTypes";

export default function VenueDetailsForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId;
  const { refetchVenue } = useVenue();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(venueDetailsSchema),
    defaultValues: { venue_type: [] }
  });

  const selectedVenueTypes = watch("venue_type") || [];

  const onSubmit = async (values) => {
    try {
      const { data } = await venueService.create(values);
      const venue = data.data;
      if (planId) await subscriptionService.create(venue.id, planId);
      await refetchVenue();
      showSuccess("Venue created! Let's set it up.");
      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create venue");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Tell us about your venue</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Hall Name" error={errors.hall_name?.message} {...register("hall_name")} />
          <Input label="Owner Name" error={errors.owner_name?.message} {...register("owner_name")} />
          <Input label="Phone" error={errors.phone?.message} {...register("phone")} />
          <Input label="City" error={errors.city?.message} {...register("city")} />
          <Input label="Address" error={errors.address?.message} {...register("address")} />
          <Input label="Google Maps Link" {...register("google_maps_link")} />
          <Input label="Capacity" type="number" error={errors.capacity?.message} {...register("capacity")} />

          <MultiSelect
            label="Venue Type (select all that apply)"
            error={errors.venue_type?.message}
            options={VENUE_TYPE_OPTIONS}
            value={selectedVenueTypes}
            onChange={(newValue) => setValue("venue_type", newValue, { shouldValidate: true })}
            placeholder="e.g. Marriage Hall, Banquet Hall..."
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>Create Venue</Button>
        </form>
      </div>
    </div>
  );
}