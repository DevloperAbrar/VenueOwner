import React, { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import MultiSelect from "../../../components/common/MultiSelect";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import { bookingService } from "../../../services/bookingService";
import { showSuccess, showError } from "../../../components/common/Toast";
import { formatCurrency, formatDate } from "../../../lib/formatters";
import { BOOKING_STATUSES } from "../../../lib/constants";
import { VENUE_TYPE_OPTIONS } from "../../../lib/venueTypes";
import { Pencil, X } from "lucide-react";

export default function BookingDetail({ booking, venue, slots, venueId, isOpen, onClose, onUpdated }) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi_manual");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const venueTypeOptions = VENUE_TYPE_OPTIONS.filter(
    (opt) => opt.value && venue?.venue_type?.includes(opt.value)
  );

  useEffect(() => {
    if (booking) {
      setEditForm({
        client_name: booking.client?.name || "",
        client_phone: booking.client?.phone || "",
        slot_id: booking.slot_id || "",
        event_date: booking.event_date || "",
        venue_type: booking.venue_type || [],
        event_type: booking.event_type || "",
        guest_count: booking.guest_count || ""
      });
      setEditing(false);
    }
  }, [booking]);

  if (!booking || !editForm) return null;

  const updateField = (field, value) => setEditForm((f) => ({ ...f, [field]: value }));

  const addPayment = async () => {
    if (!paymentAmount) return showError("Enter an amount");
    setSaving(true);
    try {
      await bookingService.addPayment(venueId, booking.id, {
        amount: paymentAmount,
        method: paymentMethod,
        type: "advance"
      });
      showSuccess("Payment recorded");
      setPaymentAmount("");
      onUpdated();
    } catch {
      showError("Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await bookingService.updateStatus(venueId, booking.id, status);
      showSuccess("Booking status updated");
      onUpdated();
    } catch {
      showError("Failed to update status");
    }
  };

  const saveEdit = async () => {
    if (!editForm.client_name.trim() || !editForm.client_phone.trim() || !editForm.slot_id || !editForm.event_date) {
      return showError("Client name, phone, slot and date are required");
    }
    setSaving(true);
    try {
      await bookingService.update(venueId, booking.id, editForm);
      showSuccess("Booking updated");
      setEditing(false);
      onUpdated();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update booking");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Booking  - ${booking.client?.name}`} size="lg">
      {!editing ? (
        <>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
            >
              <Pencil size={14} /> Edit Booking
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div><span className="text-gray-400">Client:</span> {booking.client?.name}</div>
            <div><span className="text-gray-400">Phone:</span> {booking.client?.phone}</div>
            <div><span className="text-gray-400">Event Date:</span> {formatDate(booking.event_date)}</div>
            <div><span className="text-gray-400">Slot:</span> {booking.slot?.name}</div>
            {booking.venue_type?.length > 0 && (
              <div className="col-span-2">
                <span className="text-gray-400">Venue Type:</span>{" "}
                {booking.venue_type
                  .map((v) => VENUE_TYPE_OPTIONS.find((o) => o.value === v)?.label || v)
                  .join(", ")}
              </div>
            )}
            <div><span className="text-gray-400">Total Amount:</span> {formatCurrency(booking.total_amount)}</div>
            <div><span className="text-gray-400">Received:</span> {formatCurrency(booking.amount_received)}</div>
            <div className="text-red-600 font-medium col-span-2">
              Balance Pending: {formatCurrency(booking.balance_pending)}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Badge status={booking.status} />
            <Select
              value={booking.status}
              onChange={(e) => updateStatus(e.target.value)}
              options={BOOKING_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
              className="w-40"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-sm mb-3">Add Payment</h4>
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Amount" type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { value: "upi_manual", label: "UPI" },
                  { value: "cash_manual", label: "Cash" },
                  { value: "bank_transfer", label: "Bank Transfer" }
                ]}
              />
              <Button onClick={addPayment} loading={saving}>Add Payment</Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X size={14} /> Cancel Edit
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Client Name"
                value={editForm.client_name}
                onChange={(e) => updateField("client_name", e.target.value)}
              />
              <Input
                label="Phone"
                value={editForm.client_phone}
                onChange={(e) => updateField("client_phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Event Date"
                type="date"
                value={editForm.event_date}
                onChange={(e) => updateField("event_date", e.target.value)}
              />
              <Select
                label="Slot"
                value={editForm.slot_id}
                onChange={(e) => updateField("slot_id", e.target.value)}
                options={(slots || []).map((s) => ({
                  value: s.id,
                  label: `${s.name} (${s.start_time} – ${s.end_time})`
                }))}
              />
            </div>

            {venueTypeOptions.length > 0 && (
              <MultiSelect
                label="Venue Type / Hall"
                options={venueTypeOptions}
                value={editForm.venue_type}
                onChange={(val) => updateField("venue_type", val)}
                placeholder="e.g. Marriage Hall, Banquet Hall..."
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Event Type"
                value={editForm.event_type}
                onChange={(e) => updateField("event_type", e.target.value)}
              />
              <Input
                label="Guest Count"
                type="number"
                value={editForm.guest_count}
                onChange={(e) => updateField("guest_count", e.target.value)}
              />
            </div>

            <Button onClick={saveEdit} loading={saving} className="w-full">
              Save Changes
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}