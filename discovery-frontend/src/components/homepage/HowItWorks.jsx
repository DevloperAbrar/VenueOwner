import React from "react";
import { Search, GitCompare, MessageCircle } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Search your city", desc: "Tell us your city and what you're looking for." },
  { icon: GitCompare, title: "Compare vendors", desc: "Browse verified profiles, prices, and reviews." },
  { icon: MessageCircle, title: "Contact and book directly", desc: "Reach out to vendors directly — no middleman." }
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-3">
                <Icon size={22} />
              </div>
              <p className="font-semibold text-gray-800">{s.title}</p>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}