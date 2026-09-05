import React, { useState, useRef, useEffect, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const TESTIMONIALS = [
  {
    name: "Priya & Rohan",
    role: "Booked their wedding hall & catering",
    city: "Indore",
    quote: "We compared three halls and booked catering, all without a single confusing phone call. Seeing the actual calendar before deciding made this so much easier.",
    rating: 5,
  },
  {
    name: "Ankit Sharma",
    role: "Decorator, Early Vendor Partner",
    city: "Indore",
    quote: "My own website went live in a day. Inquiries now come straight to my dashboard instead of missed calls.",
    rating: 5,
  },
  {
    name: "Meera Joshi",
    role: "Booked photography & makeup",
    city: "Bhopal",
    quote: "Being able to see real packages and pricing upfront saved us so many awkward negotiation calls.",
    rating: 5,
  },
  {
    name: "Sunita & Vikram",
    role: "Booked full wedding package",
    city: "Indore",
    quote: "From hall to mehndi artist — we found everything on one platform. The vendor verification badge gave us confidence to book without second-guessing.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Photographer, Vendor Partner",
    city: "Bhopal",
    quote: "The free website feature brought me 3 new inquiries within the first week. I didn't have to spend anything to get started.",
    rating: 5,
  },
  {
    name: "Kavita & Suresh",
    role: "Booked banquet hall & DJ",
    city: "Ujjain",
    quote: "Direct WhatsApp contact meant no middleman drama. We got a quote in minutes and confirmed the booking the same evening.",
    rating: 5,
  },
  {
    name: "Deepak Events",
    role: "Event Manager, Vendor Partner",
    city: "Indore",
    quote: "Having a live booking calendar visible to clients has completely changed how I manage my schedule. Zero double bookings since joining.",
    rating: 5,
  },
  {
    name: "Nisha & Amit",
    role: "Booked photographer & caterer",
    city: "Jabalpur",
    quote: "The reviews on each vendor profile are from real bookings — that's what sold us. No fake ratings, just honest feedback.",
    rating: 5,
  },
];

const SHOW_SECTION = true;

/* ── Floating sparkle particles ── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 2,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  opacity: Math.random() * 0.18 + 0.06,
  duration: Math.random() * 6 + 5,
  delay: Math.random() * 4,
}));

/* ── Single testimonial card ── */
function TestimonialCard({ t, isActive }) {
  return (
    <motion.div
      layout
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        border: isActive ? "1.5px solid rgba(232,25,44,0.18)" : "1px solid #f0f0f5",
        boxShadow: isActive
          ? "0 16px 48px rgba(232,25,44,0.08), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 12px rgba(0,0,0,0.04)",
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s, border 0.3s",
      }}
    >
      {/* Accent blob top-right */}
      <div style={{
        position: "absolute", top: "-30px", right: "-30px",
        width: "100px", height: "100px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,25,44,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Quote icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: "14px" }}
      >
        <Quote size={24} style={{ color: "rgba(232,25,44,0.2)" }} />
      </motion.div>

      {/* Stars */}
      <div style={{ display: "flex", gap: "3px", marginBottom: "12px" }}>
        {Array.from({ length: t.rating }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <Star size={13} fill="#f5a623" style={{ color: "#f5a623" }} />
          </motion.div>
        ))}
      </div>

      {/* Quote text */}
      <p style={{
        fontSize: "0.875rem", color: "#374151",
        lineHeight: 1.7, flex: 1, marginBottom: "20px",
        fontStyle: "italic",
      }}>
        "{t.quote}"
      </p>

      {/* Author */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        paddingTop: "16px", borderTop: "1px solid #f5f5fa",
      }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg, #1a2035, #2a3151)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "0.75rem", fontWeight: 700,
          boxShadow: "0 2px 8px rgba(26,32,53,0.25)",
        }}>
          {t.name[0]}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0a0e1e", margin: 0, lineHeight: 1.2 }}>
            {t.name}
          </p>
          <p style={{ fontSize: "0.7rem", color: "#9ca3af", margin: "2px 0 0", lineHeight: 1.3 }}>
            {t.role} · {t.city}
          </p>
        </div>

        {/* Verified chip */}
        <div style={{
          marginLeft: "auto", flexShrink: 0,
          background: "rgba(232,25,44,0.06)",
          border: "1px solid rgba(232,25,44,0.15)",
          borderRadius: "999px", padding: "3px 8px",
          fontSize: "0.6rem", fontWeight: 700,
          color: "#e8192c", letterSpacing: "0.04em",
          whiteSpace: "nowrap",
        }}>
          ✓ Verified
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  if (!SHOW_SECTION || TESTIMONIALS.length === 0) return null;

  const [active, setActive]   = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const dragStart = useRef(null);
  const VISIBLE = 3; // cards visible at once on desktop

  const total = TESTIMONIALS.length;
  const maxIndex = total - VISIBLE;

  const prev = useCallback(() => setActive((a) => Math.max(0, a - 1)), []);
  const next = useCallback(() => setActive((a) => Math.min(maxIndex, a + 1)), [maxIndex]);

  /* ── Auto-advance ── */
  useEffect(() => {
    const t = setInterval(() => {
      setActive((a) => (a >= maxIndex ? 0 : a + 1));
    }, 4500);
    return () => clearInterval(t);
  }, [maxIndex]);

  /* ── Drag / swipe support ── */
  const handlePointerDown = (e) => {
    dragStart.current = e.clientX ?? e.touches?.[0]?.clientX;
    setDragging(false);
  };
  const handlePointerMove = (e) => {
    if (dragStart.current === null) return;
    const dx = (e.clientX ?? e.touches?.[0]?.clientX) - dragStart.current;
    if (Math.abs(dx) > 6) setDragging(true);
  };
  const handlePointerUp = (e) => {
    if (dragStart.current === null) return;
    const dx = (e.clientX ?? e.changedTouches?.[0]?.clientX) - dragStart.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    dragStart.current = null;
    setTimeout(() => setDragging(false), 50);
  };

  return (
    <section style={{ background: "#fff6ea", position: "relative", overflow: "hidden", padding: "72px 0 80px" }}>

      {/* ── Soft blobs ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 55% 45% at 10% 50%, rgba(232,25,44,0.05) 0%, transparent 70%)," +
          "radial-gradient(ellipse 45% 40% at 90% 30%, rgba(245,166,35,0.06) 0%, transparent 70%)",
      }} />

      {/* ── Floating particles ── */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          aria-hidden
          style={{
            position: "absolute", borderRadius: "50%",
            width: p.size, height: p.size,
            top: p.top, left: p.left,
            background: "#e8192c", opacity: p.opacity,
            pointerEvents: "none",
          }}
          animate={{ y: [0, -16, 0], opacity: [p.opacity, p.opacity * 2.2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px", position: "relative" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <span style={{
            display: "inline-block",
            color: "#e8192c", background: "rgba(232,25,44,0.08)",
            border: "1px solid rgba(232,25,44,0.18)",
            borderRadius: "999px", padding: "4px 14px",
            fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "14px",
          }}>
            Real Stories
          </span>

          <h2 style={{
            color: "#0a0e1e", fontWeight: 800, margin: "0 0 10px",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            letterSpacing: "-0.02em", lineHeight: 1.15,
          }}>
            What people are saying
          </h2>

          <p style={{ color: "#6b7280", fontSize: "0.88rem", margin: 0 }}>
            From real couples and vendors — every review is from a verified booking.
          </p>
        </motion.div>

        {/* ── Carousel track ── */}
        <div
          ref={trackRef}
          style={{ overflow: "hidden", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <motion.div
            animate={{ x: `calc(-${active * (100 / VISIBLE)}% - ${active * 16 / VISIBLE}px)` }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            style={{ display: "flex", gap: "16px" }}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                style={{
                  flexShrink: 0,
                  width: `calc(${100 / VISIBLE}% - ${(VISIBLE - 1) * 16 / VISIBLE}px)`,
                }}
                animate={{
                  scale: i >= active && i < active + VISIBLE ? 1 : 0.94,
                  opacity: i >= active && i < active + VISIBLE ? 1 : 0.45,
                }}
                transition={{ duration: 0.35 }}
              >
                <TestimonialCard t={t} isActive={i === active} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Controls row ── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "center", gap: "16px", marginTop: "36px",
        }}>
          {/* Prev */}
          <button
            onClick={prev}
            disabled={active === 0}
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              border: active === 0 ? "1.5px solid #e0e0e8" : "1.5px solid #e8192c",
              background: active === 0 ? "#fff" : "#e8192c",
              color: active === 0 ? "#ccc" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: active === 0 ? "default" : "pointer",
              transition: "all 0.18s ease", flexShrink: 0,
            }}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                animate={{
                  width: i === active ? 22 : 7,
                  background: i === active ? "#e8192c" : "#d1d5db",
                }}
                transition={{ duration: 0.28 }}
                style={{
                  height: "7px", borderRadius: "999px",
                  border: "none", cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            disabled={active === maxIndex}
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              border: active === maxIndex ? "1.5px solid #e0e0e8" : "1.5px solid #e8192c",
              background: active === maxIndex ? "#fff" : "#e8192c",
              color: active === maxIndex ? "#ccc" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: active === maxIndex ? "default" : "pointer",
              transition: "all 0.18s ease", flexShrink: 0,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* ── Summary stats bar ── */}


      </div>
    </section>
  );
}