"use client";

import { useState, useEffect, useCallback } from "react";

const SLIDES = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    title: "Fashion Batik Nusantara",
    sub: "Koleksi eksklusif dari pengrajin terbaik Indonesia",
    badge: "Fashion & Batik",
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    title: "Kuliner Khas Daerah",
    sub: "Cita rasa otentik dikirim ke seluruh nusantara",
    badge: "Makanan & Minuman",
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    title: "Kerajinan Tangan Premium",
    sub: "Karya seni bernilai tinggi dari pengrajin lokal",
    badge: "Kerajinan",
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    title: "Kecantikan Herbal Alami",
    sub: "Produk perawatan berbahan rempah pilihan",
    badge: "Kecantikan & Spa",
  },
  {
    id: 5,
    url: "https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
    title: "Hasil Tani Pilihan",
    sub: "Langsung dari petani ke tangan Anda",
    badge: "Pertanian Segar",
  },
];

function getPos(idx: number, active: number, total: number): "active" | "prev" | "next" | "far" {
  const diff = ((idx - active + total) % total);
  if (diff === 0) return "active";
  if (diff === 1) return "next";
  if (diff === total - 1) return "prev";
  return "far";
}

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setActive(a => (a + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive(a => (a - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 3800);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 3D Stage */}
      <div className="relative flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-96">
        {SLIDES.map((slide, idx) => {
          const pos = getPos(idx, active, SLIDES.length);
          const isActive = pos === "active";
          const isPrev = pos === "prev";
          const isNext = pos === "next";
          const isFar = pos === "far";

          let transform = "";
          let opacity = 0;
          let zIndex = 0;
          let pointerEvents: "none" | "auto" = "none";

          if (isActive) {
            transform = "translateX(0%) rotateY(0deg) scale(1)";
            opacity = 1;
            zIndex = 30;
            pointerEvents = "auto";
          } else if (isPrev) {
            transform = "translateX(-68%) rotateY(35deg) scale(0.78)";
            opacity = 0.55;
            zIndex = 20;
          } else if (isNext) {
            transform = "translateX(68%) rotateY(-35deg) scale(0.78)";
            opacity = 0.55;
            zIndex = 20;
          } else if (isFar) {
            transform = "translateX(0%) rotateY(0deg) scale(0.5)";
            opacity = 0;
            zIndex = 10;
          }

          return (
            <div
              key={slide.id}
              onClick={() => {
                if (isPrev) prev();
                if (isNext) next();
              }}
              style={{
                position: "absolute",
                width: "min(85%, 520px)",
                transform,
                opacity,
                zIndex,
                pointerEvents,
                transition: "all 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transformStyle: "preserve-3d",
                cursor: isPrev || isNext ? "pointer" : "default",
              }}
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl"
                style={{ aspectRatio: "16/9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  style={{
                    transition: "transform 0.65s ease",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Badge */}
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-teal-500/90 backdrop-blur px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white">
                    {slide.badge}
                  </span>
                </div>
                {/* Text */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-bold text-white leading-tight drop-shadow">
                    {slide.title}
                  </h3>
                  <p className="text-[10px] sm:text-sm text-white/80 mt-0.5 drop-shadow hidden sm:block">
                    {slide.sub}
                  </p>
                </div>
                {/* Shine effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.5s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/40 transition shadow-lg"
        aria-label="Previous"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/40 transition shadow-lg"
        aria-label="Next"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className="transition-all duration-300"
            style={{
              height: 6,
              width: active === idx ? 22 : 6,
              borderRadius: 99,
              background: active === idx ? "#fff" : "rgba(255,255,255,0.45)",
            }}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
