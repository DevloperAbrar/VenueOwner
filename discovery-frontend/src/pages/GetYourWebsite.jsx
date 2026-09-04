import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, CalendarCheck, MessageCircle, Image as ImageIcon,
  BarChart3, Smartphone, CheckCircle2, XCircle, ArrowRight,
  Globe, Star, ShieldCheck
} from "lucide-react";

const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5173";

const FEATURES = [
  {
    icon: Globe,
    title: "Your Own Branded Website",
    desc: "A dedicated, mobile-friendly website for your business - not just a listing buried in a directory. Custom URL, your name, your gallery, your story.",
  },
  {
    icon: CalendarCheck,
    title: "Live Availability Calendar",
    desc: "Show real-time open and booked dates. Customers see exactly when you're free - no repeated 'is this date available?' calls.",
  },
  {
    icon: MessageCircle,
    title: "Direct Booking & Inquiries",
    desc: "Leads land straight in your WhatsApp or dashboard. Zero commission, zero middlemen taking a cut of your bookings.",
  },
  {
    icon: ImageIcon,
    title: "Service & Package Showcase",
    desc: "Display your services, packages and pricing tiers clearly, with photos and videos that do the selling for you.",
  },
  {
    icon: Star,
    title: "Reviews Built In",
    desc: "Genuine customer reviews shown right on your website, building trust before the first conversation even happens.",
  },
  {
    icon: BarChart3,
    title: "Insights Dashboard",
    desc: "Track profile views, inquiries and booking trends so you know exactly what's working.",
  },
];

const COMPARISON = [
  { label: "Dedicated website with your own branding", us: true, them: false },
  { label: "Live booking calendar customers can see", us: true, them: false },
  { label: "Direct WhatsApp / call leads, zero commission", us: true, them: false },
  { label: "Service & package showcase with pricing", us: true, them: false },
  { label: "Just a listing entry in a crowded directory", us: false, them: true },
  { label: "Booking insights & analytics dashboard", us: true, them: false },
];

const STEPS = [
  {
    n: "01",
    title: "Tell us about your business",
    desc: "Quick onboarding - your services, packages, photos and availability.",
  },
  {
    n: "02",
    title: "We build your website",
    desc: "A professional, ready-to-use website goes live under your brand.",
  },
  {
    n: "03",
    title: "Start getting direct bookings",
    desc: "Customers browse, check your calendar and reach out - straight to you.",
  },
];

export default function GetYourWebsite() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a2035 0%,#2d3a5e 60%,#1a2035 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 pt-20 pb-24 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-white bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm mb-6">
            <Sparkles size={12} style={{ color: "#f5a623" }} />
            Not just a listing. A website that books for you.
          </span>
          <h1
            className="font-display font-extrabold text-white mb-5 leading-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", letterSpacing: "-0.02em" }}
          >
            Get a professional website<br className="hidden md:block" />
            built just for <span style={{ color: "#f5a623" }}>your business</span>
          </h1>
          <p className="text-white/75 text-sm md:text-base max-w-2xl mx-auto mb-9 leading-relaxed">
            Directory sites bury you in a list. We give every vendor their own
            dedicated website - with live availability, direct bookings and zero
            commission on every lead.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            <a  href={`${APP_URL}/login`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#e8192c,#f5a623)" }}
            >
              Get My Website <ArrowRight size={15} />
            </a>
            <Link
              to="/search"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white border border-white/25 hover:bg-white/10 transition-colors"
            >
              See Vendor Examples
            </Link>
          </div>
        </div>

        {/* Wave separator */}
        <div style={{ lineHeight: 0, marginTop: -2 }}>
          <svg viewBox="0 0 1440 40" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-10">
            <path d="M0,0 C480,40 960,40 1440,0 L1440,40 L0,40 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#e8192c" }}>
            Everything included
          </p>
          <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl">
            Built to turn visitors into bookings
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "#e8192c12" }}
              >
                <Icon size={20} style={{ color: "#e8192c" }} />
              </div>
              <h3 className="font-semibold text-navy-900 text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison strip ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#e8192c" }}>
              Why it's different
            </p>
            <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl">
              A website, not just another entry in a list
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 text-xs md:text-sm font-semibold text-center bg-navy-900" style={{ background: "#1a2035" }}>
              <div className="py-3.5 text-left pl-4 md:pl-6 text-white/80">Feature</div>
              <div className="py-3.5 text-white">In2Fest</div>
              <div className="py-3.5 text-white/60">Directory Listings</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 items-center text-xs md:text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}
              >
                <div className="py-3.5 pl-4 md:pl-6 pr-2 text-gray-700">{row.label}</div>
                <div className="py-3.5 flex justify-center">
                  {row.us
                    ? <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
                    : <XCircle size={18} className="text-gray-300" />}
                </div>
                <div className="py-3.5 flex justify-center">
                  {row.them
                    ? <CheckCircle2 size={18} style={{ color: "#16a34a" }} />
                    : <XCircle size={18} className="text-gray-300" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "#e8192c" }}>
            How it works
          </p>
          <h2 className="font-display font-extrabold text-navy-900 text-2xl md:text-3xl">
            Live in three simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <span
                className="text-3xl font-display font-extrabold block mb-3"
                style={{ color: "#e8192c22" }}
              >
                {n}
              </span>
              <h3 className="font-semibold text-navy-900 text-sm mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust row ── */}
      <section className="max-w-4xl mx-auto px-4 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: ShieldCheck, text: "Verified vendor profiles" },
            { icon: Smartphone, text: "Fully mobile optimized" },
            { icon: MessageCircle, text: "Zero commission on leads" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
              <Icon size={15} style={{ color: "#e8192c" }} />
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="max-w-5xl mx-auto px-4 pb-20 pt-6">
        <div
          className="rounded-3xl px-6 py-14 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#e8192c,#f5a623)" }}
        >
          <h2 className="font-display font-extrabold text-white text-2xl md:text-3xl mb-3">
            Ready to stand out from every other listing?
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-xl mx-auto mb-8">
            Get your own professional website with live booking, in minutes.
          </p>
          
         <a   href={`${APP_URL}/login`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold bg-white transition-opacity hover:opacity-90"
            style={{ color: "#e8192c" }}
          >
            Get My Website <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}