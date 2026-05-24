"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Lock, Loader2, AlertCircle, Unlock } from "lucide-react";
import { trackInquirySubmit } from "@/lib/gtag";

type Locale = "bg" | "en" | "ru" | "ua";

interface Props {
  locale: string;
}

const PROMO_END_TS = new Date("2026-05-31T23:59:59+02:00").getTime();

const COPY: Record<Locale, {
  badge: string;
  headline: string;
  sub: string;
  priceWas: string;
  priceNow: string;
  phoneLabel: string;
  submit: string;
  submitting: string;
  ended: string;
  error: string;
  privacy: string;
  countdownLabel: string;
  d: string;
  h: string;
  m: string;
}> = {
  bg: {
    badge: "Промо до 31 май",
    headline: "Монтаж €99 при покупка на климатик",
    sub: "Остави телефон — изпращаме ти промокода веднага. Само срещу телефон.",
    priceWas: "≈ €190",
    priceNow: "€99",
    phoneLabel: "Телефон",
    submit: "Получи промокода",
    submitting: "Изпращане...",
    ended: "Промоцията приключи.",
    error: "Грешка. Опитай отново или се обади.",
    privacy: "Само за връзка с теб — не споделяме данни.",
    countdownLabel: "Остават:",
    d: "дни",
    h: "ч",
    m: "мин",
  },
  en: {
    badge: "Promo until May 31",
    headline: "€99 installation with any AC purchase",
    sub: "Leave your phone — we send the promo code instantly. Phone only.",
    priceWas: "≈ €190",
    priceNow: "€99",
    phoneLabel: "Phone",
    submit: "Get the code",
    submitting: "Sending...",
    ended: "Promo has ended.",
    error: "Error. Please try again or call us.",
    privacy: "Used only to contact you — never shared.",
    countdownLabel: "Time left:",
    d: "d",
    h: "h",
    m: "min",
  },
  ru: {
    badge: "Акция до 31 мая",
    headline: "Монтаж €99 при покупке кондиционера",
    sub: "Оставьте телефон — пришлём промокод мгновенно. Только телефон.",
    priceWas: "≈ €190",
    priceNow: "€99",
    phoneLabel: "Телефон",
    submit: "Получить промокод",
    submitting: "Отправка...",
    ended: "Акция завершена.",
    error: "Ошибка. Попробуйте снова или позвоните.",
    privacy: "Только для связи — не передаём третьим лицам.",
    countdownLabel: "Осталось:",
    d: "дн",
    h: "ч",
    m: "мин",
  },
  ua: {
    badge: "Акція до 31 травня",
    headline: "Монтаж €99 при купівлі кондиціонера",
    sub: "Залиште телефон — надішлемо промокод миттєво. Лише телефон.",
    priceWas: "≈ €190",
    priceNow: "€99",
    phoneLabel: "Телефон",
    submit: "Отримати промокод",
    submitting: "Надсилання...",
    ended: "Акцію завершено.",
    error: "Помилка. Спробуйте ще раз або зателефонуйте.",
    privacy: "Лише для зв'язку — не передаємо третім особам.",
    countdownLabel: "Залишилось:",
    d: "дн",
    h: "год",
    m: "хв",
  },
};

function useCountdown() {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, PROMO_END_TS - now);
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  return { diff, days, hours, mins };
}

export default function PromoCodeBanner({ locale }: Props) {
  const lc = (["bg", "en", "ru", "ua"].includes(locale) ? locale : "bg") as Locale;
  const copy = COPY[lc];
  const router = useRouter();
  const { diff, days, hours, mins } = useCountdown();
  const expired = diff <= 0;

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [err, setErr] = useState<string>("");

  if (expired) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const form = new FormData(e.currentTarget);
    const rawPhone = (form.get("phone") as string)?.trim() || "";
    const cleanPhone = rawPhone.replace(/[^\d]/g, "");
    if (cleanPhone.length < 7) {
      setErr(copy.error);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Промо-заявка",
          phone: `+359 ${cleanPhone}`,
          message: `[ЗАЯВКА ЗА КОД — органика, главна страница] Промо: монтаж €99 до 31.05.2026`,
          locale: lc,
          source: "tg-promo-organic",
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      trackInquirySubmit("tg-promo-organic");
      // Dedup: tell /tg landing that this lead is already counted, so its
      // own form submit (same phone, name/note added) does NOT re-fire a
      // Google Ads conversion. One actual lead = one Ads conversion.
      try { sessionStorage.setItem("tg_promo_counted", "1"); } catch (_) {}
      router.push(`/${lc}/tg?code=SITE50&phone=${encodeURIComponent(cleanPhone)}`);
    } catch {
      setStatus("error");
      setErr(copy.error);
    }
  }

  return (
    <section
      aria-labelledby="promo-banner-headline"
      className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent"
    >
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)",
          }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-center">
          {/* Left: copy */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/25 rounded-full mb-3 backdrop-blur-sm">
              <Flame
                className="w-3.5 h-3.5 text-white animate-pulse"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold tracking-wide uppercase">
                {copy.badge}
              </span>
            </div>
            <h2
              id="promo-banner-headline"
              className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight"
            >
              {copy.headline}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              {copy.sub}
            </p>
            <div className="mt-3 flex items-center gap-3 text-white/90 text-sm">
              <span className="line-through opacity-70">{copy.priceWas}</span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {copy.priceNow}
              </span>
              <span className="text-xs sm:text-sm opacity-80 tabular-nums">
                · {copy.countdownLabel} {days} {copy.d} {hours} {copy.h} {mins}{" "}
                {copy.m}
              </span>
            </div>
          </div>

          {/* Right: form card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-4 sm:p-5 w-full lg:w-[380px] shadow-xl shadow-black/10"
          >
            <label
              htmlFor="promo_phone"
              className="text-xs font-semibold text-foreground/70 flex items-center gap-1.5 mb-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              {copy.phoneLabel}
            </label>
            <div
              className={`flex items-stretch rounded-lg bg-white border focus-within:ring-2 focus-within:ring-ring transition-colors overflow-hidden mb-2.5 ${
                err ? "border-danger" : "border-border"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex items-center px-3 bg-muted text-sm font-medium text-muted-foreground border-r border-border tabular-nums"
              >
                +359
              </span>
              <input
                id="promo_phone"
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
                className="flex-1 min-w-0 px-3 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
              />
            </div>
            {err && (
              <div
                className="flex items-center gap-2 text-xs text-danger mb-2"
                role="alert"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {err}
              </div>
            )}
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[52px] text-base shadow-sm"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  {copy.submitting}
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" aria-hidden="true" />
                  {copy.submit}
                </>
              )}
            </button>
            <p className="text-[11px] text-muted-foreground text-center mt-2 leading-snug">
              {copy.privacy}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
