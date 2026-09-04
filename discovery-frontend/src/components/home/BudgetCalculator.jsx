import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Users, ArrowRight, Info } from "lucide-react";
import { BRAND_NAME } from "../../lib/constants";
import CitySelect from "../common/CitySelect";

let logoSrc = null;
try { logoSrc = new URL("../../assets/logo.png", import.meta.url).href; } catch {}

const STYLES = [
  { id: "simple",   label: "Simple",   perGuest: 1800 },
  { id: "standard", label: "Standard", perGuest: 3200 },
  { id: "premium",  label: "Premium",  perGuest: 5500 },
  { id: "luxury",   label: "Luxury",   perGuest: 9500 },
];

const BREAKDOWN = [
  { key: "venue",       label: "Venue & Marriage Hall", pct: 0.30, slug: "marriage-hall" },
  { key: "catering",    label: "Catering",              pct: 0.30, slug: "caterer" },
  { key: "decor",       label: "Decoration",            pct: 0.15, slug: "decorator" },
  { key: "photography", label: "Photography & Video",   pct: 0.12, slug: "photographer" },
  { key: "makeup",      label: "Makeup & Styling",       pct: 0.06, slug: "makeup-artist" },
  { key: "music",       label: "DJ & Music",             pct: 0.07, slug: "dj" },
];

function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export default function BudgetCalculator() {
  const navigate = useNavigate();
  const [city, setCity]     = useState("");
  const [guests, setGuests] = useState(300);
  const [style, setStyle]   = useState("standard");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const styleData = STYLES.find((s) => s.id === style);
    const total = guests * styleData.perGuest;
    setResult({ total, items: BREAKDOWN.map((b) => ({ ...b, amount: total * b.pct })) });
  };

  const goToCategory = (slug) => {
    const params = new URLSearchParams();
    params.set("category", slug);
    if (city) params.set("city", city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="bg-white py-14">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3 inline-block px-3 py-1 rounded-full"
            style={{ color: "#e8192c", background: "#e8192c0d" }}
          >
            Free Tool
          </p>
          <h2 className="font-display font-extrabold text-gray-900" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
            Plan your wedding budget in seconds
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto mt-3">
            Get an instant budget breakdown by category — then find vendors who fit it,
            all in one place.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-md p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <CitySelect value={city} onChange={setCity} placeholder="Select city" />

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                <Users size={13} /> Guest Count
              </label>
              <input
                type="number"
                min={10}
                value={guests}
                onChange={(e) => setGuests(Math.max(10, Number(e.target.value) || 0))}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                <Calculator size={13} /> Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-primary-400 transition-colors bg-white"
              >
                {STYLES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={calculate}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#e8192c,#f5a623)" }}
          >
            Calculate My Budget
          </button>

          {result && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="text-center mb-7">
                <p className="text-xs text-gray-400 mb-1">Estimated total budget</p>
                <p className="font-display font-extrabold text-gray-900" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)" }}>
                  {formatINR(result.total)}
                </p>
              </div>

              <div className="space-y-4">
                {result.items.map((item) => (
                  <div key={item.key} className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-semibold text-gray-900">{formatINR(item.amount)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.pct * 100}%`, background: "linear-gradient(90deg,#e8192c,#f5a623)" }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => goToCategory(item.slug)}
                      className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
                    >
                      Find <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 mt-6 text-[11px] text-gray-400 leading-relaxed">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                This is an estimate based on typical costs. Actual vendor pricing varies by
                city, season and package — browse real quotes on {BRAND_NAME}.
              </div>
            </div>
          )}
        </div>

        {logoSrc && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <span className="text-[11px] text-gray-400">Estimator powered by</span>
            <img src={logoSrc} alt={BRAND_NAME} className="h-4 w-auto object-contain opacity-70" />
          </div>
        )}
      </div>
    </section>
  );
}