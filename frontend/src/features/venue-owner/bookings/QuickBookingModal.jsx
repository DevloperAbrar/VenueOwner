import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Select from "../../../components/common/Select";
import MultiSelect from "../../../components/common/MultiSelect";
import Button from "../../../components/common/Button";
import { bookingService } from "../../../services/bookingService";
import { showSuccess, showError } from "../../../components/common/Toast";
import { VENUE_TYPE_OPTIONS } from "../../../lib/venueTypes";
import dayjs from "dayjs";

export default function QuickBookingModal({ isOpen, onClose, venue, slots, selectedDate, onCreated }) {
  const [form, setForm] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    slot_id: "",
    venue_type: [],
    event_type: "",
    guest_count: "",
    total_amount: "",
    notes: ""
  });
  const [saving, setSaving] = useState(false);

  const venueTypeOptions = VENUE_TYPE_OPTIONS.filter(
    (opt) => opt.value && venue?.venue_type?.includes(opt.value)
  );

  useEffect(() => {
    if (isOpen) {
      setForm({
        client_name: "",
        client_phone: "",
        client_email: "",
        slot_id: slots?.[0]?.id || "",
        venue_type: [],
        event_type: "",
        guest_count: "",
        total_amount: "",
        notes: ""
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async () => {
    if (!form.client_name.trim() || !form.client_phone.trim() || !form.slot_id) {
      return showError("Client name, phone and slot are required");
    }
    setSaving(true);
    try {
      await bookingService.create(venue.id, {
        client_name: form.client_name,
        client_phone: form.client_phone,
        client_email: form.client_email || null,
        slot_id: form.slot_id,
        venue_type: form.venue_type,
        event_date: dayjs(selectedDate).format("YYYY-MM-DD"),
        event_type: form.event_type,
        guest_count: form.guest_count ? Number(form.guest_count) : null,
        total_amount: form.total_amount ? Number(form.total_amount) : 0,
        notes: form.notes
      });
      showSuccess("Booking created");
      onCreated?.();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Mark as Booked</h3>
            <p className="text-sm text-gray-500">{dayjs(selectedDate).format("dddd, MMMM D, YYYY")}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Client Name *</label>
              <input
                type="text"
                value={form.client_name}
                onChange={(e) => update("client_name", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone *</label>
              <input
                type="text"
                value={form.client_phone}
                onChange={(e) => update("client_phone", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Email (optional)</label>
            <input
              type="email"
              value={form.client_email}
              onChange={(e) => update("client_email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <Select
            label="Slot *"
            value={form.slot_id}
            onChange={(e) => update("slot_id", e.target.value)}
            options={[{ value: "", label: "Select slot" }, ...(slots || []).map((s) => ({
              value: s.id,
              label: `${s.name} (${s.start_time} – ${s.end_time})`
            }))]}
          />

          {venueTypeOptions.length > 0 && (
            <MultiSelect
              label="Venue Type / Hall (select all that apply for this event)"
              options={venueTypeOptions}
              value={form.venue_type}
              onChange={(val) => update("venue_type", val)}
              placeholder="e.g. Marriage Hall, Banquet Hall..."
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Event Type</label>
              <input
                type="text"
                placeholder="e.g. Wedding"
                value={form.event_type}
                onChange={(e) => update("event_type", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Guest Count</label>
              <input
                type="number"
                value={form.guest_count}
                onChange={(e) => update("guest_count", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Total Amount (optional)</label>
            <input
              type="number"
              value={form.total_amount}
              onChange={(e) => update("total_amount", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={submit} loading={saving} className="flex-1">Confirm Booking</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}