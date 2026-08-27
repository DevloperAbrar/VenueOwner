import React, { useState } from "react";
import { X } from "lucide-react";

export default function GallerySection({ venue }) {
  const gallery = venue.gallery || [];
  const [lightbox, setLightbox] = useState(null);
  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-24 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: venue.theme_color || "#7c3aed" }}>
            Our Space
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Gallery</h2>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {gallery.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightbox(idx)}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded-xl group"
            >
              <img
                src={img.url}
                alt=""
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <img
            src={gallery[lightbox]?.url}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 text-white text-sm opacity-60">
            {lightbox + 1} / {gallery.length}
          </div>
        </div>
      )}
    </section>
  );
}