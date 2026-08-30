import * as yup from "yup";

export const venueDetailsSchema = yup.object({
  hall_name: yup.string().required("Hall name is required"),
  owner_name: yup.string().required("Owner name is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number").required(),
  city: yup.string().required("City is required"),
  address: yup.string().required("Address is required"),
  capacity: yup.number().positive().integer().required("Capacity is required"),
  venue_type: yup.array().of(yup.string()).min(1, "Select at least one venue type").required("Venue type is required")
});

export const slotSchema = yup.object({
  name: yup.string().required("Slot name is required"),
  start_time: yup.string().required("Start time is required"),
  end_time: yup.string().required("End time is required"),
  base_price: yup.number().min(0).nullable()
});

export const inquiryFormSchema = yup.object({
  customer_name: yup.string().required("Name is required"),
  phone: yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number").required(),
  email: yup.string().email("Enter a valid email").nullable(),
  event_date: yup.string().required("Event date is required"),
  event_type: yup.string().required("Event type is required"),
  guest_count: yup.number().positive().integer().required("Guest count is required"),
  message: yup.string().nullable()
});

export const adminLoginSchema = yup.object({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required")
});

export const planSchema = yup.object({
  name: yup.string().required("Plan name is required"),
  monthly_price: yup.number().positive().required("Price is required"),
  trial_days: yup.number().min(0).required()
});

export function getBusinessDetailsSchema(group) {
  const base = {
    hall_name: yup.string().required("Business name is required"),
    owner_name: yup.string().required("Owner name is required"),
    phone: yup.string().matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number").required(),
    city: yup.string().required("City is required")
  };

  if (group === "venue") {
    return yup.object({
      ...base,
      address: yup.string().required("Address is required"),
      capacity: yup.number().positive().integer().required("Capacity is required"),
      google_maps_link: yup.string().nullable()
    });
  }

  return yup.object({
    ...base,
    primary_locality: yup.string().required("Service area / locality is required"),
    team_size: yup.number().positive().integer().nullable(),
    starting_price: yup.number().positive().nullable()
  });
}