import React, { useState, useMemo } from "react";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Loader from "../../../components/common/Loader";
import BookingDetail from "./BookingDetail.jsx";
import QuickBookingModal from "./QuickBookingModal.jsx";

const localizer = dayjsLocalizer(dayjs);

// Combines an event_date ("2026-08-28") with a slot time ("09:00:00" or "09:00")
// into a real JS Date, so RBC can place the event on the correct time row.
function combineDateAndTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [h, m, s] = timeStr.split(":").map(Number);
  return dayjs(dateStr)
    .hour(h || 0)
    .minute(m || 0)
    .second(s || 0)
    .toDate();
}

export default function BookingCalendarView() {
  const { venue } = useVenue();
  const { data: bookings, loading, refetch } = useFetch(venue ? `/venues/${venue.id}/bookings` : null, { skip: !venue });
  const { data: slots } = useFetch(venue ? `/venues/${venue.id}/slots` : null, { skip: !venue });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quickBookDate, setQuickBookDate] = useState(null);

  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = useMemo(
    () =>
      (bookings || []).map((b) => {
        const start = combineDateAndTime(b.event_date, b.slot?.start_time) || new Date(b.event_date);
        const end = combineDateAndTime(b.event_date, b.slot?.end_time) || new Date(b.event_date);

        return {
          id: b.id,
          title: `${b.client?.name} — ${b.slot?.name}`,
          start,
          end,
          // Only fall back to allDay if the slot has no times at all
          allDay: !b.slot?.start_time || !b.slot?.end_time,
          resource: b
        };
      }),
    [bookings]
  );

  if (loading) return <Loader fullScreen />;

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Booking Calendar">
      <p className="text-sm text-gray-500 mb-3">
        Click any date to mark it as booked, or click an existing booking to view details.
      </p>
      <div className="bg-white rounded-xl border border-gray-100 p-4" style={{ height: 650 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          view={currentView}
          onView={(view) => setCurrentView(view)}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onSelectEvent={(event) => setSelectedBooking(event.resource)}
          onSelectSlot={(slotInfo) => setQuickBookDate(slotInfo.start)}
          eventPropGetter={() => ({ style: { backgroundColor: "#7c3aed" } })}
          // Keeps Day/Week view scrolled to a sensible starting hour instead of midnight
          scrollToTime={dayjs().hour(6).minute(0).toDate()}
        />
      </div>

      <BookingDetail
        booking={selectedBooking}
        venue={venue}
        slots={slots}
        venueId={venue?.id}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onUpdated={() => { refetch(); setSelectedBooking(null); }}
      />

      <QuickBookingModal
        isOpen={!!quickBookDate}
        onClose={() => setQuickBookDate(null)}
        venue={venue}
        slots={slots}
        selectedDate={quickBookDate}
        onCreated={() => { refetch(); setQuickBookDate(null); }}
      />
    </DashboardLayout>
  );
}