import React, { useState, useEffect } from "react";

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to]);
  return <span>{val.toLocaleString("en-IN")}{suffix}</span>;
}

export default function TrustStats({ stats }) {
  return (
    <section className="bg-white py-10 border-b border-gray-50">
      <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#1a2035" }}>
            <Counter to={stats?.total_vendors ?? 0} suffix="+" />
          </p>
          <p className="text-sm text-gray-500 mt-1">Verified vendors</p>
        </div>
        <div>
          <p className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#1a2035" }}>
            <Counter to={stats?.cities_covered ?? 0} suffix="+" />
          </p>
          <p className="text-sm text-gray-500 mt-1">Cities covered</p>
        </div>
        <div>
          <p className="font-display font-extrabold text-3xl md:text-4xl" style={{ color: "#1a2035" }}>
            <Counter to={stats?.events_completed ?? 0} suffix="+" />
          </p>
          <p className="text-sm text-gray-500 mt-1">Events completed</p>
        </div>
      </div>
    </section>
  );
}