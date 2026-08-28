import React, { useState, useEffect } from "react";
import Input from "../../../../components/common/Input";
import MultiSelect from "../../../../components/common/MultiSelect";
import Button from "../../../../components/common/Button";

export default function ServiceAreasTab({ venue, cities, onSaveProfile, onSaveServiceAreas, saving }) {
  const [travelNote, setTravelNote] = useState(venue.service_travel_note || "");
  const [primaryLocality, setPrimaryLocality] = useState(venue.primary_locality || "");
  const [pincode, setPincode] = useState(venue.full_pincode || "");
  const [additionalCities, setAdditionalCities] = useState(
    (venue.serviceAreas || []).map((c) => c.id)
  );

  useEffect(() => {
    setTravelNote(venue.service_travel_note || "");
    setPrimaryLocality(venue.primary_locality || "");
    setPincode(venue.full_pincode || "");
    setAdditionalCities((venue.serviceAreas || []).map((c) => c.id));
  }, [venue]);

  const cityOptions = cities.map((c) => ({ value: c.id, label: `${c.name}, ${c.state}` }));

  const handleSave = async () => {
    await onSaveProfile({
      primary_locality: primaryLocality,
      full_pincode: pincode,
      service_travel_note: travelNote
    });
    await onSaveServiceAreas(additionalCities);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
        Your primary city is <span className="font-medium text-gray-800">{venue.city}</span>, taken from your venue profile.
      </div>

      <Input
        label="Primary locality / area"
        placeholder="e.g. Vijay Nagar, AB Road"
        value={primaryLocality}
        onChange={(e) => setPrimaryLocality(e.target.value)}
      />

      <Input
        label="Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />

      <MultiSelect
        label="Additional service cities (up to 5)"
        options={cityOptions}
        value={additionalCities}
        onChange={(vals) => setAdditionalCities(vals.slice(0, 5))}
        placeholder="Select cities you also travel to"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Service travel note</label>
        <textarea
          rows={2}
          placeholder="e.g. We travel up to 50km from Indore"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={travelNote}
          onChange={(e) => setTravelNote(e.target.value)}
        />
      </div>

      <Button loading={saving} onClick={handleSave}>Save Service Areas</Button>
    </div>
  );
}