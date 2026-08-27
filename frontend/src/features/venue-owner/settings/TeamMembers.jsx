import React, { useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import api from "../../../services/api";
import { showSuccess, showError } from "../../../components/common/Toast";
import { useFetch } from "../../../hooks/useFetch";
import EmptyState from "../../../components/common/EmptyState";

export default function TeamMembers() {
  const { venue } = useVenue();
  const { data: members, loading, refetch } = useFetch(venue ? `/venues/${venue.id}/team-members` : null, { skip: !venue });
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    try {
      // Backend note: implement POST /api/venues/:venueId/team-members using the
      // existing TeamMember model — not yet wired to a route in the initial backend pass.
      await api.post(`/venues/${venue.id}/team-members`, values);
      showSuccess("Team member added");
      reset();
      refetch();
    } catch {
      showError("Team members endpoint not wired up yet — say the word and I'll add it to the backend");
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Team Members">
      <div className="max-w-lg bg-white p-6 rounded-xl border border-gray-100 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register("name", { required: true })} />
          <Input label="Email" {...register("email", { required: true })} />
          <Input label="Password" type="password" {...register("password", { required: true })} />
          <Button type="submit" loading={isSubmitting}>Add Team Member</Button>
        </form>

        {!loading && (!members || members.length === 0) && (
          <EmptyState title="No team members added yet" description="Add helper accounts with limited access to bookings and payments." />
        )}
      </div>
    </DashboardLayout>
  );
}