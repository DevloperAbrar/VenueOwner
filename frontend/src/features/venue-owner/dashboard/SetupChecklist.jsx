import React from "react";
import { Link } from "react-router-dom";
import { Check, Circle, X } from "lucide-react";
import { useVenueStore } from "../../../store/venueStore";

const STEPS = [
  { key: "hero_image", label: "Upload hero image", path: "/dashboard/website/hero" },
  { key: "gallery", label: "Add gallery photos", path: "/dashboard/website/gallery" },
  { key: "slots", label: "Configure slots", path: "/dashboard/slots" },
  { key: "services", label: "Add at least one service", path: "/dashboard/website/services" },
  { key: "about", label: "Write about section", path: "/dashboard/website/about" }
];

export default function SetupChecklist({ completedSteps = [] }) {
  const { setupChecklistOpen, closeSetupChecklist } = useVenueStore();

  const completionRate = Math.round((completedSteps.length / STEPS.length) * 100);
  if (!setupChecklistOpen || completionRate === 100) return null;

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5 mb-6 relative">
      <button onClick={closeSetupChecklist} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
      <h3 className="font-semibold mb-1">Finish setting up your venue ({completionRate}%)</h3>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${completionRate}%` }} />
      </div>
      <div className="space-y-2">
        {STEPS.map((step) => {
          const done = completedSteps.includes(step.key);
          return (
            <Link
              key={step.key}
              to={step.path}
              className="flex items-center gap-3 text-sm hover:bg-gray-50 p-2 rounded-lg"
            >
              {done ? <Check size={16} className="text-green-600" /> : <Circle size={16} className="text-gray-300" />}
              <span className={done ? "text-gray-400 line-through" : "text-gray-700"}>{step.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}