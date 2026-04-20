"use client";

import { useEffect, useRef, useState } from "react";
import { Phone, X, MessageCircle } from "lucide-react";
import {
  VIBER_URL,
  WHATSAPP_URL,
  BUSINESS_PHONE_TEL,
  BUSINESS_PHONE_DISPLAY,
} from "@/lib/constants";

interface FloatingContactButtonsProps {
  whatsappLabel: string;
  viberLabel: string;
  /** Optional localized string pack; falls back to Bulgarian defaults. */
  locale?: "bg" | "en" | "ru" | "ua";
}

const LABELS: Record<string, { contact: string; close: string; call: string }> = {
  bg: { contact: "Свържи се", close: "Затвори", call: "Обади се" },
  en: { contact: "Contact us", close: "Close", call: "Call us" },
  ru: { contact: "Связаться", close: "Закрыть", call: "Позвонить" },
  ua: { contact: "Зв'язатися", close: "Закрити", call: "Зателефонувати" },
};

/**
 * Floating contact FAB (single button that expands into WhatsApp / Viber / Call).
 * - Appears after a small scroll
 * - Lifts above StickyMobileCTA on product pages (data-sticky-cta on body)
 * - Hides entirely while the AI consultant panel is open (data-consultant-open)
 */
export default function FloatingContactButtons({
  whatsappLabel,
  viberLabel,
  locale = "bg",
}: FloatingContactButtonsProps) {
  const [visible, setVisible] = useState(false);
  const [stickyCta, setStickyCta] = useState(false);
  const [consultantOpen, setConsultantOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const t = LABELS[locale] ?? LABELS.bg;

  // Show after small scroll
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // React to sticky CTA + consultant panel
  useEffect(() => {
    const update = () => {
      setStickyCta(document.body.hasAttribute("data-sticky-cta"));
      setConsultantOpen(document.body.hasAttribute("data-consultant-open"));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-sticky-cta", "data-consultant-open"],
    });
    return () => observer.disconnect();
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!expanded) return;
    function onPointer(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExpanded(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  const effectivelyVisible = visible && !consultantOpen;
  const bottomClass = stickyCta ? "bottom-[80px] sm:bottom-5" : "bottom-3 sm:bottom-5";

  const items = [
    {
      key: "call",
      href: `tel:${BUSINESS_PHONE_TEL}`,
      label: t.call,
      sub: BUSINESS_PHONE_DISPLAY,
      bg: "bg-foreground",
      text: "text-white",
      icon: <Phone className="w-5 h-5" aria-hidden="true" />,
    },
    {
      key: "whatsapp",
      href: WHATSAPP_URL,
      external: true,
      label: whatsappLabel,
      sub: "WhatsApp",
      bg: "bg-[#25D366]",
      text: "text-white",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      key: "viber",
      href: VIBER_URL,
      label: viberLabel,
      sub: "Viber",
      bg: "bg-[#7360f2]",
      text: "text-white",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.55 2.68C14.28 1.85 9.72 1.85 5.45 2.68 3.82 3 2.31 4.5 1.95 6.14c-.87 3.96-.87 7.96 0 11.92.36 1.64 1.87 3.14 3.5 3.46.52.1 1.05.18 1.58.24v2.01c0 .73.89 1.09 1.4.57l2.03-2.07c.51.02 1.03.03 1.54.03 2.13 0 4.27-.21 6.39-.62C20.18 21.36 21.69 19.86 22.05 18.22c.87-3.96.87-7.96 0-11.92-.36-1.64-1.87-3.14-3.5-3.62zM16.5 16.47c-.26.73-1.14 1.34-1.92 1.51-.53.11-1.22.2-3.55-.77-2.97-1.23-4.88-4.25-5.03-4.45-.14-.19-1.2-1.6-1.2-3.06 0-1.45.74-2.17 1.03-2.47.24-.24.64-.36 1.03-.36.12 0 .24.01.33.01.3.01.45.03.65.51.25.61.87 2.1.95 2.26.08.16.13.35.02.55-.1.2-.2.31-.35.48-.15.17-.29.3-.44.48-.14.17-.29.34-.12.63.17.29.77 1.27 1.65 2.06 1.13 1.01 2.07 1.33 2.39 1.47.24.1.52.08.7-.12.22-.23.49-.62.77-1 .2-.27.45-.3.71-.21.27.09 1.69.8 1.98.94.29.14.48.22.55.34.07.13.07.74-.18 1.48z" />
          <path d="M12.09 3.78c-.21 0-.39.17-.39.39s.17.39.39.39c2.45.01 4.45 1.68 4.46 4.13 0 .22.17.39.39.39.22 0 .39-.18.39-.39-.01-2.87-2.35-5.21-5.24-5.22.01-.01 0 .3 0 .31zm3.05 4.56c0 .22.17.39.39.39s.39-.17.39-.39c.01-1.66-1.35-3.01-3.02-3.02-.22 0-.39.17-.39.39s.18.39.39.39c1.24.01 2.23 1 2.24 2.24zm-.72.29c-.21-.01-.38.16-.39.36 0 .21.15.38.36.39.55.02.99.47 1.01 1.01.01.22.18.38.39.38h.01c.22-.01.38-.18.38-.39-.02-.93-.81-1.72-1.76-1.75z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`fixed right-3 sm:right-5 ${bottomClass} z-40 transition-all duration-300 ${
        effectivelyVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none"
      }`}
      aria-hidden={!effectivelyVisible}
    >
      {/* Expanded items — fan upward from main trigger */}
      <div
        className={`absolute bottom-full right-0 mb-3 flex flex-col items-end gap-2.5 transition-all duration-200 origin-bottom-right ${
          expanded
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {items.map((item, i) => (
          <a
            key={item.key}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            aria-label={item.label}
            tabIndex={expanded && effectivelyVisible ? 0 : -1}
            onClick={() => setExpanded(false)}
            style={{
              transitionDelay: expanded ? `${i * 40}ms` : "0ms",
            }}
            className={`group flex items-center gap-3 transition-all duration-200 ${
              expanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {/* Label chip */}
            <div className="flex flex-col items-end px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-sm shadow-md border border-border/60">
              <span className="text-xs font-semibold text-foreground leading-tight">
                {item.label}
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight tabular-nums">
                {item.sub}
              </span>
            </div>
            {/* Icon circle */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full ${item.bg} ${item.text} shadow-lg group-hover:scale-110 transition-transform duration-200`}
            >
              {item.icon}
            </div>
          </a>
        ))}
      </div>

      {/* Main trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? t.close : t.contact}
        aria-expanded={expanded}
        tabIndex={effectivelyVisible ? 0 : -1}
        className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-[0_8px_24px_rgb(0_0_0/0.25)] hover:scale-105 hover:shadow-[0_12px_32px_rgb(0_0_0/0.3)] transition-all duration-300 ${
          expanded
            ? "bg-foreground text-white rotate-90"
            : "bg-foreground text-white"
        }`}
      >
        {/* Pulse ring — only when collapsed */}
        {!expanded && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-foreground opacity-25 animate-ping" />
        )}
        {expanded ? (
          <X className="relative w-5 h-5 sm:w-6 sm:h-6 transition-transform -rotate-90" aria-hidden="true" />
        ) : (
          <MessageCircle className="relative w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        )}
      </button>

      {/* Tiny label under the collapsed button */}
      {!expanded && (
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-semibold text-foreground shadow-sm border border-border/60 whitespace-nowrap pointer-events-none select-none"
          aria-hidden="true"
        >
          {t.contact}
        </span>
      )}
    </div>
  );
}
