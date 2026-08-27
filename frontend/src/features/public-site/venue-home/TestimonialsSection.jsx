import React from "react";
import { Star } from "lucide-react";

export default function TestimonialsSection({ venue }) {
  const testimonials = venue.testimonials || [];
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: venue.theme_color || "#7c3aed" }}>
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < (t.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600"}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                "{t.description}"
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
              {t.location && <p className="text-xs text-gray-400">{t.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}