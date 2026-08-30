import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-700">VenueSafar</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link to="/search" className="hover:text-primary-600">Browse Vendors</Link>
          <a href={`${APP_URL}/login`} className="hover:text-primary-600">List Your Business</a>
        </nav>
        <button className="md:hidden text-gray-600"><Menu size={22} /></button>
      </div>
    </header>
  );
}