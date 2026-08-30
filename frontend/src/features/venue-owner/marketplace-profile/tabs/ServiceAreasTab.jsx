import React, { useState, useEffect } from "react";
import Input from "../../../../components/common/Input";
import Select from "../../../../components/common/Select";
import MultiSelect from "../../../../components/common/MultiSelect";
import Button from "../../../../components/common/Button";
import { useFetch } from "../../../../hooks/useFetch";
import { showError } from "../../../../components/common/Toast";

export default function ServiceAreasTab({ venue, onSaveProfile, onSaveServiceAreas, saving, onNext, onBack }) {
  const [travelNote, setTravelNote] = useState(venue.service_travel_note || "");
  const [primaryLocality, setPrimaryLocality] = useState(venue.primary_locality || "");
  const [pincode, setPincode] = useState(venue.full_pincode || "");

  // Selected additional cities are stored as real {name, state} pairs — not internal
  // ids — since they come live from the states/cities API, not a pre-seeded list.
  const [selectedCities, setSelectedCities] = useState(
    (venue.serviceAreas || []).map((c) => ({ name: c.name, state: c.state }))
  );
  const [selectedStateIso, setSelectedStateIso] = useState("");

  useEffect(() => {
    setTravelNote(venue.service_travel_note || "");
    setPrimaryLocality(venue.primary_locality || "");
    setPincode(venue.full_pincode || "");
    setSelectedCities((venue.serviceAreas || []).map((c) => ({ name: c.name, state: c.state })));
  }, [venue]);

  const { data: states, loading: statesLoading, error: statesError } = useFetch("/meta/states");
  const {
    data: statesCities,
    loading: citiesLoading,
    error: citiesError
  } = useFetch(selectedStateIso ? `/meta/states/${selectedStateIso}/cities` : null);

  useEffect(() => {
    if (statesError) showError(statesError);
  }, [statesError]);
  useEffect(() => {
    if (citiesError) showError(citiesError);
  }, [citiesError]);

  const stateOptions = [
    { value: "", label: statesLoading ? "Loading states..." : "Select a state" },
    ...((states || []).map((s) => ({ value: s.iso2, label: s.name })))
  ];

  const selectedStateName = (states || []).find((s) => s.iso2 === selectedStateIso)?.name || "";

  // Keep chips for already-selected cities visible even after switching state,
  // plus the current state's city list to browse and pick from.
  const selectedOptionEntries = selectedCities.map((c) => ({
    value: `${c.state}|${c.name}`,
    label: `${c.name}, ${c.state}`
  }));
  const browseOptionEntries = selectedStateName
    ? (statesCities || []).map((c) => ({
        value: `${selectedStateName}|${c.name}`,
        label: `${c.name}, ${selectedStateName}`
      }))
    : [];
  const cityOptions = [...selectedOptionEntries, ...browseOptionEntries].filter(
    (opt, idx, arr) => arr.findIndex((o) => o.value === opt.value) === idx
  );

  const selectedValues = selectedCities.map((c) => `${c.state}|${c.name}`);

  const handleCitiesChange = (vals) => {
    const next = vals.slice(0, 5).map((v) => {
      const [state, name] = v.split("|");
      return { name, state };
    });
    setSelectedCities(next);
  };

  const handleSave = async () => {
    await onSaveProfile({
      primary_locality: primaryLocality,
      full_pincode: pincode,
      service_travel_note: travelNote
    });
    await onSaveServiceAreas(selectedCities);
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
        maxLength={6}
        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional service cities (up to 5)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            options={stateOptions}
            value={selectedStateIso}
            onChange={(e) => setSelectedStateIso(e.target.value)}
          />
          <MultiSelect
            options={cityOptions}
            value={selectedValues}
            onChange={handleCitiesChange}
            placeholder={
              citiesLoading
                ? "Loading cities..."
                : selectedStateName
                ? `Select cities in ${selectedStateName}`
                : "Pick a state first, or search a city you've already picked"
            }
            searchable
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Pick a state, then search and select cities from the real list. Up to 5, across any states.
        </p>
      </div>

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

      <div className="flex items-center justify-between pt-2">
        {onBack ? (
          <Button variant="outline" onClick={onBack}>Back</Button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-2">
          <Button loading={saving} onClick={handleSave}>Save Service Areas</Button>
          {onNext && (
            <Button variant="outline" onClick={onNext}>Next</Button>
          )}
        </div>
      </div>
    </div>
  );
}