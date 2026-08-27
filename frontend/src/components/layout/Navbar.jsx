import React, { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="font-semibold text-gray-800">{title}</h1>

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg"
        >
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
            <User size={16} />
          </div>
          <span>{user?.name}</span>
          <ChevronDown size={14} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}