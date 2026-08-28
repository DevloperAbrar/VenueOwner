import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../../lib/api";

export default function SearchBar({ large = false }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (q.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
      api.get("/autocomplete", { params: { q } }).then(({ data }) => {
        setSuggestions(data.data);
        setOpen(true);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  const submitSearch = () => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={ref}>
      <div className={`flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 ${large ? "py-3" : "py-2"} shadow-sm`}>
        <Search size={18} className="text-gray-400" />
        <input
          className="flex-1 outline-none text-sm"
          placeholder="Search marriage hall, photographer, caterer in your city"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          onFocus={() => suggestions.length && setOpen(true)}
        />
        <button onClick={submitSearch} className="bg-primary-600 text-white text-sm px-4 py-1.5 rounded-full">Search</button>
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg py-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { navigate(s.url); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex justify-between"
            >
              <span>{s.label}</span>
              <span className="text-gray-400">{s.city}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}