import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, MessageCircle, Users } from "lucide-react";
import SearchBar from "../search/SearchBar";
import { CATEGORIES, BRAND_NAME } from "../../lib/constants";

const trustPoints = [
  { icon: ShieldCheck, label: "Verified vendors" },
  { icon: MessageCircle, label: "Direct contact, no middleman" },
  { icon: Users, label: "Real customer reviews" }
];

export default function HeroSearch({ topCities = [] }) {
  return (
    <section className="relative bg-gradient-to-b from-navy-900 via-navy-900 to-white pb-20 pt-16 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-gold-500/10 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <span className="inline-block text-xs font-semibold tracking-wide text-gold-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          Wedding and Event Vendors, Verified
        </span>

        <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
          Find the perfect vendor <br className="hidden md:block" />
          for your wedding and events
        </h1>

        <p className="text-navy-100 text-sm md:text-base max-w-xl mx-auto">
          {BRAND_NAME} helps you search, compare and directly contact verified banquet halls, decorators,
          caterers, photographers and every other vendor you need.
        </p>

        <SearchBar large />

        <div className="flex flex-wrap justify-center gap-4 pt-1">
          {trustPoints.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex items-center gap-1.5 text-xs text-navy-100">
                <Icon size={14} className="text-gold-400" />
                {t.label}
              </div>
            );
          })}
        </div>

        {topCities.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {topCities.slice(0, 10).map((c) => (
              <Link
                key={c.city}
                to={`/search?city=${c.city}`}
                className="text-xs bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                {c.city} ({c.vendor_count})
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              to={`/search?category=${cat.slug}`}
              className="text-xs bg-white text-navy-700 px-3 py-1.5 rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors shadow-sm"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}