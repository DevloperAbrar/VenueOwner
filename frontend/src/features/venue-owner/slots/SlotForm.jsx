import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { slotSchema } from "../../../components/forms/validationSchemas";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";

export default function SlotForm({ existingSlot, onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(slotSchema),
    defaultValues: existingSlot || { name: "", start_time: "", end_time: "", base_price: "" }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Slot Name" placeholder="e.g. Evening" error={errors.name?.message} {...register("name")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Start Time" type="time" error={errors.start_time?.message} {...register("start_time")} />
        <Input label="End Time" type="time" error={errors.end_time?.message} {...register("end_time")} />
      </div>
      <Input label="Base Price (₹)" type="number" {...register("base_price")} />
      <Input label="Weekend Price (₹, optional)" type="number" {...register("weekend_price")} />
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={submitting}>{existingSlot ? "Update" : "Add"} Slot</Button>
      </div>
    </form>
  );
}