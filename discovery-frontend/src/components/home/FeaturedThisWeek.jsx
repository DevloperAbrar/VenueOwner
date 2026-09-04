import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import VendorCard from "../search/VendorCard";

function SkeletonCard() {
  return (
    <div className="flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_23.5%] min-w-0">
      <div className="h-44 rounded-xl bg-gray-100 animate-pulse mb-3" />
      <div className="h-3.5 w-3/4 rounded bg-gray-100 animate-pulse mb-2" />
      <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
    </div>
  );
}

export default function FeaturedThisWeek({ vendors = [], loading = false }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true, loop: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!loading && vendors.length === 0) return null;

  return (
    <section className="py-14 md:py-20 overflow-hidden" style={{ background: "#eef0f8" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase mb-2 px-3 py-1 rounded-full"
              style={{ color: "#e8192c", background: "#e8192c0d" }}
            >
              <Flame size={12} /> Trending now
            </p>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-navy-900">Featured this week</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-accent-300 hover:text-accent-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-accent-300 hover:text-accent-600 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 -ml-4 pl-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : vendors.map((v) => (
                  <div key={v.id} className="flex-[0_0_82%] sm:flex-[0_0_46%] lg:flex-[0_0_23.5%] min-w-0">
                    <VendorCard vendor={v} />
                  </div>
                ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/search" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: "#e8192c" }}>
            Browse all vendors <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}