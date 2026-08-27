import React from "react";

export default function Card({ children, className = "", title, action }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="font-semibold text-gray-800">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}