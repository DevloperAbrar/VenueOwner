import React, { useState, useEffect } from "react";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

export default function PricingPoliciesTab({ venue, onSave, saving, onNext, onBack }) {
  const [form, setForm] = useState({
    starting_price: venue.starting_price || "",
    maximum_price: venue.maximum_price || "",
    pricing_note: venue.pricing_note || "",
    advance_payment_percentage: venue.advance_payment_percentage || "",
    cancellation_policy: venue.cancellation_policy || ""
  });

  useEffect(() => {
    setForm({
      starting_price: venue.starting_price || "",
      maximum_price: venue.maximum_price || "",
      pricing_note: venue.pricing_note || "",
      advance_payment_percentage: venue.advance_payment_percentage || "",
      cancellation_policy: venue.cancellation_policy || ""
    });
  }, [venue]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Starting price (₹)"
          type="number"
          value={form.starting_price}
          onChange={(e) => setForm({ ...form, starting_price: e.target.value })}
        />
        <Input
          label="Maximum price (₹)"
          type="number"
          value={form.maximum_price}
          onChange={(e) => setForm({ ...form, maximum_price: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pricing note</label>
        <textarea
          rows={2}
          placeholder="e.g. Price varies based on guest count and services selected"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={form.pricing_note}
          onChange={(e) => setForm({ ...form, pricing_note: e.target.value })}
        />
      </div>

      <Input
        label="Advance payment required (%)"
        type="number"
        min="0"
        max="100"
        value={form.advance_payment_percentage}
        onChange={(e) => setForm({ ...form, advance_payment_percentage: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation policy</label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={form.cancellation_policy}
          onChange={(e) => setForm({ ...form, cancellation_policy: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>Back</Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button loading={saving} onClick={() => onSave(form)}>Save Pricing & Policies</Button>
          {onNext && (
            <Button variant="outline" onClick={onNext}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}