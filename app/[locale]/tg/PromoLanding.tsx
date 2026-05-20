"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Wrench,
  Award,
  Sparkles,
  Clock,
  ChevronDown,
} from "lucide-react";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL, WHATSAPP_URL } from "@/lib/constants";
import { trackInquirySubmit } from "@/lib/gtag";

export type Locale = "bg" | "en" | "ru" | "ua";

export interface PromoCopy {
  badge: string;
  headline: string;
  subheadline: string;
  priceWas: string;
  priceWasValue: string;
  priceNow: string;
  priceNowValue: string;
  perInstall: string;
  promoCodeLabel: string;
  countdownLabel: string;
  countdownDays: string;
  countdownHours: string;
  countdownMins: string;
  countdownEnded: string;
  ctaCall: string;
  ctaWhatsapp: string;
  ctaCatalog: string;
  catalogHref: string;
  trustTitle: string;
  trust: { title: string; desc: string }[];
  conditionsTitle: string;
  conditions: string[];
  formTitle: string;
  formSubtitle: string;
  formName: string;
  formPhone: string;
  formMessage: string;
  formMessagePlaceholder: string;
  formCodeLabel: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccess: string;
  formSuccessMessage: string;
  formError: string;
  formRequired: string;
  formPrivacy: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  whatsappPrefilled: string;
}

interface Props {
  locale: Locale;
  copy: PromoCopy;
}

const PROMO_END_TS = new Date("2026-05-31T23:59:59+02:00").getTime();
const ALLOWED_CODES = ["VAR50", "BAZ50", "UKR50", "MORE50", "GRP50", "KOM50", "OBJ50", "TG50"];

function useCountdown(target: number) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  return { diff, days, hours, mins };
}

function normalizeCode(raw: string | null): string {
  if (!raw) return "VAR50";
  const up = raw.trim().toUpperCase();
  return ALLOWED_CODES.includes(up) ? up : "VAR50";
}

