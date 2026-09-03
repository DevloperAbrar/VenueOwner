import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { venueService } from "../../../services/venueService";
import { showSuccess, showError } from "../../../components/common/Toast";

export default function PaymentSettings() {
  const { venue, refetchVenue } = useVenue();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      upi_id: venue?.upi_id || "",
      bank_details: {
        account_number: venue?.bank_details?.account_number || "",
        beneficiary_name: venue?.bank_details?.beneficiary_name || "",
        bank_name: venue?.bank_details?.bank_name || "",
        ifsc_code: venue?.bank_details?.ifsc_code || "",
        branch_address: venue?.bank_details?.branch_address || ""
      }
    }
  });

  useEffect(() => {
    if (venue) {
      reset({
        upi_id: venue?.upi_id || "",
        bank_details: {
          account_number: venue?.bank_details?.account_number || "",
          beneficiary_name: venue?.bank_details?.beneficiary_name || "",
          bank_name: venue?.bank_details?.bank_name || "",
          ifsc_code: venue?.bank_details?.ifsc_code || "",
          branch_address: venue?.bank_details?.branch_address || ""
        }
      });
    }
  }, [venue, reset]);

  const onSubmit = async (values) => {
    try {
      await venueService.update(venue.id, values);
      showSuccess("Payment settings updated");
      refetchVenue();
    } catch {
      showError("Failed to update payment settings");
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Payment Settings">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">UPI</h4>
          <Input label="UPI ID" placeholder="yourname@upi" {...register("upi_id")} />
          <p className="text-xs text-gray-400">
            This UPI ID is used to auto-generate a scannable QR code on every invoice and quotation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 space-y-4">
          <h4 className="text-sm font-semibold text-gray-800">Bank Account Details</h4>
          <p className="text-xs text-gray-400 -mt-2">
            Shown on invoices as an alternative payment method alongside the UPI QR code.
          </p>

          <Input
            label="Account Number"
            placeholder="e.g. 123456789012"
            {...register("bank_details.account_number")}
          />
          <Input
            label="Beneficiary Name"
            placeholder="Name as per bank records"
            {...register("bank_details.beneficiary_name")}
          />
          <Input
            label="Bank Name"
            placeholder="e.g. HDFC Bank"
            {...register("bank_details.bank_name")}
          />
          <Input
            label="IFSC Code"
            placeholder="e.g. HDFC0001234"
            {...register("bank_details.ifsc_code")}
          />
          <Input
            label="Branch Address"
            placeholder="e.g. MG Road Branch, Gwalior"
            {...register("bank_details.branch_address")}
          />
        </div>

        <Button type="submit" loading={isSubmitting}>Save</Button>
      </form>
    </DashboardLayout>
  );
}