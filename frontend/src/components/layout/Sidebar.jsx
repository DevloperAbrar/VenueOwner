import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useAuth } from "../../context/AuthContext";
import { VenueContext } from "../../context/VenueContext.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Nav items without a requiredFeature tag that are still owner-only account
// areas (not part of the per-feature permission checklist).
const OWNER_ONLY_PATHS = ["/dashboard/settings", "/dashboard/analytics"];

export default function Sidebar({ items = [], logo = "VenueSafar" }) {
  const { sidebarCollapsed, toggleSidebar } = useAuthStore();
  const { user } = useAuth();
  const venueCtx = useContext(VenueContext); // null outside VenueProvider (e.g. admin panel)  - that's fine
  const planFeatures = venueCtx?.venue?.subscription?.plan?.features;
  const isTeamMember = user?.role === "team_member";

  const visibleItems = items.filter((item) => {
    if (isTeamMember && OWNER_ONLY_PATHS.includes(item.path)) return false;
    if (isTeamMember && item.requiredFeature) {
      return user.permissions?.[item.requiredFeature] === true;
    }
    if (!item.requiredFeature) return true; // items without a gate always show
    if (!planFeatures) return true; // not in an owner context (e.g. admin sidebar)  - don't filter
    return planFeatures.includes(item.requiredFeature);
  });

  return (
    <aside
      className={`bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col transition-all ${
        sidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        {!sidebarCollapsed && <span className="font-bold text-primary-600 text-lg">{logo}</span>}
        <button onClick={toggleSidebar} className="text-gray-400 hover:text-gray-600">
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
      {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-primary-50 text-primary-700" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon size={18} />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}