const TRUST_ICONS = [ShieldCheck, MapPin, Wrench, Award];

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function PromoLanding({ locale, copy }: Props) {
  const sp = useSearchParams();
  const code = useMemo(() => normalizeCode(sp?.get("code")), [sp]);
  const { diff, days, hours, mins } = useCountdown(PROMO_END_TS);
  const promoExpired = diff <= 0;

  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(copy.whatsappPrefilled.replace("VAR50", code))}`;
  const phoneHref = `tel:${BUSINESS_PHONE_TEL}`;

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string)?.trim() || "";
    const rawPhone = (form.get("phone") as string)?.trim() || "";
    const note = (form.get("note") as string)?.trim() || "";

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = copy.formRequired;
    if (!rawPhone) newErrors.phone = copy.formRequired;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const message = [
      `[TG ПРОМО — код ${code}]`,
      note ? `Бележка: ${note}` : null,
      `Промо: монтаж €50 до 31.05.2026`,
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      name,
      phone: `+359 ${rawPhone}`.trim(),
      message,
      locale,
      source: "tg-promo",
    };

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("success");
      trackInquirySubmit("tg-promo");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  const inputCls =
    "w-full px-4 py-3 text-base sm:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors min-h-[48px]";
  const labelCls = "block text-sm font-medium text-foreground mb-1.5";
  const reqMark = <span className="text-danger">*</span>;

  return (
    <div className="bg-gradient-to-b from-primary-light/30 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              {copy.badge}
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.1] max-w-3xl mx-auto">
            {copy.headline}
          </h1>
          <div className="mt-4 mx-auto w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
          <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            {copy.subheadline}
          </p>
        </div>

        {/* Price anchor + promo code + countdown */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white border border-border/80 rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              {copy.priceWas}
            </p>
            <p className="mt-2 text-2xl font-bold text-muted-foreground line-through">
              {copy.priceWasValue}
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-5 text-center shadow-lg shadow-primary/20">
            <p className="text-xs uppercase tracking-wide font-semibold opacity-90">
              {copy.priceNow}
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight">{copy.priceNowValue}</p>
            <p className="mt-1 text-xs opacity-90">{copy.perInstall}</p>
          </div>
          <div className="bg-white border-2 border-dashed border-primary/40 rounded-2xl p-5 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              {copy.promoCodeLabel}
            </p>
            <p className="mt-2 text-2xl font-extrabold text-primary tracking-widest tabular-nums">
              {code}
            </p>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-6 max-w-3xl mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
          {promoExpired ? (
            <span>{copy.countdownEnded}</span>
          ) : (
            <span>
              {copy.countdownLabel}{" "}
              <strong className="text-foreground tabular-nums">
                {days} {copy.countdownDays} {hours} {copy.countdownHours} {mins} {copy.countdownMins}
              </strong>
            </span>
          )}
        </div>

        {/* CTAs */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <a
            href={phoneHref}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[52px] shadow-sm"
            onClick={() => trackInquirySubmit("tg-promo-call")}
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>{copy.ctaCall}</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity min-h-[52px] shadow-sm"
            onClick={() => trackInquirySubmit("tg-promo-whatsapp")}
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>{copy.ctaWhatsapp}</span>
          </a>
          <Link
            href={`/${locale}${copy.catalogHref}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-foreground font-semibold rounded-xl border border-border hover:border-primary/60 transition-colors min-h-[52px] shadow-sm"
          >
            <span>{copy.ctaCatalog}</span>
          </Link>
        </div>

        {/* Trust grid */}
        <section className="mt-12">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {copy.trustTitle}
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {copy.trust.map((item, i) => {
              const Icon = TRUST_ICONS[i] || ShieldCheck;
              return (
                <div
                  key={item.title}
                  className="p-5 bg-white border border-border/70 rounded-2xl"
                >
                  <div className="w-10 h-10 bg-primary-light/60 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Owner photo as authenticity proof */}
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center max-w-4xl mx-auto">
          <figure className="relative rounded-2xl overflow-hidden bg-muted/40 border border-border/40 shadow-sm">
            <div className="relative aspect-[4/5]">
              <Image
                src="/team/owner-portrait.jpg"
                alt={copy.trust[0]?.title || "Pesnopoets Klima"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />
            </div>
          </figure>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              {copy.trust[2]?.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {copy.trust[2]?.desc}
            </p>
            <a
              href={phoneHref}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {BUSINESS_PHONE_DISPLAY}
            </a>
          </div>
        </section>

        {/* Conditions */}
        <section className="mt-12 bg-muted/30 border border-border/60 rounded-2xl p-5 sm:p-7 max-w-3xl mx-auto">
          <h2 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
            {copy.conditionsTitle}
          </h2>
          <ul className="space-y-2.5">
            {copy.conditions.map((c) => (
              <li key={c} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <section className="mt-12 bg-white border border-border/80 rounded-2xl p-5 sm:p-8 max-w-2xl mx-auto shadow-sm">
          {status === "success" ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-success mx-auto mb-3" aria-hidden="true" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                {copy.formSuccess}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {copy.formSuccessMessage}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {copy.formTitle}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{copy.formSubtitle}</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className={labelCls}>
                    {copy.formName} {reqMark}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    className={`${inputCls} ${errors.name ? "border-danger" : "border-border"}`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-danger" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className={labelCls}>
                    {copy.formPhone} {reqMark}
                  </label>
                  <div
                    className={`flex items-stretch rounded-lg bg-white border focus-within:ring-2 focus-within:ring-ring transition-colors overflow-hidden ${
                      errors.phone ? "border-danger" : "border-border"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="flex items-center px-3 bg-muted text-sm font-medium text-muted-foreground border-r border-border tabular-nums"
                    >
                      +359
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={20}
                      autoComplete="tel-national"
                      inputMode="tel"
                      placeholder="88 123 4567"
                      pattern="[0-9 ()\-]{7,}"
                      onInput={(e) => {
                        const el = e.currentTarget;
                        const clean = el.value
                          .replace(/^\+?359\s?/, "")
                          .replace(/^0+/, "");
                        if (clean !== el.value) el.value = clean;
                      }}
                      className="flex-1 min-w-0 px-4 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-danger" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="note" className={labelCls}>
                    {copy.formMessage}
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    maxLength={500}
                    placeholder={copy.formMessagePlaceholder}
                    className="w-full px-4 py-3 text-base sm:text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
                  />
                </div>
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-muted-foreground">{copy.formCodeLabel}</span>
                  <span className="font-bold text-primary tracking-widest tabular-nums">
                    {code}
                  </span>
                </div>
                {status === "error" && (
                  <div
                    className="flex items-center gap-2 bg-danger-light text-danger rounded-lg p-3 text-sm"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {copy.formError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm min-h-[52px] text-base"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      {copy.formSubmitting}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      {copy.formSubmit}
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground text-center">{copy.formPrivacy}</p>
              </form>
            </>
          )}
        </section>

        {/* FAQ */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight text-center mb-6">
            {copy.faqTitle}
          </h2>
          <div className="space-y-2.5">
            {copy.faq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="bg-white border border-border/70 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 text-left hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
