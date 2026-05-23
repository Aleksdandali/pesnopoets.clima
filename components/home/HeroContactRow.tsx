"use client";

import { Phone } from "lucide-react";
import {
  BUSINESS_PHONE_TEL,
  WHATSAPP_URL,
  VIBER_URL,
  INSTAGRAM_URL,
} from "@/lib/constants";
import { trackPhoneClick, trackMessengerClick } from "@/lib/gtag";

/**
 * Above-the-fold contact row — placed under the hero carousel so paid traffic
 * sees direct messenger access before any scroll. Clarity (2026-05-23) shows
 * 76% of mobile visitors never scroll past 50% — making this row the only
 * realistic point of contact for ad traffic.
 */

interface Labels {
  /** Section title above the buttons (small caption). */
  title: string;
  call: string;
  whatsapp: string;
  viber: string;
  instagram: string;
}

const LABELS: Record<string, Labels> = {
  bg: {
    title: "Свържете се директно",
    call: "Обади се",
    whatsapp: "WhatsApp",
    viber: "Viber",
    instagram: "Instagram",
  },
  en: {
    title: "Contact us directly",
    call: "Call",
    whatsapp: "WhatsApp",
    viber: "Viber",
    instagram: "Instagram",
  },
  ru: {
    title: "Связаться напрямую",
    call: "Позвонить",
    whatsapp: "WhatsApp",
    viber: "Viber",
    instagram: "Instagram",
  },
  ua: {
    title: "Зв'язатися напряму",
    call: "Зателефонувати",
    whatsapp: "WhatsApp",
    viber: "Viber",
    instagram: "Instagram",
  },
};

export default function HeroContactRow({ locale }: { locale: string }) {
  const t = LABELS[locale] ?? LABELS.bg;

  const items = [
    {
      key: "call" as const,
      href: `tel:${BUSINESS_PHONE_TEL}`,
      label: t.call,
      bg: "bg-foreground hover:bg-foreground/90",
      icon: <Phone className="w-5 h-5" aria-hidden="true" />,
      pulse: false,
    },
    {
      key: "whatsapp" as const,
      href: WHATSAPP_URL,
      external: true,
      label: t.whatsapp,
      bg: "bg-[#25D366] hover:bg-[#1ebe5a]",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      pulse: true,
    },
    {
      key: "viber" as const,
      href: VIBER_URL,
      label: t.viber,
      bg: "bg-[#7360f2] hover:bg-[#5f4cd9]",
      icon: (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.55 2.68C14.28 1.85 9.72 1.85 5.45 2.68 3.82 3 2.31 4.5 1.95 6.14c-.87 3.96-.87 7.96 0 11.92.36 1.64 1.87 3.14 3.5 3.46.52.1 1.05.18 1.58.24v2.01c0 .73.89 1.09 1.4.57l2.03-2.07c.51.02 1.03.03 1.54.03 2.13 0 4.27-.21 6.39-.62C20.18 21.36 21.69 19.86 22.05 18.22c.87-3.96.87-7.96 0-11.92-.36-1.64-1.87-3.14-3.5-3.62zM16.5 16.47c-.26.73-1.14 1.34-1.92 1.51-.53.11-1.22.2-3.55-.77-2.97-1.23-4.88-4.25-5.03-4.45-.14-.19-1.2-1.6-1.2-3.06 0-1.45.74-2.17 1.03-2.47.24-.24.64-.36 1.03-.36.12 0 .24.01.33.01.3.01.45.03.65.51.25.61.87 2.1.95 2.26.08.16.13.35.02.55-.1.2-.2.31-.35.48-.15.17-.29.3-.44.48-.14.17-.29.34-.12.63.17.29.77 1.27 1.65 2.06 1.13 1.01 2.07 1.33 2.39 1.47.24.1.52.08.7-.12.22-.23.49-.62.77-1 .2-.27.45-.3.71-.21.27.09 1.69.8 1.98.94.29.14.48.22.55.34.07.13.07.74-.18 1.48z" />
          <path d="M12.09 3.78c-.21 0-.39.17-.39.39s.17.39.39.39c2.45.01 4.45 1.68 4.46 4.13 0 .22.17.39.39.39.22 0 .39-.18.39-.39-.01-2.87-2.35-5.21-5.24-5.22.01-.01 0 .3 0 .31zm3.05 4.56c0 .22.17.39.39.39s.39-.17.39-.39c.01-1.66-1.35-3.01-3.02-3.02-.22 0-.39.17-.39.39s.18.39.39.39c1.24.01 2.23 1 2.24 2.24zm-.72.29c-.21-.01-.38.16-.39.36 0 .21.15.38.36.39.55.02.99.47 1.01 1.01.01.22.18.38.39.38h.01c.22-.01.38-.18.38-.39-.02-.93-.81-1.72-1.76-1.75z" />
        </svg>
      ),
      pulse: false,
    },
    {
      key: "instagram" as const,
      href: INSTAGRAM_URL,
      external: true,
      label: t.instagram,
      bg: "bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      pulse: false,
    },
  ];

  return (
    <section
      aria-label={t.title}
      className="border-b border-border/40 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2.5 sm:mb-3">
          <span className="h-px w-6 bg-border" aria-hidden="true" />
          <span className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {t.title}
          </span>
          <span className="h-px w-6 bg-border sm:hidden" aria-hidden="true" />
        </div>
        <div className="flex items-stretch justify-center sm:justify-start gap-2.5 sm:gap-3 flex-wrap">
          {items.map((item) => (
            <a
              key={item.key}
              href={item.href}
              target={"external" in item && item.external ? "_blank" : undefined}
              rel={"external" in item && item.external ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              onClick={() => {
                if (item.key === "call") trackPhoneClick();
                else trackMessengerClick(item.key);
              }}
              className={`relative group flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl text-white text-sm font-semibold shadow-[0_2px_8px_rgb(0_0_0/0.08)] hover:shadow-[0_6px_16px_rgb(0_0_0/0.12)] hover:-translate-y-0.5 transition-all duration-200 ${item.bg}`}
            >
              {item.pulse && (
                <span
                  className="absolute inset-0 rounded-xl bg-[#25D366] opacity-40"
                  style={{
                    animation: "ping 2.5s cubic-bezier(0,0,0.2,1) infinite",
                  }}
                  aria-hidden="true"
                />
              )}
              <span className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-white/15 shrink-0">
                {item.icon}
              </span>
              <span className="relative whitespace-nowrap">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
