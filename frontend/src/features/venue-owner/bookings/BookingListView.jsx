import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import { bookingService } from "../../../services/bookingService";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import BookingDetail from "./BookingDetail.jsx";
import { formatCurrency, formatDate } from "../../../lib/formatters";
import { showSuccess, showError } from "../../../components/common/Toast";
import { CalendarDays, Trash2 } from "lucide-react";

export default function BookingListView() {
  const { venue } = useVenue();
  const { data: bookings, loading, refetch } = useFetch(venue ? `/venues/${venue.id}/bookings` : null, { skip: !venue });
  const { data: slots } = useFetch(venue ? `/venues/${venue.id}/slots` : null, { skip: !venue });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deletingBooking, setDeletingBooking] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await bookingService.delete(venue.id, deletingBooking.id);
      showSuccess("Booking deleted");
      setDeletingBooking(null);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Bookings">
      <div className="flex justify-end mb-4">
        <Link to="/dashboard/bookings/calendar" className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
          <CalendarDays size={16} /> Calendar View
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : !bookings || bookings.length === 0 ? (
        <EmptyState title="No bookings yet" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Event Date</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    {b.client?.name}
                  </td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    {formatDate(b.event_date)}
                  </td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    {b.slot?.name}
                  </td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    {formatCurrency(b.total_amount)}
                  </td>
                  <td className="px-4 py-3 text-red-600 cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    {formatCurrency(b.balance_pending)}
                  </td>
                  <td className="px-4 py-3 cursor-pointer" onClick={() => setSelectedBooking(b)}>
                    <Badge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDeletingBooking(b)}
                        className="text-gray-500 hover:text-red-600"
                        title="Delete booking"
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

      <BookingDetail
        booking={selectedBooking}
        venue={venue}
        slots={slots}
        venueId={venue?.id}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => { refetch(); setSelectedBooking(null); }}
      />

      <ConfirmDialog
        isOpen={!!deletingBooking}
        onClose={() => setDeletingBooking(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Booking"
        message={`Delete the booking for "${deletingBooking?.client?.name}" on ${deletingBooking ? formatDate(deletingBooking.event_date) : ""}? This cannot be undone and will remove any recorded payments for this booking.`}
        confirmLabel="Delete"
      />
    </DashboardLayout>
  );
}