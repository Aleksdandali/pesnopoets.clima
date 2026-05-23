"use client";

import { Phone } from "lucide-react";
import {
  BUSINESS_PHONE_TEL,
  BUSINESS_PHONE_DISPLAY,
  WHATSAPP_URL,
  VIBER_URL,
  INSTAGRAM_URL,
} from "@/lib/constants";
import { trackPhoneClick, trackMessengerClick } from "@/lib/gtag";

/**
 * Above-the-fold contact bar — placed under the hero carousel so paid
 * traffic sees direct contact access before any scroll. Clarity
 * (2026-05-23) showed 76% of mobile visitors never scroll past 50%.
 *
 * Senior-designer redesign (2026-05-23): one calm, restrained bar —
 * prominent phone on the left, icon-only messenger chips on the right.
 * No more bright button-cluster that looked like an ad.
 */

interface Labels {
  callSubtitle: string;
  invitationLine1: string;
  invitationLine2: string;
}

const LABELS: Record<string, Labels> = {
  bg: {
    callSubtitle: "Пон.–Съб. 08:00–19:00",
    invitationLine1: "Ще се радваме да Ви консултираме",
    invitationLine2: "Пишете ни — безплатно, без ангажимент",
  },
  en: {
    callSubtitle: "Mon–Sat 08:00–19:00",
    invitationLine1: "We'd love to help you choose",
    invitationLine2: "Message us — free advice, no obligation",
  },
  ru: {
    callSubtitle: "Пн–Сб 08:00–19:00",
    invitationLine1: "С удовольствием проконсультируем",
    invitationLine2: "Пишите — бесплатно, ни к чему не обязывает",
  },
  ua: {
    callSubtitle: "Пн–Сб 08:00–19:00",
    invitationLine1: "Із задоволенням проконсультуємо",
    invitationLine2: "Пишіть — безкоштовно, без зобов'язань",
  },
};

interface MessengerChip {
  key: "whatsapp" | "viber" | "instagram";
  href: string;
  label: string;
  iconColor: string;
  hoverBg: string;
  hoverBorder: string;
  pulse?: boolean;
  icon: React.ReactNode;
}

const MESSENGERS: MessengerChip[] = [
  {
    key: "whatsapp",
    href: WHATSAPP_URL,
    label: "WhatsApp",
    iconColor: "text-[#25D366]",
    hoverBg: "hover:bg-[#25D366]",
    hoverBorder: "hover:border-[#25D366]",
    pulse: true,
    icon: (
      <svg
        className="w-5 h-5 transition-colors"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    key: "viber",
    href: VIBER_URL,
    label: "Viber",
    iconColor: "text-[#7360F2]",
    hoverBg: "hover:bg-[#7360F2]",
    hoverBorder: "hover:border-[#7360F2]",
    icon: (
      <svg
        className="w-5 h-5 transition-colors"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M18.55 2.68C14.28 1.85 9.72 1.85 5.45 2.68 3.82 3 2.31 4.5 1.95 6.14c-.87 3.96-.87 7.96 0 11.92.36 1.64 1.87 3.14 3.5 3.46.52.1 1.05.18 1.58.24v2.01c0 .73.89 1.09 1.4.57l2.03-2.07c.51.02 1.03.03 1.54.03 2.13 0 4.27-.21 6.39-.62C20.18 21.36 21.69 19.86 22.05 18.22c.87-3.96.87-7.96 0-11.92-.36-1.64-1.87-3.14-3.5-3.62zM16.5 16.47c-.26.73-1.14 1.34-1.92 1.51-.53.11-1.22.2-3.55-.77-2.97-1.23-4.88-4.25-5.03-4.45-.14-.19-1.2-1.6-1.2-3.06 0-1.45.74-2.17 1.03-2.47.24-.24.64-.36 1.03-.36.12 0 .24.01.33.01.3.01.45.03.65.51.25.61.87 2.1.95 2.26.08.16.13.35.02.55-.1.2-.2.31-.35.48-.15.17-.29.3-.44.48-.14.17-.29.34-.12.63.17.29.77 1.27 1.65 2.06 1.13 1.01 2.07 1.33 2.39 1.47.24.1.52.08.7-.12.22-.23.49-.62.77-1 .2-.27.45-.3.71-.21.27.09 1.69.8 1.98.94.29.14.48.22.55.34.07.13.07.74-.18 1.48z" />
        <path d="M12.09 3.78c-.21 0-.39.17-.39.39s.17.39.39.39c2.45.01 4.45 1.68 4.46 4.13 0 .22.17.39.39.39.22 0 .39-.18.39-.39-.01-2.87-2.35-5.21-5.24-5.22.01-.01 0 .3 0 .31zm3.05 4.56c0 .22.17.39.39.39s.39-.17.39-.39c.01-1.66-1.35-3.01-3.02-3.02-.22 0-.39.17-.39.39s.18.39.39.39c1.24.01 2.23 1 2.24 2.24zm-.72.29c-.21-.01-.38.16-.39.36 0 .21.15.38.36.39.55.02.99.47 1.01 1.01.01.22.18.38.39.38h.01c.22-.01.38-.18.38-.39-.02-.93-.81-1.72-1.76-1.75z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    href: INSTAGRAM_URL,
    label: "Instagram",
    iconColor: "text-[#E1306C]",
    hoverBg: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]",
    hoverBorder: "hover:border-[#E1306C]",
    icon: (
      <svg
        className="w-5 h-5 transition-colors"
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
  },
];

export default function HeroContactRow({ locale }: { locale: string }) {
  const t = LABELS[locale] ?? LABELS.bg;

  return (
    <section
      aria-label={t.invitationLine1}
      className="bg-gradient-to-b from-white to-muted/30 border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 lg:gap-8">
          {/* Warm invitation copy — leads as marketing message, not a CTA strip */}
          <div className="flex-1 min-w-0">
            <p className="text-base sm:text-[1.05rem] font-semibold text-foreground leading-snug">
              {t.invitationLine1}
            </p>
            <p className="mt-1 text-sm text-muted-foreground leading-snug">
              {t.invitationLine2}
            </p>
          </div>

          {/* Actions: phone (primary) + messenger chips (secondary) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href={`tel:${BUSINESS_PHONE_TEL}`}
              onClick={() => trackPhoneClick()}
              className="group flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors shadow-[0_4px_14px_rgb(0_0_0/0.15)]"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                <Phone className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
              </span>
              <span className="text-sm sm:text-[0.95rem] font-bold tabular-nums tracking-tight pr-1">
                {BUSINESS_PHONE_DISPLAY}
              </span>
            </a>

            <div className="hidden sm:block w-px h-8 bg-border/70" aria-hidden="true" />

            <div className="flex items-center gap-2 sm:gap-2.5">
              {MESSENGERS.map((m) => (
                <a
                  key={m.key}
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={m.label}
                  title={m.label}
                  onClick={() => trackMessengerClick(m.key)}
                  className={`group/chip relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-border/70 ${m.iconColor} hover:text-white ${m.hoverBg} ${m.hoverBorder} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgb(0_0_0/0.12)]`}
                >
                  {m.pulse && (
                    <span
                      className="absolute inset-0 rounded-full ring-2 ring-[#25D366]/40"
                      style={{
                        animation:
                          "ping 2.8s cubic-bezier(0,0,0.2,1) infinite",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative">{m.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-2.5 lg:hidden text-[11px] text-muted-foreground/80">
          {t.callSubtitle}
        </p>
      </div>
    </section>
  );
}
