import React from "react";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} CampusSafar Technologies Private Limited</p>
        <div className="flex gap-4">
          <a href={`${APP_URL}/login`} className="hover:text-primary-600">List your business</a>
        </div>
      </div>
    </footer>
  );
}