"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Flame } from "lucide-react";

interface PromoBarProps {
  locale: string;
}

const COPY: Record<string, { text: string; cta: string; ariaClose: string }> = {
  bg: {
    text: "Промоция: монтаж €50 до 31.05 при покупка от каталога",
    cta: "Подробности",
    ariaClose: "Затвори",
  },
  en: {
    text: "Promo: €50 install until May 31 with any catalog purchase",
    cta: "Details",
    ariaClose: "Close",
  },
  ru: {
    text: "Акция: монтаж €50 до 31.05 при покупке из каталога",
    cta: "Подробнее",
    ariaClose: "Закрыть",
  },
  ua: {
    text: "Акція: монтаж €50 до 31.05 при купівлі з каталогу",
    cta: "Детальніше",
    ariaClose: "Закрити",
  },
};

const DISMISS_KEY = "promo-bar-dismissed-tg50";
const PROMO_END_TS = new Date("2026-05-31T23:59:59+02:00").getTime();
const HIDE_FOR_MS = 24 * 60 * 60 * 1000; // 24h after dismiss

export default function PromoBar({ locale }: PromoBarProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const copy = COPY[locale] || COPY.bg;

  useEffect(() => {
    if (pathname?.includes("/tg")) return; // hide on the promo page itself
    if (Date.now() > PROMO_END_TS) return; // promo expired
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < HIDE_FOR_MS) return;
    setVisible(true);
  }, [pathname]);

  if (!visible) return null;

  function dismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-primary to-accent text-white">
      <Link
        href={`/${locale}/tg`}
        className="flex items-center justify-center gap-2 px-10 sm:px-12 py-2 text-xs sm:text-sm font-medium hover:bg-white/5 transition-colors text-center"
      >
        <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 animate-pulse" aria-hidden="true" />
        <span>
          {copy.text}{" "}
          <span className="underline underline-offset-4 ml-1 font-semibold whitespace-nowrap">
            {copy.cta} →
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label={copy.ariaClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/15 rounded-full transition-colors"
      >
        <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
