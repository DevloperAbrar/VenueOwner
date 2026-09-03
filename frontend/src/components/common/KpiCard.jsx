import React from "react";

export default function KpiCard({ icon: Icon, label, value, sublabel, accent = "#7c3aed" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
      {Icon && (
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${accent}15` }}
        >
          <Icon size={20} style={{ color: accent }} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium truncate">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        {sublabel && <p className="text-xs text-gray-400 mt-0.5 truncate">{sublabel}</p>}
      </div>
    </div>
  );
}