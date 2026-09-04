import React from "react";

const PATHS = {
  wave:   "M0,32 C240,80 480,0 720,28 C960,56 1200,8 1440,36 L1440,100 L0,100 Z",
  curve:  "M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z",
  angle:  "M0,100 L1440,0 L1440,100 Z",
  zigzag: "M0,55 L120,15 L240,55 L360,15 L480,55 L600,15 L720,55 L840,15 L960,55 L1080,15 L1200,55 L1320,15 L1440,55 L1440,100 L0,100 Z"
};

/**
 * Full-width shape divider dropped between two <section>s.
 * from = background colour of the section ABOVE  (fills the outer strip)
 * to   = background colour of the section BELOW  (fills the shape itself)
 */
export default function SectionDivider({ variant = "wave", from = "#ffffff", to = "#ffffff", flip = false, height = 56 }) {
  const path = PATHS[variant] || PATHS.wave;
  return (
    <div
      aria-hidden="true"
      style={{ background: from, height, transform: flip ? "scaleY(-1)" : undefined }}
      className="w-full overflow-hidden leading-[0]"
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-full block">
        <path d={path} fill={to} />
      </svg>
    </div>
  );
}