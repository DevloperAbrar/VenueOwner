import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "../../lib/constants";
import { metaApi } from "../../lib/api";

// Groups the live category list into themed collections for display.
// Anything that doesn't match a known keyword automatically falls into
// "More Services" — so this keeps working when super admin adds a 21st,
// 27th or 40th category without touching this file.
const GROUPS = [
  { title: "Venues & Celebration Spaces", keywords: ["marriage-hall", "banquet-hall", "party-lawn", "farmhouse", "tent-house"] },
  { title: "Photography & Films",         keywords: ["photographer", "videographer"] },
  { title: "Décor & Production",          keywords: ["decorator", "sound-lighting", "card-printing"] },
  { title: "Beauty & Styling",            keywords: ["makeup-artist", "mehendi-artist", "mehndi"] },
  { title: "Food & Entertainment",        keywords: ["caterer", "dj", "singer", "music"] },
  { title: "Rituals & Traditions",        keywords: ["pandit", "horse-buggy"] },
  { title: "Planning & Logistics",        keywords: ["event-manager", "wedding-planner", "travel-transport"] }
];

function groupCategories(categories) {
  const used = new Set();
  const groups = GROUPS.map((g) => {
    const items = categories.filter((c) => g.keywords.some((k) => c.slug.includes(k)) && !used.has(c.slug));
    items.forEach((c) => used.add(c.slug));
    return { title: g.title, items };
  }).filter((g) => g.items.length > 0);

  const leftover = categories.filter((c) => !used.has(c.slug));
  if (leftover.length > 0) groups.push({ title: "More Services", items: leftover });

  return groups;
}

function categoryImage(slug) {
  try { return new URL(`../../assets/categories/${slug}.jpg`, import.meta.url).href; } catch { return null; }
}

function resolveIcon(name) {
  if (!name) return Icons.Sparkles;
  const pascal = name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
  return Icons[pascal] || Icons.Sparkles;
}

function CategoryTile({ cat }) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = categoryImage(cat.slug);
  const Icon = resolveIcon(cat.icon);

  return (
    <Link
      to={`/search?category=${cat.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
    >
      <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-gradient-to-br from-navy-50 to-navy-100">
        {src && !imgFailed ? (
          <img
            src={src}
            alt={cat.label}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon size={26} style={{ color: "#9aa0b8" }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
      </div>
      <span className="absolute bottom-2 left-2.5 right-2.5 text-xs sm:text-[13px] font-semibold text-white leading-tight drop-shadow">
        {cat.label}
      </span>
    </Link>
  );
}

function GroupPanel({ group, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-sm text-navy-900">{group.title}</h3>
        <ArrowUpRight size={15} className="text-gray-300" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {group.items.slice(0, 6).map((cat) => (
          <CategoryTile key={cat.slug} cat={cat} />
        ))}
      </div>
    </motion.div>
  );
}

export default function CategoriesShowcase() {
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    metaApi
      .get("/categories")
      .then(({ data }) => {
        const live = (data?.data || []).map((c) => ({ slug: c.slug, label: c.name, icon: c.icon }));
        if (live.length > 0) setCategories(live);
      })
      .catch(() => {}); // keep the local fallback list on failure
  }, []);

  const groups = useMemo(() => groupCategories(categories), [categories]);

  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-2 inline-block px-3 py-1 rounded-full"
              style={{ color: "#e8192c", background: "#e8192c0d" }}
            >
              Browse Categories
            </p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-navy-900">
              Everything your event needs, in one place
            </h2>
          </div>
          <Link to="/categories" className="flex items-center gap-1 text-sm font-semibold hover:underline flex-shrink-0" style={{ color: "#e8192c" }}>
            View all categories <ArrowRight size={14} />
          </Link>
        </div>
        <p className="text-gray-500 text-sm md:text-base max-w-xl mb-8">
          {categories.length}+ vendor categories, from the marriage hall to the last mehndi cone — grouped so you never have to guess where to start.
        </p>

        {/* Quick browse strip */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 -mx-4 px-4 no-scrollbar">
          {categories.map((cat) => {
            const Icon = resolveIcon(cat.icon);
            return (
              <Link
                key={cat.slug}
                to={`/search?category=${cat.slug}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:border-accent-300 hover:text-accent-600 hover:bg-accent-50 transition-colors whitespace-nowrap"
              >
                <Icon size={13} /> {cat.label}
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, i) => (
            <GroupPanel key={g.title} group={g} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}