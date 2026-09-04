import React from "react";
import { Star, Quote } from "lucide-react";

// ⚠️ REPLACE WITH REAL TESTIMONIALS BEFORE LAUNCH — do not publish
// fabricated quotes. Set SHOW_SECTION to false below if you have none yet.
const TESTIMONIALS = [
  {
    name: "Priya & Rohan",
    role: "Booked their wedding hall & catering",
    city: "Indore",
    quote: "We compared three halls and booked catering, all without a single confusing phone call. Seeing the actual calendar before deciding made this so much easier.",
    rating: 5
  },
  {
    name: "Ankit Sharma",
    role: "Decorator, Early Vendor Partner",
    city: "Indore",
    quote: "My own website went live in a day. Inquiries now come straight to my dashboard instead of missed calls.",
    rating: 5
  },
  {
    name: "Meera Joshi",
    role: "Booked photography & makeup",
    city: "Bhopal",
    quote: "Being able to see real packages and pricing upfront saved us so many awkward negotiation calls.",
    rating: 5
  }
];

const SHOW_SECTION = true; // flip to false if you have no real testimonials yet

export default function Testimonials() {
  if (!SHOW_SECTION || TESTIMONIALS.length === 0) return null;

  return (
    <section className="py-16 md:py-20" style={{ background: "#fff6ea" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p
            className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#e8192c", background: "#e8192c0d" }}
          >
            Real Stories
          </p>
          <h2 className="font-display font-extrabold text-navy-900" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em" }}>
            What people are saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <Quote size={22} style={{ color: "#e8192c33" }} className="mb-3" />
              <p className="text-sm text-gray-700 leading-relaxed mb-5 flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={13} style={{ color: "#f5a623" }} className="fill-current" />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "#1a2035" }}
                >
                  {t.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-900 truncate">{t.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}