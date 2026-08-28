import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ServicesGrid({ services = [] }) {
  if (!services.length) return null;

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {services.map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" /> {s}
          </div>
        ))}
      </div>
    </div>
  );
}