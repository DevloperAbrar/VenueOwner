import React, { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import Loader from "../../../../components/common/Loader";
import { metaService } from "../../../../services/metaService";
import { showError } from "../../../../components/common/Toast";

export default function ServicesChecklistTab({ venue, onSave, saving }) {
  const [checklist, setChecklist] = useState([]);
  const [selected, setSelected] = useState(venue.marketplace_services || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSelected(venue.marketplace_services || []);
  }, [venue.marketplace_services]);

  useEffect(() => {
    if (!venue.business_category) {
      setLoading(false);
      return;
    }
    setLoading(true);
    metaService
      .getServicesChecklist(venue.business_category)
      .then(({ data }) => setChecklist(data.data))
      .catch(() => showError("Could not load services checklist"))
      .finally(() => setLoading(false));
  }, [venue.business_category]);

  if (!venue.business_category) {
    return (
      <div className="text-sm text-gray-500">
        Select a primary category in the Business Details tab first — the checklist here adapts to it.
      </div>
    );
  }

  if (loading) return <Loader />;

  const toggle = (service) => {
    setSelected((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {checklist.map((service) => (
          <label
            key={service}
            className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
          >
            <input
              type="checkbox"
              className="accent-primary-600"
              checked={selected.includes(service)}
              onChange={() => toggle(service)}
            />
            {service}
          </label>
        ))}
      </div>
      <Button loading={saving} onClick={() => onSave({ marketplace_services: selected })}>
        Save Services
      </Button>
    </div>
  );
}