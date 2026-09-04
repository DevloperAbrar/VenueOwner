import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Globe, CalendarCheck, FileText, Star,
  CheckCircle2, ArrowRight, Sparkles, Users,
  TrendingUp, Search, ShieldCheck, Zap,
  BarChart3, MessageCircle, Camera, IndianRupee,
  ChevronDown, Play
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

// ─── Intersection Observer hook for scroll animations ───────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = "", duration = 1800 }) {
  const [val, setVal]   = useState(0);
  const [ref, inView]   = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toLocaleString("en-IN")}{suffix}</span>;
}

// ─── Wave SVG breakers ───────────────────────────────────────────────────────
function WaveDown({ fill = "#7c3aed", bg = "white" }) {
  return (
    <div style={{ background: bg, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
        <path d="M0,0 C360,70 1080,70 1440,0 L1440,70 L0,70 Z" fill={fill} />
      </svg>
    </div>
  );
}
function WaveUp({ fill = "white", bg = "#7c3aed" }) {
  return (
    <div style={{ background: bg, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
        <path d="M0,70 C360,0 1080,0 1440,70 L1440,0 L0,0 Z" fill={fill} />
      </svg>
    </div>
  );
}
function ScallopUp({ fill = "white", bg = "#f5f3ff" }) {
  return (
    <div style={{ background: bg, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
        <path d="M0,60 Q60,0 120,60 Q180,0 240,60 Q300,0 360,60 Q420,0 480,60 Q540,0 600,60 Q660,0 720,60 Q780,0 840,60 Q900,0 960,60 Q1020,0 1080,60 Q1140,0 1200,60 Q1260,0 1320,60 Q1380,0 1440,60 L1440,0 L0,0 Z" fill={fill} />
      </svg>
    </div>
  );
}
function ScallopDown({ fill = "#f5f3ff", bg = "white" }) {
  return (
    <div style={{ background: bg, lineHeight: 0 }}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
        <path d="M0,0 Q60,60 120,0 Q180,60 240,0 Q300,60 360,0 Q420,60 480,0 Q540,60 600,0 Q660,60 720,0 Q780,60 840,0 Q900,60 960,0 Q1020,60 1080,0 Q1140,60 1200,0 Q1260,60 1320,0 Q1380,60 1440,0 L1440,60 L0,60 Z" fill={fill} />
      </svg>
    </div>
  );
}

// ─── Step card (process timeline) ────────────────────────────────────────────
function StepCard({ number, icon: Icon, title, desc, color, delay = 0, side = "left" }) {
  const [ref, inView] = useInView();
  const anim = inView
    ? `opacity-100 translate-x-0 translate-y-0`
    : side === "left" ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8";
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${anim}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 relative overflow-hidden group hover:shadow-lg transition-shadow">
        {/* Step number watermark */}
        <span className="absolute -top-2 -right-1 text-7xl font-black text-gray-50 select-none leading-none">
          {String(number).padStart(2, "0")}
        </span>
        {/* Icon circle */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ background: color + "18" }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <span className="text-xs font-black tracking-widest uppercase" style={{ color }}>
          Step {String(number).padStart(2, "0")}
        </span>
        <h3 className="text-lg font-display font-bold text-gray-900 mt-1 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, badge, color, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all group">
        {badge && (
          <span
            className="inline-block text-[10px] font-black tracking-widest uppercase text-white px-2 py-0.5 rounded-full mb-3"
            style={{ background: "#ea580c" }}
          >
            {badge}
          </span>
        )}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
          style={{ background: color + "15" }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <h3 className="font-display font-bold text-gray-900 mb-1.5">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Comparison table row ─────────────────────────────────────────────────────
function CompareRow({ feature, justdial, in2fest, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <tr
      ref={ref}
      className={`transition-all duration-500 border-b border-gray-100 ${inView ? "opacity-100" : "opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <td className="py-3 px-4 text-sm text-gray-700 font-medium">{feature}</td>
      <td className="py-3 px-4 text-center">
        {justdial
          ? <CheckCircle2 size={16} className="text-gray-300 mx-auto" />
          : <span className="text-gray-200 text-lg">×</span>}
      </td>
      <td className="py-3 px-4 text-center">
        {in2fest
          ? <CheckCircle2 size={16} className="text-primary-600 mx-auto" />
          : <span className="text-gray-300 text-lg">×</span>}
      </td>
    </tr>
  );
}

// ─── FAQ item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
          {a}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function ForVendorsPage() {

  const [heroRef, heroInView] = useInView(0.1);

  const STEPS = [
    {
      number: 1, icon: TrendingUp,    color: "#7c3aed", side: "left",
      title: "Register Free in 2 minutes",
      desc:  "Sign up with Google, fill your business name, city, and category. No credit card. No hidden charges. Your listing is live instantly."
    },
    {
      number: 2, icon: Globe,         color: "#ea580c", side: "right",
      title: "Get your own website",
      desc:  "Choose a professional template and customise it - add your hero image, gallery, services, and contact details. It goes live on your own branded URL."
    },
    {
      number: 3, icon: CalendarCheck, color: "#7c3aed", side: "left",
      title: "Show real-time availability",
      desc:  "Add your booking slots - morning, evening, full-day. Customers see live availability and can send inquiries directly for open dates."
    },
    {
      number: 4, icon: Star,          color: "#ea580c", side: "right",
      title: "Collect reviews & grow",
      desc:  "After every event, an automated WhatsApp message goes to your client asking for a review. More reviews = higher ranking on In2Fest search."
    },
  ];

  const FEATURES = [
    { icon: Globe,         color: "#7c3aed", badge: "Exclusive",  title: "Free Website Builder",      desc: "A full vendor website - gallery, about, services, contact - on your own branded URL. No coding needed." },
    { icon: CalendarCheck, color: "#7c3aed",                      title: "Live Booking Calendar",     desc: "Customers see your slot availability in real time. Reduce back-and-forth calls asking 'is this date free?'" },
    { icon: Search,        color: "#ea580c",                      title: "In2Fest Marketplace Listing",desc: "Show up on In2Fest search results for your city and category. Verified badge = higher trust." },
    { icon: FileText,      color: "#7c3aed", badge: "Unique",     title: "Quotation & Invoice Tool",  desc: "Generate professional PDF quotations and GST invoices for clients in one click from your dashboard." },
    { icon: MessageCircle, color: "#ea580c",                      title: "WhatsApp Inquiry Alerts",   desc: "Every inquiry from your website or listing triggers an instant WhatsApp notification to your number." },
    { icon: Star,          color: "#7c3aed",                      title: "Automated Review Requests", desc: "After an event, clients get a WhatsApp asking them to leave a review - boosting your profile automatically." },
    { icon: BarChart3,     color: "#ea580c",                      title: "Dashboard Analytics",       desc: "See inquiries, bookings, page views, and revenue all in one clean dashboard built for event vendors." },
    { icon: ShieldCheck,   color: "#7c3aed", badge: "Trusted",    title: "Verified Business Badge",   desc: "Complete your profile and get a Verified badge that appears on every search result - building immediate trust." },
  ];

  const COMPARE = [
    { feature: "Free marketplace listing",   justdial: true,  in2fest: true  },
    { feature: "Own branded website",        justdial: false, in2fest: true  },
    { feature: "Live booking calendar",      justdial: false, in2fest: true  },
    { feature: "Direct WhatsApp inquiries",  justdial: false, in2fest: true  },
    { feature: "PDF quotation & invoicing",  justdial: false, in2fest: true  },
    { feature: "Automated review requests",  justdial: false, in2fest: true  },
    { feature: "Slot availability display",  justdial: false, in2fest: true  },
    { feature: "Dashboard analytics",        justdial: false, in2fest: true  },
    { feature: "Price: free to start",       justdial: true,  in2fest: true  },
  ];

  const FAQS = [
    { q: "Is it really free?", a: "Yes. Listing your business on In2Fest and getting your own website is completely free. There are paid plans for advanced features like team members, WhatsApp automations, and custom branding - but you can grow significantly on the free plan." },
    { q: "Do I need a developer to build my website?", a: "Not at all. The website builder is a simple template editor - you fill in text fields and upload images. It takes under 10 minutes and goes live automatically at your branded URL." },
    { q: "How does the booking calendar work?", a: "You add your slots (morning, evening, full-day) from your dashboard. When a potential customer visits your profile, they see which dates are available and can send an inquiry for an open date. You confirm or decline from your dashboard." },
    { q: "How is this different from JustDial?", a: "JustDial lists you as a plain entry. In2Fest gives you a full vendor website, a live booking calendar your customers can see, direct WhatsApp inquiry routing, PDF invoicing, automated review collection, and a dashboard to manage everything - all in one platform built specifically for wedding and event vendors." },
    { q: "How do reviews work?", a: "After each booking is marked completed, In2Fest automatically sends a WhatsApp message to your client asking them to leave a review. These reviews show on your In2Fest profile and improve your search ranking." },
  ];

  const STATS = [
    { value: 20,   suffix: "+",   label: "Categories" },
    { value: 50,   suffix: "+",   label: "Cities" },
    { value: 100,  suffix: "% ",  label: "Free to start" },
    { value: 0,    suffix: "",    label: "Middlemen" },
  ];

  return (
    <>
      <Helmet>
        <title>List Your Business Free - In2Fest | Get a Website, Booking Calendar & More</title>
        <meta name="description" content="Register your wedding or event business on In2Fest for free. Get a professional website, live booking calendar, WhatsApp inquiry alerts, and PDF invoicing - all in one platform." />
      </Helmet>

      {/* ════════════════════════════════════════════════════════════
          HERO - dark purple gradient
      ════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden pt-20 pb-8"
        style={{ background: "linear-gradient(135deg,#4c1d95 0%,#7c3aed 50%,#6d28d9 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: "#ea580c" }} />
        <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full opacity-20 blur-3xl" style={{ background: "#a78bfa" }} />

        <div
          ref={heroRef}
          className={`relative max-w-5xl mx-auto px-4 text-center transition-all duration-1000 ${heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase text-white bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-6">
            <Zap size={11} className="text-yellow-300" />
            India's most complete vendor platform
          </span>

          <h1 className="font-display font-extrabold text-white leading-tight mb-5"
            style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.02em" }}>
            More than a listing -<br />
            <span style={{ color: "#fde68a" }}>a complete business tool.</span>
          </h1>

          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            List free on In2Fest and get your own <strong className="text-white">website</strong>,
            a <strong className="text-white">live booking calendar</strong>, WhatsApp inquiry alerts,
            PDF invoicing, and automated review collection -
            built for wedding and event vendors.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <a
              href={`${APP_URL}/login`}
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-primary-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ background: "#fde68a" }}
            >
              <Sparkles size={17} />
              Get Started Free
              <ArrowRight size={16} />
            </a>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              <Play size={15} />
              See How It Works
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-white/70">
            {["No credit card needed", "Live in under 10 minutes", "Free forever plan available"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-green-400" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Wave breaker */}
        <div className="mt-12" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,0 C360,70 1080,70 1440,0 L1440,70 L0,70 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          STATS BAR
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#7c3aed" }}>
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scallop breaker going into purple */}
      <ScallopDown fill="#f5f3ff" bg="white" />

      {/* ════════════════════════════════════════════════════════════
          FEATURES GRID
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#f5f3ff" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-black tracking-widest uppercase text-primary-600">Everything you need</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-gray-900 mt-2" style={{ letterSpacing: "-0.02em" }}>
              One platform. Every tool.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              No juggling between different apps. Everything a wedding and event vendor needs is here.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* Scallop back to white */}
      <ScallopUp fill="white" bg="#f5f3ff" />

      {/* ════════════════════════════════════════════════════════════
          HOW IT WORKS - timeline steps
      ════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="text-xs font-black tracking-widest uppercase text-primary-600">Process</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-gray-900 mt-2" style={{ letterSpacing: "-0.02em" }}>
              From signup to bookings<br />in four steps
            </h2>
          </div>

          {/* Vertical timeline */}
          <div className="relative">
            {/* Center line */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
              style={{ background: "linear-gradient(to bottom,#7c3aed,#ea580c,#7c3aed,#ea580c)" }}
            />

            <div className="space-y-10">
              {STEPS.map((s, i) => (
                <div key={s.number} className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  {/* Content - alternates left/right */}
                  {s.side === "left" ? (
                    <>
                      <StepCard {...s} delay={0} />
                      {/* Dot */}
                      <div className="hidden md:flex items-center justify-start">
                        <div
                          className="w-5 h-5 rounded-full border-4 border-white shadow-md -ml-[2.6rem]"
                          style={{ background: s.color }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Dot + empty left */}
                      <div className="hidden md:flex items-center justify-end">
                        <div
                          className="w-5 h-5 rounded-full border-4 border-white shadow-md -mr-[2.6rem]"
                          style={{ background: s.color }}
                        />
                      </div>
                      <StepCard {...s} delay={0} />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Wave into dark section */}
      <div style={{ background: "white", lineHeight: 0 }}>
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
          <path d="M0,70 C360,0 1080,0 1440,70 L1440,0 L0,0 Z" fill="#0f172a" />
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════════
          COMPARISON TABLE - dark navy bg
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#0f172a" }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-primary-400">Why us</span>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white mt-2" style={{ letterSpacing: "-0.02em" }}>
              In2Fest vs Just a listing site
            </h2>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-left font-semibold text-gray-300 w-1/2">Feature</th>
                  <th className="py-4 px-4 text-center font-semibold text-gray-400">JustDial</th>
                  <th className="py-4 px-4 text-center font-bold" style={{ color: "#a78bfa" }}>In2Fest</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r, i) => (
                  <tr key={r.feature} className="border-b border-white/5">
                    <td className="py-3 px-4 text-sm text-gray-300 font-medium">{r.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {r.justdial
                        ? <CheckCircle2 size={16} className="text-gray-500 mx-auto" />
                        : <span className="text-gray-700 font-bold text-base">×</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.in2fest
                        ? <CheckCircle2 size={16} className="mx-auto" style={{ color: "#a78bfa" }} />
                        : <span className="text-gray-600 font-bold text-base">×</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Wave out of dark */}
      <div style={{ background: "#0f172a", lineHeight: 0 }}>
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
          <path d="M0,0 C360,70 1080,70 1440,0 L1440,70 L0,70 Z" fill="white" />
        </svg>
      </div>

      {/* ════════════════════════════════════════════════════════════
          TESTIMONIALS / SOCIAL PROOF
      ════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-xs font-black tracking-widest uppercase text-primary-600">Vendors love it</span>
            <h2 className="font-display font-extrabold text-3xl text-gray-900 mt-2">What our vendors say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Ramesh Patel", cat: "Wedding Photographer, Indore", quote: "I got my first website in 15 minutes. Clients now book me directly - no middleman cutting into my fees." },
              { name: "Sunita Sharma", cat: "Banquet Hall Owner, Bhopal", quote: "The slot calendar is a game changer. Customers can see which dates are free without calling me 20 times." },
              { name: "Arjun Mehta", cat: "Wedding Decorator, Indore", quote: "The invoice tool alone saved me hours every week. Professional PDFs with one click - exactly what I needed." },
            ].map((t, i) => {
              const [ref, inView] = useInView();
              return (
                <div
                  key={t.name} ref={ref}
                  className={`bg-primary-50 border border-primary-100 rounded-2xl p-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.cat}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scallop break */}
      <ScallopDown fill="#f5f3ff" bg="white" />

      {/* ════════════════════════════════════════════════════════════
          FAQ
      ════════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#f5f3ff" }}>
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-xs font-black tracking-widest uppercase text-primary-600">FAQ</span>
            <h2 className="font-display font-extrabold text-3xl text-gray-900 mt-2">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* Scallop back to purple CTA */}
      <ScallopUp fill="#7c3aed" bg="#f5f3ff" />

      {/* ════════════════════════════════════════════════════════════
          FINAL CTA - purple
      ════════════════════════════════════════════════════════════ */}
      <section
        className="py-20 text-center"
        style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <Sparkles size={36} className="text-yellow-300 mx-auto mb-5" />
          <h2 className="font-display font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", letterSpacing: "-0.02em" }}>
            Your customers are searching.<br />
            <span style={{ color: "#fde68a" }}>Be there - for free.</span>
          </h2>
          <p className="text-white/75 text-base mb-8 max-w-md mx-auto">
            Join hundreds of wedding and event vendors on In2Fest.
            Get listed, get a website, and start getting bookings today.
          </p>
          <a
            href={`${APP_URL}/login`}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-black text-primary-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            style={{ background: "#fde68a" }}
          >
            <Sparkles size={17} />
            Register Free Now
            <ArrowRight size={16} />
          </a>
          <p className="text-white/50 text-xs mt-4">No credit card. No setup fee. Live in minutes.</p>
        </div>

        {/* Wave bottom */}
        <div className="mt-16" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block">
            <path d="M0,0 C360,50 1080,50 1440,0 L1440,50 L0,50 Z" fill="white" />
          </svg>
        </div>
      </section>
    </>
  );
}