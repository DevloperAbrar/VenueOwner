import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ items = [], logo = "VenueSafar" }) {
  const { sidebarCollapsed, toggleSidebar } = useAuthStore();

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
        {items.map((item) => (
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