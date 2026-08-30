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
  getGroupForCategories,
  getPrimaryCategory
} from "../../../lib/vendorCategoryConfig";

export default function VenueDetailsForm() {
  const navigate = useNavigate();
  const { refetchVenue } = useVenue();

  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const group = getGroupForCategories(selectedCategories);
  const groupConfig = CATEGORY_FIELD_CONFIG[group];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(getBusinessDetailsSchema(group))
  });

  function handleToggleCategory(slug) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handleContinue() {
    if (selectedCategories.length === 0) {
      showError("Select at least one business type to continue");
      return;
    }
    setStep(2);
  }

  const onSubmit = async (values) => {
    try {
      const primaryCategory = getPrimaryCategory(selectedCategories);
      const secondaryCategories = selectedCategories.filter((slug) => slug !== primaryCategory);

      await venueService.create({
        ...values,
        business_category: primaryCategory,
        secondary_categories: secondaryCategories
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
            This decides what your dashboard and public page look like. You can pick more than
            one — e.g. Marriage Hall + Caterer.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {VENDOR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.slug);
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleToggleCategory(cat.slug)}
                  aria-pressed={isSelected}
                  className={`rounded-xl p-4 text-sm font-medium text-left transition border ${
                    isSelected
                      ? "border-primary-500 bg-primary-50 text-primary-600 shadow-sm"
                      : "bg-white border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600 hover:shadow-sm"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {selectedCategories.length === 0
                ? "Select at least one"
                : `${selectedCategories.length} selected`}
            </p>
            <Button type="button" onClick={handleContinue} disabled={selectedCategories.length === 0}>
              Continue
            </Button>
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
          ← Change business type(s)
        </button>

        <h2 className="text-xl font-bold mb-1">{groupConfig.label}</h2>
        <p className="text-xs text-gray-400 mb-6">
          Running as: {selectedCategories
            .map((slug) => VENDOR_CATEGORIES.find((c) => c.slug === slug)?.label)
            .filter(Boolean)
            .join(", ")}
        </p>

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