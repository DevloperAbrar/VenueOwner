import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileCheck2, BadgeCheck, MessageCircle, Star } from "lucide-react";
import { BRAND_NAME } from "../../lib/constants";

function stepImage(name) {
  try { return new URL(`../../assets/trust/${name}.jpg`, import.meta.url).href; } catch { return null; }
}

const STEPS = [
  {
    icon: ShieldCheck,
    title: "Business verified",
    desc: "Every vendor submits business proof before they're allowed to go live on search.",
    image: "verified-business"
  },
  {
    icon: FileCheck2,
    title: "Documents cross-checked",
    desc: "Our team manually reviews ID, address and category-specific documents — not a bot, a person.",
    image: "document-check"
  },
  {
    icon: BadgeCheck,
    title: "Profile approved",
    desc: "Only after both checks pass does a profile get the verified badge you see on search results.",
    image: "profile-approved"
  }
];

const EXTRA = [
  { icon: MessageCircle, text: "Message vendors directly on WhatsApp — no commission, no middleman." },
  { icon: Star,          text: "Ratings come only from real, completed bookings — never paid placements." }
];

function StepImage({ name, alt }) {
  const [failed, setFailed] = useState(false);
  const src = stepImage(name);
  if (!src || failed) {
    return <div className="h-40 w-full rounded-xl bg-gradient-to-br from-navy-50 to-accent-50" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-40 w-full rounded-xl object-cover"
    />
  );
}

export default function TrustVerification() {
  return (
    <section className="py-14 md:py-20" style={{ background: "#f8f9fb" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p
            className="inline-block text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: "#e8192c", background: "#e8192c0d" }}
          >
            How verification works
          </p>
          <h2 className="font-display font-extrabold text-navy-900" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)" }}>
            Every vendor here is checked, not just listed
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto mt-3">
            {BRAND_NAME} doesn't accept a phone number and a photo. Every profile goes through the same three-step review before it's searchable.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-14">
          <div className="hidden md:block absolute top-[92px] left-[16.5%] right-[16.5%] h-[2px] bg-gray-200 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
              style={{ transformOrigin: "left", background: "linear-gradient(90deg,#e8192c,#f5a623)" }}
              className="h-full w-full"
            />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "#1a2035" }}
                >
                  {i + 1}
                </span>
                <step.icon size={20} style={{ color: "#e8192c" }} />
              </div>
              <StepImage name={step.image} alt={step.title} />
              <h3 className="font-display font-bold text-navy-900 mt-4 mb-1.5">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {EXTRA.map((e) => (
            <div key={e.text} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4">
              <e.icon size={18} style={{ color: "#f5a623" }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}