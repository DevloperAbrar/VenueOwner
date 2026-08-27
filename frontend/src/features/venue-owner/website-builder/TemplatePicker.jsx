import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout.jsx";
import { ownerSidebarItems } from "../ownerSidebarItems.js";
import { useVenue } from "../../../context/VenueContext.jsx";
import { venueService } from "../../../services/venueService";
import { showSuccess, showError } from "../../../components/common/Toast";

const TEMPLATES = [
  { id: "template-1", name: "Classic Elegant", color: "#7c3aed" },
  { id: "template-2", name: "Modern Minimal", color: "#0ea5e9" },
  { id: "template-3", name: "Royal Gold", color: "#d97706" }
];

export default function TemplatePicker() {
  const { venue, refetchVenue } = useVenue();

  const selectTemplate = async (templateId, color) => {
    try {
      await venueService.update(venue.id, { template_id: templateId, theme_color: color });
      showSuccess("Template updated");
      refetchVenue();
    } catch (err) {
      showError("Failed to update template");
    }
  };

  return (
    <DashboardLayout sidebarItems={ownerSidebarItems} pageTitle="Website Template">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map((t) => (
          <div
            key={t.id}
            onClick={() => selectTemplate(t.id, t.color)}
            className={`rounded-xl border-2 p-6 cursor-pointer transition-all ${
              venue?.template_id === t.id ? "border-primary-600" : "border-gray-100"
            }`}
          >
            <div className="h-32 rounded-lg mb-3" style={{ backgroundColor: t.color }} />
            <p className="font-medium">{t.name}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}