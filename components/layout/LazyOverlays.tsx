"use client";

import dynamic from "next/dynamic";
import type { ConsentCopy } from "@/components/privacy/ConsentManager";

const FloatingContactButtons = dynamic(
  () => import("@/components/layout/FloatingContactButtons"),
  { ssr: false }
);
const ConsultantChat = dynamic(
  () => import("@/components/consultant/ConsultantChat"),
  { ssr: false }
);
const ConsentManager = dynamic(
  () => import("@/components/privacy/ConsentManager"),
  { ssr: false }
);

type Locale = "bg" | "en" | "ru" | "ua";

interface LazyOverlaysProps {
  locale: Locale;
  consultantLabels: {
    triggerAria: string;
    title: string;
    subtitle: string;
    greeting: string;
    placeholder: string;
    send: string;
    close: string;
    thinking: string;
    errorGeneric: string;
    disclaimer: string;
    viewProduct: string;
    viewPrice: string;
  };
  whatsappLabel: string;
  viberLabel: string;
  consentCopy: ConsentCopy;
}

export default function LazyOverlays({
  locale,
  consultantLabels,
  whatsappLabel,
  viberLabel,
  consentCopy,
}: LazyOverlaysProps) {
  return (
    <>
      <FloatingContactButtons
        whatsappLabel={whatsappLabel}
        viberLabel={viberLabel}
        locale={locale}
      />
      <ConsultantChat locale={locale} labels={consultantLabels} />
      <ConsentManager locale={locale} copy={consentCopy} />
    </>
  );
}
