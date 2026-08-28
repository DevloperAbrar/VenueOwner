import React, { useState } from "react";
import { X } from "lucide-react";

export default function PhotoGallery({ gallery = [] }) {
  const [active, setActive] = useState(null);
  if (!gallery.length) return null;

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-3">Photo Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {gallery.map((img, i) => (
          <img
            key={i}
            src={img.url || img}
            onClick={() => setActive(img.url || img)}
            className="w-full h-32 object-cover rounded-lg cursor-pointer"
            alt={`Gallery ${i + 1}`}
          />
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <button className="absolute top-4 right-4 text-white"><X size={28} /></button>
          <img src={active} alt="Preview" className="max-h-[85vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}