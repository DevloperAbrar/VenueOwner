import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown, MessageSquareText, Building2, LogOut, BadgeCheck } from "lucide-react";
import { usePublicAuth } from "../../context/PublicAuthContext.jsx";
import MyReviewsModal from "../vendor-profile/MyReviewsModal.jsx";
import { BRAND_NAME } from "../../lib/constants";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

export default function Header() {
  const { user, vendorSession, logout } = usePublicAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMyReviews, setShowMyReviews] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold text-navy-900">
          In<span className="text-primary-600">2</span>Fest
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link to="/search" className="hover:text-primary-600">Browse Vendors</Link>
          <a href={`${APP_URL}/login`} className="hover:text-primary-600">List Your Business</a>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-semibold flex items-center justify-center overflow-hidden">
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    : user.name?.[0]?.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>

                  <div className="px-4 py-2.5 flex items-center gap-2 text-sm text-gray-600">
                    <MessageSquareText size={16} className="text-primary-600" />
                    {user.review_count} review{user.review_count === 1 ? "" : "s"} given
                  </div>

                  <button
                    onClick={() => { setShowMyReviews(true); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <MessageSquareText size={16} className="text-gray-400" /> My Reviews
                  </button>

                  <Link
                    to="/register-free"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Building2 size={16} className="text-gray-400" /> Become a Vendor
                  </Link>

                  <div className="border-t border-gray-50 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : vendorSession ? (

            <a href={APP_URL}
              className="flex items-center gap-1.5 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-100 px-2.5 py-1.5 rounded-full"
              title="You're signed in to your vendor dashboard in this browser"
            >
              <BadgeCheck size={14} /> Vendor: {vendorSession.name}
            </a>
          ) : null}
        </nav>

        <button className="md:hidden text-gray-600"><Menu size={22} /></button>
      </div>

      {showMyReviews && <MyReviewsModal onClose={() => setShowMyReviews(false)} />}
    </header>
  );
}