import React from "react";

export default function AboutSection({ venue }) {
  if (!venue.about_text) return null;

  return (
    <section id="about" className="py-24 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ color: venue.theme_color || "#7c3aed" }}>
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              About {venue.hall_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
              {venue.about_text}
            </p>

            {(venue.about_highlights || []).length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-8">
                {venue.about_highlights.map((h, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{h.title}</p>
                    {h.value && <p className="text-xs text-gray-500 mt-1">{h.value}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image or decorative block */}
          <div className="relative">
            {venue.hero_image_url ? (
              <img
                src={venue.hero_image_url}
                alt={venue.hall_name}
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
            ) : (
              <div
                className="w-full h-80 rounded-2xl flex items-center justify-center text-white text-6xl font-bold"
                style={{ backgroundColor: venue.theme_color || "#7c3aed" }}
              >
                {venue.hall_name?.[0]}
              </div>
            )}
            {/* Decorative element */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl opacity-30"
              style={{ backgroundColor: venue.theme_color || "#7c3aed" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}