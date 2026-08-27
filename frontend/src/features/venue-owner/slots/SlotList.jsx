import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import api from "../../../services/api";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import SlotForm from "./SlotForm.jsx";
import { showSuccess, showError } from "../../../components/common/Toast";
import { formatCurrency } from "../../../lib/formatters";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function SlotList() {
  const { venue, refetchVenue } = useVenue(); // ADD refetchVenue
  const { data: slots, loading, refetch } = useFetch(venue ? `/venues/${venue.id}/slots` : null, { skip: !venue });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreate = () => { setEditingSlot(null); setModalOpen(true); };
  const openEdit = (slot) => { setEditingSlot(slot); setModalOpen(true); };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingSlot) {
        await api.patch(`/venues/${venue.id}/slots/${editingSlot.id}`, values);
        showSuccess("Slot updated");
      } else {
        await api.post(`/venues/${venue.id}/slots`, values);
        showSuccess("Slot created");
      }
      setModalOpen(false);
      refetch();
      await refetchVenue(); // ADD — updates checklist on dashboard
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save slot");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/venues/${venue.id}/slots/${deletingSlot.id}`);
      showSuccess("Slot deleted");
      refetch();
      await refetchVenue(); // ADD — updates checklist on dashboard
    } catch {
      showError("Failed to delete slot");
    } finally {
      setDeletingSlot(null);
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Slots & Availability">
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}><Plus size={16} /> Add Slot</Button>
      </div>

      {loading ? (
        <Loader />
      ) : !slots || slots.length === 0 ? (
        <EmptyState title="No slots configured yet" description="Add your first slot (e.g. Morning, Evening, Full Day) to start accepting bookings." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{slot.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(slot)} className="text-gray-400 hover:text-primary-600"><Edit2 size={14} /></button>
                  <button onClick={() => setDeletingSlot(slot)} className="text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm text-gray-500">{slot.start_time} – {slot.end_time}</p>
              <p className="text-sm font-medium mt-1">{formatCurrency(slot.base_price)}</p>
              {slot.weekend_price && <p className="text-xs text-gray-400">Weekend: {formatCurrency(slot.weekend_price)}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSlot ? "Edit Slot" : "Add Slot"}>
        <SlotForm existingSlot={editingSlot} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} submitting={submitting} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        onConfirm={handleDelete}
        title="Delete this slot?"
        message="Existing bookings on this slot will keep their record, but new bookings can't use it."
      />
    </DashboardLayout>
  );
}