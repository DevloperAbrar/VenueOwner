import React from "react";
import { ShieldCheck, MessageCircle, Users } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck,   title: "Verified vendors",              desc: "Every listed business is reviewed before it goes live on search." },
  { icon: MessageCircle, title: "Direct contact, no middleman",  desc: "Message vendors on WhatsApp directly — no commission, no runaround." },
  { icon: Users,         title: "Real customer reviews",         desc: "Ratings come from actual completed bookings, not paid placements." },
];

export default function WhyUs() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="p-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "#fdecec" }}>
              <Icon size={22} style={{ color: "#e8192c" }} />
            </div>
            <h3 className="font-display font-bold text-gray-900 mb-1.5">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}