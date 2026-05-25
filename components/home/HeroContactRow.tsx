"use client";

import { Phone } from "lucide-react";
import { BUSINESS_PHONE_TEL, BUSINESS_PHONE_DISPLAY } from "@/lib/constants";
import { trackPhoneClick } from "@/lib/gtag";

/**
 * Above-the-fold contact bar — placed under the hero carousel so paid
 * traffic sees direct contact access before any scroll. Clarity
 * (2026-05-23) showed 76% of mobile visitors never scroll past 50%.
 *
 * Audit 2026-05-25: messenger chips removed — they duplicated the
 * FloatingContactButtons FAB (WhatsApp/Viber/Phone) in the bottom-right
 * corner. One calm phone pill is enough; messengers stay in the FAB.
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

          {/* Single, calm phone pill — messengers live in the floating FAB */}
          <div className="shrink-0">
            <a
              href={`tel:${BUSINESS_PHONE_TEL}`}
              onClick={() => trackPhoneClick()}
              className="group inline-flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-foreground text-white hover:bg-foreground/90 transition-colors shadow-[0_4px_14px_rgb(0_0_0/0.15)]"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
                <Phone className="w-4 h-4" aria-hidden="true" strokeWidth={2.5} />
              </span>
              <span className="text-sm sm:text-[0.95rem] font-bold tabular-nums tracking-tight pr-1">
                {BUSINESS_PHONE_DISPLAY}
              </span>
            </a>
          </div>
        </div>
        <p className="mt-2.5 lg:hidden text-[11px] text-muted-foreground/80">
          {t.callSubtitle}
        </p>
      </div>
    </section>
  );
}
