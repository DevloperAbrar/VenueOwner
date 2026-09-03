import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

function SectionShell({ title, theme, children }) {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Portfolio({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="relative rounded-xl overflow-hidden group aspect-square bg-gray-100 dark:bg-gray-800">
            {it.image_url && (
              <img src={it.image_url} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
              <div>
                {it.tag && <span className="text-[10px] text-white/80 uppercase tracking-wide">{it.tag}</span>}
                {it.title && <p className="text-white font-medium text-sm">{it.title}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Packages({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 relative bg-white dark:bg-gray-900 shadow-sm">
            {it.tag && (
              <span
                className="absolute -top-3 left-6 text-[10px] font-semibold text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: theme }}
              >
                {it.tag}
              </span>
            )}
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">{it.title}</h3>
            {it.price && <p className="text-2xl font-bold mb-3" style={{ color: theme }}>{it.price}</p>}
            {it.description && (
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                {it.description.split("\n").filter(Boolean).map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Process({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {items.map((it, idx) => (
          <div key={it.id} className="text-center">
            <div
              className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: theme }}
            >
              {idx + 1}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{it.title}</h3>
            {it.description && <p className="text-sm text-gray-500 dark:text-gray-400">{it.description}</p>}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left">
        <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && item.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{item.description}</p>
      )}
    </div>
  );
}

function Faq({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="max-w-2xl mx-auto">
        {items.map((it) => <FAQItem key={it.id} item={it} />)}
      </div>
    </SectionShell>
  );
}

function ProductCatalog({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.id} className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
            {it.image_url && <img src={it.image_url} alt={it.title} className="w-full h-36 object-cover" />}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{it.title}</h3>
              {it.price && <p className="font-bold mt-1" style={{ color: theme }}>{it.price}</p>}
              {it.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{it.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Team({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.id} className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gray-100 dark:bg-gray-800">
              {it.image_url && <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />}
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{it.title}</p>
            {it.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{it.subtitle}</p>}
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function Occasions({ config, theme }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} theme={theme}>
      <div className="flex flex-wrap justify-center gap-3">
        {items.map((it) => (
          <span
            key={it.id}
            className="px-4 py-2 rounded-full text-sm font-medium border"
            style={{ borderColor: theme, color: theme }}
          >
            {it.title}
          </span>
        ))}
      </div>
    </SectionShell>
  );
}

const RENDERERS = {
  portfolio: Portfolio,
  packages: Packages,
  process: Process,
  faq: Faq,
  product_catalog: ProductCatalog,
  team: Team,
  occasions: Occasions
};

export default function DynamicSectionRenderer({ type, config, venue }) {
  const Renderer = RENDERERS[type];
  if (!Renderer || !config) return null;
  return <Renderer config={config} theme={venue.theme_color || "#7c3aed"} />;
}