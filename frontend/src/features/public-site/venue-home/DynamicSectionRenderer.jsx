import React from "react";
import { ChevronDown } from "lucide-react";
import SectionDivider from "../../../components/common/SectionDivider.jsx";
import { useScrollReveal } from "../../../hooks/useScrollReveal";

const TONES = {
  light: { bg: "bg-white dark:bg-gray-950", hex: "#ffffff" },
  tint: { bg: "bg-gray-50 dark:bg-gray-900", hex: "#f9fafb" }
};

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionShell({ title, tone = "light", dividerVariant = "wave", children }) {
  const cfg = TONES[tone] || TONES.light;
  return (
    <section className={`relative ${cfg.bg} transition-colors`}>
      <SectionDivider variant={dividerVariant} position="top" color={cfg.hex} />
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <Reveal className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
          <div className="w-16 h-1.5 rounded-full bg-gray-900/10 dark:bg-white/10 mx-auto mt-4" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function Portfolio({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {items.map((it, idx) => (
          <Reveal key={it.id} delay={idx * 80}>
            <div className="relative rounded-2xl overflow-hidden group aspect-square bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-2xl transition-shadow duration-300">
              {it.image_url && (
                <img
                  src={it.image_url}
                  alt={it.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  {it.tag && (
                    <span
                      className="inline-block text-[10px] font-semibold text-white uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
                      style={{ backgroundColor: theme }}
                    >
                      {it.tag}
                    </span>
                  )}
                  {it.title && <p className="text-white font-semibold text-sm">{it.title}</p>}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function Packages({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it, idx) => {
          const featured = it.tag?.toLowerCase().includes("popular");
          return (
            <Reveal key={it.id} delay={idx * 100}>
              <div
                className={`h-full rounded-2xl p-7 relative border transition-all duration-300 hover:-translate-y-2 ${
                  featured
                    ? "bg-white dark:bg-gray-900 border-transparent shadow-2xl md:scale-105"
                    : "bg-white/70 dark:bg-gray-900/60 backdrop-blur border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl"
                }`}
                style={featured ? { boxShadow: `0 20px 40px -12px ${theme}33` } : undefined}
              >
                {it.tag && (
                  <span
                    className="absolute -top-3 left-7 text-[10px] font-semibold text-white px-3 py-1 rounded-full shadow"
                    style={{ backgroundColor: theme }}
                  >
                    {it.tag}
                  </span>
                )}
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 mt-2">{it.title}</h3>
                {it.price && (
                  <p className="text-3xl font-extrabold mb-4" style={{ color: theme }}>
                    {it.price}
                  </p>
                )}
                {it.description && (
                  <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    {it.description.split("\n").filter(Boolean).map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: theme }} />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}

function Process({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
        <div className="hidden md:block absolute top-5 left-0 right-0 h-px bg-gray-200 dark:bg-gray-800" />
        {items.map((it, idx) => (
          <Reveal key={it.id} delay={idx * 100} className="text-center relative">
            <div
              className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg"
              style={{ backgroundColor: theme }}
            >
              {idx + 1}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{it.title}</h3>
            {it.description && <p className="text-sm text-gray-500 dark:text-gray-400">{it.description}</p>}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function FAQItem({ item, theme }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-gray-100 dark:border-gray-800 py-5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left gap-4">
        <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
        <ChevronDown
          size={18}
          style={{ color: open ? theme : undefined }}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function Faq({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="max-w-2xl mx-auto">
        {items.map((it) => (
          <FAQItem key={it.id} item={it} theme={theme} />
        ))}
      </div>
    </SectionShell>
  );
}

function ProductCatalog({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((it, idx) => (
          <Reveal key={it.id} delay={idx * 80}>
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {it.image_url && (
                <div className="overflow-hidden">
                  <img src={it.image_url} alt={it.title} className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{it.title}</h3>
                {it.price && <p className="font-bold mt-1" style={{ color: theme }}>{it.price}</p>}
                {it.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{it.description}</p>}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function Team({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((it, idx) => (
          <Reveal key={it.id} delay={idx * 90} className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-950" style={{ "--tw-ring-color": `${theme}40` }}>
              {it.image_url && <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />}
            </div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{it.title}</p>
            {it.subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{it.subtitle}</p>}
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

function Occasions({ config, theme, tone }) {
  const items = config?.items || [];
  if (items.length === 0) return null;
  return (
    <SectionShell title={config.title} tone={tone}>
      <div className="flex flex-wrap justify-center gap-3">
        {items.map((it, idx) => (
          <Reveal key={it.id} delay={idx * 60}>
            <span
              className="px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-colors duration-300 cursor-default hover:text-white"
              style={{ borderColor: theme, color: theme }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {it.title}
            </span>
          </Reveal>
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

export default function DynamicSectionRenderer({ type, config, venue, index = 0 }) {
  const Renderer = RENDERERS[type];
  if (!Renderer || !config) return null;
  const tone = index % 2 === 0 ? "light" : "tint";
  return <Renderer config={config} theme={venue.theme_color || "#7c3aed"} tone={tone} />;
}