import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Check } from "lucide-react";

export default function MultiSelect({ label, error, options = [], value = [], onChange, placeholder = "Select options" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Exclude any placeholder-style empty-value option (e.g. { value: "", label: "Select type" })
  const realOptions = options.filter((opt) => opt.value !== "");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optValue) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeOption = (optValue, e) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optValue));
  };

  const selectedLabels = realOptions.filter((opt) => value.includes(opt.value));

  return (
    <div className="w-full relative" ref={ref}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}

      <div
        onClick={() => setOpen(!open)}
        className={`w-full min-h-[42px] px-3 py-2 border rounded-lg text-sm bg-white cursor-pointer flex items-center flex-wrap gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      >
        {selectedLabels.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}

        {selectedLabels.map((opt) => (
          <span
            key={opt.value}
            className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2 py-1 rounded-full"
          >
            {opt.label}
            <button
              type="button"
              onClick={(e) => removeOption(opt.value, e)}
              className="hover:text-primary-900"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <ChevronDown size={16} className="ml-auto text-gray-400 flex-shrink-0" />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {realOptions.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                  isSelected ? "text-primary-700 font-medium" : "text-gray-700"
                }`}
              >
                {opt.label}
                {isSelected && <Check size={14} className="text-primary-600" />}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}