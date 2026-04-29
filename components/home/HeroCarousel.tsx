"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
  id: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  image_desktop: string | null;
  image_mobile: string | null;
  link: string;
}

interface HeroCarouselProps {
  banners: Banner[];
  locale: string;
  fallbackTitle: string;
  fallbackSubtitle: string;
  ctaLabel: string;
  ctaSecondaryLabel: string;
  ctaLink: string;
  ctaSecondaryLink: string;
}

export default function HeroCarousel({
  banners,
  locale,
  fallbackTitle,
  fallbackSubtitle,
  ctaLabel,
  ctaSecondaryLabel,
  ctaLink,
  ctaSecondaryLink,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = banners.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play every 6 seconds
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(next, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, total]);

  // Reset timer on manual navigation
  function navigate(idx: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    goTo(idx);
    timerRef.current = setInterval(next, 6000);
  }

  // Swipe support
  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? current + 1 : current - 1);
    }
    setTouchStart(null);
  }

  if (total === 0) return null;

  const banner = banners[current];
  const title = banner.title[locale] || banner.title.bg || fallbackTitle;
  const subtitle = banner.subtitle[locale] || banner.subtitle.bg || fallbackSubtitle;
  const imgDesktop = banner.image_desktop;
  const imgMobile = banner.image_mobile;
  const isAiConsultant = banner.link === "#ai-consultant";

  function handleClick() {
    if (isAiConsultant) {
      window.dispatchEvent(new CustomEvent("pesnopoets:open-consultant"));
    }
  }

  return (
    <section
      className="relative overflow-hidden h-[70vh] min-h-[420px] max-h-[700px] sm:h-[75vh] sm:min-h-[500px] sm:max-h-[800px] bg-[#0a1628]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background images — all preloaded, only current visible */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {b.image_desktop && (
            <Image
              src={b.image_desktop}
              alt=""
              fill
              className={`object-cover ${b.image_mobile ? "hidden sm:block" : ""}`}
              sizes="100vw"
              priority={i === 0}
              quality={85}
            />
          )}
          {b.image_mobile && (
            <Image
              src={b.image_mobile}
              alt=""
              fill
              className="object-cover sm:hidden"
              sizes="100vw"
              priority={i === 0}
              quality={85}
            />
          )}
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/60 to-[#0a1628]/20 sm:to-transparent" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pb-14 sm:pb-16">
        <div className="max-w-xl lg:max-w-2xl">
          {/* Title */}
          <h1
            key={`title-${current}`}
            className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight animate-fade-in-up"
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              key={`sub-${current}`}
              className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-lg animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              {subtitle}
            </p>
          )}

          {/* CTAs */}
          <div
            className="mt-5 sm:mt-7 flex flex-col sm:flex-row gap-2.5 sm:gap-4 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {isAiConsultant ? (
              <button
                type="button"
                onClick={handleClick}
                className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-200 shadow-[0_4px_20px_rgb(16_185_129/0.4)] hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                {ctaLabel}
              </button>
            ) : (
              <Link
                href={banner.link.startsWith("/") ? `/${locale}${banner.link}` : banner.link}
                className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-[0_4px_20px_rgb(2_132_199/0.4)] hover:-translate-y-0.5 text-xs sm:text-sm"
              >
                {ctaLabel}
              </Link>
            )}
            <Link
              href={`/${locale}${ctaSecondaryLink}`}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows — desktop */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => navigate(current - 1)}
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          <button
            type="button"
            onClick={() => navigate(current + 1)}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {total > 1 && (
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => navigate(i)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-white w-6 sm:w-8"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
