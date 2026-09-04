import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowRight, Info, Share2, Check } from "lucide-react";
import { BRAND_NAME } from "../../lib/constants";
import CitySelect from "../common/CitySelect";

const STYLES = [
  { id: "simple", label: "Simple" },
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
  { id: "luxury", label: "Luxury" }
];

// "perGuest" categories genuinely scale with headcount (venue capacity, food, cards).
// "flat" categories don't — a photographer or DJ doesn't cost 4x for 4x the guests,
// so they only get a mild bump via the guest-tier multiplier below.
const CATEGORY_MODEL = [
  { key: "venue",       label: "Venue & Hall Rental",     slug: "marriage-hall",  type: "perGuest", defaultOn: true,  rate: { simple: 450, standard: 800, premium: 1400, luxury: 2400 } },
  { key: "catering",    label: "Catering & Food",         slug: "caterer",        type: "perGuest", defaultOn: true,  rate: { simple: 550, standard: 950, premium: 1600, luxury: 2800 } },
  { key: "decor",       label: "Decoration & Stage",      slug: "decorator",      type: "flat",      defaultOn: true,  rate: { simple: 35000, standard: 85000, premium: 220000, luxury: 550000 } },
  { key: "photography", label: "Photography & Films",     slug: "photographer",   type: "flat",      defaultOn: true,  rate: { simple: 25000, standard: 60000, premium: 150000, luxury: 400000 } },
  { key: "makeup",      label: "Bridal Makeup & Styling", slug: "makeup-artist",  type: "flat",      defaultOn: true,  rate: { simple: 8000, standard: 20000, premium: 45000, luxury: 100000 } },
  { key: "music",       label: "DJ, Sound & Lighting",    slug: "dj",             type: "flat",      defaultOn: true,  rate: { simple: 15000, standard: 35000, premium: 80000, luxury: 180000 } },
  { key: "mehendi",     label: "Mehndi Artist",           slug: "mehendi-artist", type: "flat",      defaultOn: false, rate: { simple: 5000, standard: 12000, premium: 25000, luxury: 55000 } },
  { key: "cards",       label: "Invitations & Cards",     slug: "card-printing",  type: "perGuest",  defaultOn: false, rate: { simple: 15, standard: 35, premium: 80, luxury: 180 } }
];

const GUEST_TIERS = [
  { max: 150, mult: 0.85 },
  { max: 350, mult: 1 },
  { max: 600, mult: 1.25 },
  { max: Infinity, mult: 1.55 }
];
function guestTierMultiplier(guests) {
  return (GUEST_TIERS.find((t) => guests <= t.max) || GUEST_TIERS[GUEST_TIERS.length - 1]).mult;
}

const PALETTE = ["#e8192c", "#f5a623", "#1a2035", "#2a3151", "#ee747c", "#f8c976", "#6d7591", "#9aa0b8"];

function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function DonutChart({ items, total }) {
  const size = 220;
  const stroke = 26;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f2f3f6" strokeWidth={stroke} />
      {items.map((item, i) => {
        const pct = total > 0 ? item.amount / total : 0;
        const dash = pct * circumference;
        const offset = cumulative;
        cumulative += dash;
        return (
          <motion.circle
            key={item.key}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          />
        );
      })}
    </svg>
  );
}

export default function WeddingBudgetPlanner() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState(300);
  const [style, setStyle] = useState("standard");
  const [activeKeys, setActiveKeys] = useState(new Set(CATEGORY_MODEL.filter((c) => c.defaultOn).map((c) => c.key)));
  const [copied, setCopied] = useState(false);

  const toggleCategory = (key) => {
    setActiveKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const { items, total } = useMemo(() => {
    const tierMult = guestTierMultiplier(guests);
    const list = CATEGORY_MODEL.filter((c) => activeKeys.has(c.key))
      .map((c) => {
        const base = c.rate[style];
        const amount = c.type === "perGuest" ? base * guests : base * tierMult;
        return { ...c, amount };
      })
      .sort((a, b) => b.amount - a.amount);
    const sum = list.reduce((s, i) => s + i.amount, 0);
    return { items: list, total: sum };
  }, [guests, style, activeKeys]);

  const goToCategory = (slug) => {
    const params = new URLSearchParams();
    params.set("category", slug);
    if (city) params.set("city", city);
    navigate(`/search?${params.toString()}`);
  };

  const shareOnWhatsApp = () => {
    const lines = items.map((i) => `• ${i.label}: ${formatINR(i.amount)}`).join("\n");
    const text = `My estimated wedding budget for ${guests} guests (${style}):\n\n${lines}\n\nTotal: ${formatINR(total)}\n\nEstimated on ${BRAND_NAME}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyEstimate = () => {
    const lines = items.map((i) => `${i.label}: ${formatINR(i.amount)}`).join("\n");
    navigator.clipboard?.writeText(`Total: ${formatINR(total)}\n${lines}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="py-14 md:py-20" style={{ background: "#f8f9fb" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3 inline-block px-3 py-1 rounded-full"
            style={{ color: "#e8192c", background: "#e8192c0d" }}
          >
            Free Tool
          </p>
          <h2 className="font-display font-extrabold text-navy-900" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}>
            Plan your wedding budget in seconds
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto mt-3">
            Pick what you need, adjust guests and style, and watch your estimate update live — then find real vendors for every category.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-md p-5 md:p-8 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CitySelect value={city} onChange={setCity} placeholder="Select city (optional)" />
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users size={13} /> Guest count
                  </span>
                  <span className="font-bold text-navy-900">{guests}</span>
                </label>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "#e8192c" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">Style</label>
              <div className="grid grid-cols-4 gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`px-2 py-3 rounded-xl border text-xs font-bold transition-all ${
                      style === s.id ? "text-white border-transparent shadow-md" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                    style={style === s.id ? { background: "linear-gradient(135deg,#e8192c,#f5a623)" } : undefined}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-2">What do you need?</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_MODEL.map((c) => {
                  const on = activeKeys.has(c.key);
                  return (
                    <button
                      key={c.key}
                      onClick={() => toggleCategory(c.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                        on ? "bg-navy-900 text-white border-navy-900" : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {on && <Check size={12} />}
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
            <div className="relative">
              <DonutChart items={items} total={total} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Estimated total</p>
                <motion.p key={total} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="font-display font-extrabold text-navy-900 text-lg">
                  {formatINR(total)}
                </motion.p>
              </div>
            </div>

            <div className="flex gap-2 mt-6 w-full">
              <button
                onClick={shareOnWhatsApp}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white"
                style={{ background: "#25D366" }}
              >
                <Share2 size={13} /> Share
              </button>
              <button
                onClick={copyEstimate}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-gray-300"
              >
                {copied ? <Check size={13} /> : null} {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {items.map((item, i) => (
            <div key={item.key} className="flex items-center gap-4 bg-white rounded-xl p-3.5 border border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900">{formatINR(item.amount)}</span>
              </div>
              <button
                onClick={() => goToCategory(item.slug)}
                className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-accent-300 hover:text-accent-700 transition-colors"
              >
                Find <ArrowRight size={12} />
              </button>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-sm text-gray-400 py-6">Pick at least one category above to see your estimate.</p>}
        </div>

        <div className="flex items-start gap-2 mt-6 text-[11px] text-gray-400 leading-relaxed max-w-2xl mx-auto">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          This is an estimate based on typical costs for the selected style and guest count. Actual vendor pricing varies by city, season and package — browse real quotes on {BRAND_NAME}.
        </div>
      </div>
    </section>
  );
}