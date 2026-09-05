import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import resolveCategoryIcon from "./categoryIcon";
import useCategories from "./useCategories";

/**
 * Horizontal, scrollable "quick pick" strip of every live category
 * (super-admin managed, via useCategories). One click sets/clears the
 * `category` filter - the same pattern JustDial/Sulekha use above their
 * result grids so people don't have to open the sidebar for the single
 * most common filter.
 */
export default function CategoryChipStrip({ activeSlug, onSelect }) {
  const scrollerRef = useRef(null);
  const { categories, loading } = useCategories();

  const scrollBy = (dx) => scrollerRef.current?.scrollBy({ left: dx, behavior: "smooth" });

  if (loading && categories.length === 0) {
    return (
      <div className="flex gap-2 px-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 w-28 flex-shrink-0 rounded-full bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group/strip">
      {/* Left/right scroll nudges - desktop only, hidden on touch widths */}
      <button
        type="button"
        onClick={() => scrollBy(-240)}
        aria-label="Scroll categories left"
        className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-navy-600 opacity-0 group-hover/strip:opacity-100 transition-opacity"
      >
        <ChevronLeft size={14} />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(240)}
        aria-label="Scroll categories right"
        className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-navy-600 opacity-0 group-hover/strip:opacity-100 transition-opacity"
      >
        <ChevronRight size={14} />
      </button>

      <div
        ref={scrollerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
      >
        <motion.button
          type="button"
          onClick={() => onSelect("")}
          whileTap={{ scale: 0.95 }}
          className={[
            "flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap",
            !activeSlug
              ? "text-white border-transparent shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-accent-300 hover:text-accent-600 hover:bg-accent-50",
          ].join(" ")}
          style={!activeSlug ? { background: "linear-gradient(135deg,#e8192c,#f5a623)" } : undefined}
        >
          <LayoutGrid size={13} /> All Categories
        </motion.button>

        {categories.map((cat) => {
          const Icon = resolveCategoryIcon(cat.icon);
          const active = activeSlug === cat.slug;
          return (
            <motion.button
              key={cat.slug}
              type="button"
              onClick={() => onSelect(active ? "" : cat.slug)}
              whileTap={{ scale: 0.95 }}
              className={[
                "flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap",
                active
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-accent-300 hover:text-accent-600 hover:bg-accent-50",
              ].join(" ")}
              style={active ? { background: "linear-gradient(135deg,#e8192c,#f5a623)" } : undefined}
            >
              <Icon size={13} /> {cat.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}