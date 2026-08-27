import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { Building2, CreditCard, Receipt, Users, Crown, ChevronRight } from "lucide-react";

const SETTINGS_LINKS = [
  { to: "/dashboard/settings/profile", label: "Venue Profile", desc: "Name, contact, address, capacity", icon: Building2 },
  { to: "/dashboard/settings/payment", label: "Payment Settings", desc: "UPI ID and bank details for invoices", icon: CreditCard },
  { to: "/dashboard/settings/gst", label: "GST Settings", desc: "Enable GST and set your GSTIN", icon: Receipt },
  { to: "/dashboard/settings/team", label: "Team Members", desc: "Manage staff access", icon: Users },
  { to: "/dashboard/settings/subscription", label: "Subscription", desc: "Plan, billing, and usage", icon: Crown }
];

export default function SettingsIndex() {
  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Settings">
      <div className="max-w-2xl bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
        {SETTINGS_LINKS.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}