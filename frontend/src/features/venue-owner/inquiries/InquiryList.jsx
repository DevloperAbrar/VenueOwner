import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { useFetch } from "../../../hooks/useFetch";
import Select from "../../../components/common/Select";
import Badge from "../../../components/common/Badge";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import { formatDate } from "../../../lib/formatters";
import { INQUIRY_STATUSES } from "../../../lib/constants";

export default function InquiryList() {
  const { venue } = useVenue();
  const [statusFilter, setStatusFilter] = useState("");

  const url = venue ? `/venues/${venue.id}/inquiries${statusFilter ? `?status=${statusFilter}` : ""}` : null;
  const { data: inquiries, loading } = useFetch(url, { skip: !venue, deps: [statusFilter] });

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Inquiries">
      <div className="mb-4 max-w-xs">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[{ value: "", label: "All Statuses" }, ...INQUIRY_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))]}
        />
      </div>

      {loading ? (
        <Loader />
      ) : !inquiries || inquiries.length === 0 ? (
        <EmptyState title="No inquiries yet" description="New inquiries from your public website will appear here." />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Event Date</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/dashboard/inquiries/${inq.id}`} className="font-medium text-primary-600">
                      {inq.customer_name}
                    </Link>
                    <p className="text-xs text-gray-400">{inq.phone}</p>
                  </td>
                  <td className="px-4 py-3">{formatDate(inq.event_date)}</td>
                  <td className="px-4 py-3">{inq.event_type}</td>
                  <td className="px-4 py-3"><Badge status={inq.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(inq.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}