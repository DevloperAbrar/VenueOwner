import React from "react";

export default function ServicesSection({ venue }) {
  const visibleServices = (venue.services || []).filter((s) => s.visible !== false);
  if (visibleServices.length === 0) return null;

  return (
    <section id="services" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: venue.theme_color || "#7c3aed" }}>
            What We Offer
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Our Services</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visibleServices.map((s, idx) => (
            <div
              key={s.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700"
            >
              <div className="flex items-start gap-4">
                {/* Number or icon */}
                <div className="flex-shrink-0">
                  {s.icon ? (
                    <span className="text-3xl">{s.icon}</span>
                  ) : (
                    <span
                      className="text-xs font-bold text-white w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: venue.theme_color || "#7c3aed" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                      {s.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}