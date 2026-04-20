"use client";

import { useEffect, useState } from "react";

interface StickyProductHeaderProps {
  title: string;
  priceBGN: string;
  priceEUR?: string;
  dictionary: {
    stickyBar: { inquiry: string };
    common: { currency: { bgn: string; eur: string } };
  };
}

/**
 * Top sticky header that slides in after the user scrolls past the hero / price block.
 * Shows compact title + price + single inquiry CTA. Mobile-first but also appears on desktop.
 * Inspired by bittel.bg's top bar — but compact, lightweight, and non-intrusive.
 */
export default function StickyProductHeader({
  title,
  priceBGN,
  priceEUR,
  dictionary,
}: StickyProductHeaderProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger after ~500px scroll (past the main price block)
    function onScroll() {
      setVisible(window.scrollY > 520);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToInquiry() {
    const el =
      document.getElementById("inquiry-form-section-mobile") ||
      document.getElementById("inquiry-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstField = el.querySelector<HTMLElement>("input,textarea,select,button");
      if (firstField) {
        setTimeout(() => firstField.focus({ preventScroll: true }), 400);
      }
    }
  }

  const t = dictionary.stickyBar;
  const bgnLabel = dictionary.common.currency.bgn;
  const eurLabel = dictionary.common.currency.eur;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="bg-white/95 backdrop-blur-xl border-b border-border shadow-[0_2px_12px_rgb(0_0_0/0.06)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-4">
          {/* Title — truncates aggressively */}
          <p className="flex-1 min-w-0 text-xs sm:text-sm font-semibold text-foreground truncate">
            {title}
          </p>

          {/* Price — stacked on mobile, inline on larger screens */}
          <div className="flex flex-col items-end leading-tight shrink-0 sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-sm sm:text-base font-extrabold text-foreground tabular-nums whitespace-nowrap">
              {priceBGN} {bgnLabel}
            </span>
            {priceEUR && (
              <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                ≈ {priceEUR} {eurLabel}
              </span>
            )}
          </div>

          {/* Inquiry CTA */}
          <button
            type="button"
            onClick={scrollToInquiry}
            tabIndex={visible ? 0 : -1}
            className="shrink-0 inline-flex items-center justify-center px-3 sm:px-5 min-h-[36px] sm:min-h-[40px] bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
          >
            {t.inquiry}
          </button>
        </div>
      </div>
    </div>
  );
}
