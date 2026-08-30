import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { getBusinessDetailsSchema } from "../../../components/forms/validationSchemas";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { venueService } from "../../../services/venueService";
import { showSuccess, showError } from "../../../components/common/Toast";
import { useVenue } from "../../../context/VenueContext.jsx";
import {
  VENDOR_CATEGORIES,
  CATEGORY_FIELD_CONFIG,
  COMMON_FIELDS,
  getCategoryGroup
} from "../../../lib/vendorCategoryConfig";

export default function VenueDetailsForm() {
  const navigate = useNavigate();
  const { refetchVenue } = useVenue();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const group = selectedCategory ? getCategoryGroup(selectedCategory) : "service";
  const groupConfig = CATEGORY_FIELD_CONFIG[group];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(getBusinessDetailsSchema(group))
  });

  function handleCategorySelect(slug) {
    setSelectedCategory(slug);
    setStep(2);
  }

  const onSubmit = async (values) => {
    try {
      await venueService.create({
        ...values,
        business_category: selectedCategory
      });
      showSuccess("You're live! Let's finish setting up your page.");
      await refetchVenue();
      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create your business profile");
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-1 text-center">What kind of business do you run?</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            This decides what your dashboard and public page look like.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {VENDOR_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className="bg-white border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-700
                           hover:border-primary-500 hover:text-primary-600 hover:shadow-sm transition text-left"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm text-gray-400 hover:text-gray-600 mb-4"
        >
          ← Change category
        </button>

        <h2 className="text-xl font-bold mb-6">{groupConfig.label}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {COMMON_FIELDS.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              error={errors[field.name]?.message}
              {...register(field.name)}
            />
          ))}

          {groupConfig.fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              error={errors[field.name]?.message}
              {...register(field.name)}
            />
          ))}

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create My Page
          </Button>
        </form>
      </div>
    </div>
  );
}