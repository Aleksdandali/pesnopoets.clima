"use client";

import { Phone, Send } from "lucide-react";

interface StickyMobileCTAProps {
  locale: string;
  priceBGN: string;
  phoneNumber: string;
  dictionary: {
    stickyBar: { call: string; inquiry: string };
    common: { currency: { bgn: string } };
  };
}

export default function StickyMobileCTA({
  locale,
  priceBGN,
  phoneNumber,
  dictionary,
}: StickyMobileCTAProps) {
  const t = dictionary.stickyBar;
  const currencyLabel = dictionary.common.currency.bgn;

  function scrollToInquiry() {
    const el = document.getElementById("inquiry-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="bg-white/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgb(0_0_0/0.08)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          {/* Price */}
          <div className="flex-1 min-w-0">
            <span className="text-base sm:text-lg font-bold text-foreground">
              {priceBGN} {currencyLabel}
            </span>
          </div>

          {/* Call button — min 44px tap target */}
          <a
            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 min-h-[44px] min-w-[44px] border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
            aria-label={t.call}
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">{t.call}</span>
          </a>

          {/* Inquiry button — min 44px tap target */}
          <button
            onClick={scrollToInquiry}
            className="flex items-center justify-center gap-1.5 px-4 sm:px-5 min-h-[44px] bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            {t.inquiry}
          </button>
        </div>
      </div>
    </div>
  );
}
