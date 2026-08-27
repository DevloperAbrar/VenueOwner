import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import { clientService } from "../../../services/clientService";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import Input from "../../../components/common/Input";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { formatCurrency } from "../../../lib/formatters";
import { showSuccess, showError } from "../../../components/common/Toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function ClientList() {
  const { venue } = useVenue();
  const { data: clients, loading, refetch } = useFetch(venue ? `/venues/${venue.id}/clients` : null, { skip: !venue });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const editForm = useForm();

  const onSubmit = async (values) => {
    try {
      await clientService.create(venue.id, values);
      showSuccess("Client added");
      reset();
      setModalOpen(false);
      refetch();
    } catch {
      showError("Failed to add client");
    }
  };

  const openEdit = (client) => {
    setEditingClient(client);
    editForm.reset({
      name: client.name || "",
      phone: client.phone || "",
      email: client.email || ""
    });
  };

  const onEditSubmit = async (values) => {
    try {
      await clientService.update(venue.id, editingClient.id, values);
      showSuccess("Client updated");
      setEditingClient(null);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to update client");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await clientService.delete(venue.id, deletingClient.id);
      showSuccess("Client deleted");
      setDeletingClient(null);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete client");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Clients">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Add Client</Button>
      </div>

      {loading ? (
        <Loader />
      ) : !clients || clients.length === 0 ? (
        <EmptyState title="No clients yet" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Total Business</th>
                <th className="px-4 py-3">Pending Balance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/clients/${c.id}`} className="font-medium text-primary-600">{c.name}</Link>
                  </td>
                  <td className="px-4 py-3">{c.phone}</td>
                  <td className="px-4 py-3">{formatCurrency(c.total_business_value)}</td>
                  <td className="px-4 py-3 text-red-600">{formatCurrency(c.pending_balance)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-gray-500 hover:text-primary-600"
                        title="Edit client"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingClient(c)}
                        className="text-gray-500 hover:text-red-600"
                        title="Delete client"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Client Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Client">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Name" {...register("name", { required: true })} />
          <Input label="Phone" {...register("phone", { required: true })} />
          <Input label="Email" {...register("email")} />
          <Button type="submit" loading={isSubmitting} className="w-full">Add Client</Button>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      <Modal isOpen={!!editingClient} onClose={() => setEditingClient(null)} title="Edit Client">
        <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
          <Input label="Name" {...editForm.register("name", { required: true })} />
          <Input label="Phone" {...editForm.register("phone", { required: true })} />
          <Input label="Email" {...editForm.register("email")} />
          <Button type="submit" loading={editForm.formState.isSubmitting} className="w-full">
            Save Changes
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingClient}
        onClose={() => setDeletingClient(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Client"
        message={`Are you sure you want to delete "${deletingClient?.name}"? This cannot be undone. Clients with existing bookings cannot be deleted.`}
        confirmLabel="Delete"
      />
    </DashboardLayout>
  );
}