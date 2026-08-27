import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { adminSidebarItems } from "../adminSidebarItems.js";
import { useFetch } from "../../../hooks/useFetch";
import Badge from "../../../components/common/Badge";
import Input from "../../../components/common/Input";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import { formatDate } from "../../../lib/formatters";
import { Search } from "lucide-react";

export default function VenueList() {
  const { data: venues, loading } = useFetch("/venues");
  const [search, setSearch] = useState("");

  const filtered = (venues || []).filter((v) =>
    v.hall_name.toLowerCase().includes(search.toLowerCase()) ||
    v.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout sidebarItems={adminSidebarItems} pageTitle="Venues">
      <div className="mb-4 max-w-sm relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        <Input
          placeholder="Search by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <EmptyState title="No venues found" />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Hall Name</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/admin/venues/${v.id}`} className="font-medium text-primary-600">
                      {v.hall_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{v.city}</td>
                  <td className="px-4 py-3">{v.subscription?.plan?.name || "-"}</td>
                  <td className="px-4 py-3"><Badge status={v.subscription?.status || "trial"} /></td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(v.last_login_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}