import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { planSchema } from "../../../components/forms/validationSchemas";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { planService } from "../../../services/planService";
import { showSuccess, showError } from "../../../components/common/Toast";

export default function PlanForm({ existingPlan, onSaved, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(planSchema),
    defaultValues: existingPlan || { name: "", monthly_price: "", trial_days: 0, description: "" }
  });

  const onSubmit = async (values) => {
    try {
      const payload = { ...values, features: values.features?.split(",").map((f) => f.trim()) || [] };
      if (existingPlan) {
        await planService.update(existingPlan.id, payload);
        showSuccess("Plan updated");
      } else {
        await planService.create(payload);
        showSuccess("Plan created");
      }
      onSaved();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save plan");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Plan Name" error={errors.name?.message} {...register("name")} />
      <Input label="Description" {...register("description")} />
      <Input label="Monthly Price (₹)" type="number" error={errors.monthly_price?.message} {...register("monthly_price")} />
      <Input label="Trial Days" type="number" {...register("trial_days")} />
      <Input label="Features (comma separated)" {...register("features")} />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={isSubmitting}>{existingPlan ? "Update" : "Create"} Plan</Button>
      </div>
    </form>
  );
}