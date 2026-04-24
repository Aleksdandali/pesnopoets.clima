"use client";

import dynamic from "next/dynamic";

const FloatingContactButtons = dynamic(
  () => import("@/components/layout/FloatingContactButtons"),
  { ssr: false }
);
const ConsultantChat = dynamic(
  () => import("@/components/consultant/ConsultantChat"),
  { ssr: false }
);
const CookieConsent = dynamic(
  () => import("@/components/CookieConsent"),
  { ssr: false }
);

interface LazyOverlaysProps {
  locale: "bg" | "en" | "ru" | "ua";
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
  cookieLocale: string;
  cookieDictionary: {
    cookie: {
      text: string;
      accept: string;
      decline: string;
      learnMore: string;
    };
  };
}

export default function LazyOverlays({
  locale,
  consultantLabels,
  whatsappLabel,
  viberLabel,
  cookieLocale,
  cookieDictionary,
}: LazyOverlaysProps) {
  return (
    <>
      <FloatingContactButtons
        whatsappLabel={whatsappLabel}
        viberLabel={viberLabel}
        locale={locale}
      />
      <ConsultantChat locale={locale} labels={consultantLabels} />
      <CookieConsent locale={cookieLocale} dictionary={cookieDictionary} />
    </>
  );
}
