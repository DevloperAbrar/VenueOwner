import React from "react";
import { ChevronDown } from "lucide-react";

export default function HeroSection({ venue }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: `url(${venue.hero_image_url || "/placeholder-venue.jpg"})` }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 px-6 max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-semibold uppercase tracking-widest mb-6 border border-white/30">
          Welcome to {venue.hall_name}
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          {venue.hero_heading || venue.hall_name}
        </h1>

        {venue.hero_subheading && (
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl mx-auto leading-relaxed">
            {venue.hero_subheading}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
         <a  href="#inquiry"
            className="px-8 py-4 rounded-full font-bold text-white text-base shadow-2xl transition-transform hover:scale-105"
            style={{ backgroundColor: venue.theme_color || "#7c3aed" }}
          >
            {venue.hero_button_text || "Enquire Now"}
          </a>
          
         <a   href="#about"
            className="px-8 py-4 rounded-full font-bold text-white text-base border-2 border-white/60 backdrop-blur hover:bg-white/10 transition-all"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown size={32} className="text-white/70" />
      </div>
    </section>
  );
}