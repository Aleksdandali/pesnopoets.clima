"use client";

import { useState } from "react";
import { Phone, Loader2, CheckCircle2, AlertCircle, Clock, ShieldCheck, BadgeCheck } from "lucide-react";
import { trackInquirySubmit } from "@/lib/gtag";

interface QuickOrderFormProps {
  locale: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const t: Record<
  string,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successText: string;
    error: string;
    requiredName: string;
    requiredPhone: string;
    legal: string;
    perks: { icon: "clock" | "shield" | "badge"; text: string }[];
  }
> = {
  bg: {
    eyebrow: "Бърза заявка",
    title: "Обаждаме се в 10 минути",
    subtitle: "Оставете телефон — специалист ще ви се обади да уточни обем, да даде ориентировъчна цена и да предложи дата за монтаж. Без ангажимент.",
    nameLabel: "Име",
    namePlaceholder: "Вашето име",
    phoneLabel: "Телефон",
    phonePlaceholder: "+359 88 888 8888",
    submit: "Обадете ми се",
    submitting: "Изпращане...",
    successTitle: "Заявката е приета",
    successText: "Ще ви се обадим в рамките на 10 минути в работно време (Пон–Съб).",
    error: "Възникна грешка. Опитайте отново или ни позвънете.",
    requiredName: "Въведете име",
    requiredPhone: "Въведете телефон",
    legal: "С изпращането се съгласявате с обработка на данните за връзка с вас.",
    perks: [
      { icon: "clock", text: "Отговор в 10 минути" },
      { icon: "shield", text: "Без ангажимент" },
      { icon: "badge", text: "Безплатна консултация" },
    ],
  },
  en: {
    eyebrow: "Quick request",
    title: "We call back in 10 minutes",
    subtitle: "Leave your phone — a specialist will call to clarify the job, give an estimate, and suggest an install date. No commitment.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    phoneLabel: "Phone",
    phonePlaceholder: "+359 88 888 8888",
    submit: "Call me",
    submitting: "Sending...",
    successTitle: "Request received",
    successText: "We'll call you within 10 minutes during working hours (Mon–Sat).",
    error: "Something went wrong. Try again or call us.",
    requiredName: "Enter a name",
    requiredPhone: "Enter a phone",
    legal: "By submitting you agree to processing of your contact data.",
    perks: [
      { icon: "clock", text: "10-minute callback" },
      { icon: "shield", text: "No commitment" },
      { icon: "badge", text: "Free consultation" },
    ],
  },
  ru: {
    eyebrow: "Быстрая заявка",
    title: "Перезвоним за 10 минут",
    subtitle: "Оставьте телефон — специалист позвонит, уточнит объём работ, назовёт ориентировочную цену и предложит дату монтажа. Без обязательств.",
    nameLabel: "Имя",
    namePlaceholder: "Ваше имя",
    phoneLabel: "Телефон",
    phonePlaceholder: "+359 88 888 8888",
    submit: "Перезвоните мне",
    submitting: "Отправка...",
    successTitle: "Заявка принята",
    successText: "Перезвоним в течение 10 минут в рабочее время (Пн–Сб).",
    error: "Что-то пошло не так. Попробуйте ещё раз или позвоните нам.",
    requiredName: "Введите имя",
    requiredPhone: "Введите телефон",
    legal: "Отправляя заявку, вы соглашаетесь на обработку контактных данных.",
    perks: [
      { icon: "clock", text: "Ответ за 10 минут" },
      { icon: "shield", text: "Без обязательств" },
      { icon: "badge", text: "Бесплатная консультация" },
    ],
  },
  ua: {
    eyebrow: "Швидка заявка",
    title: "Передзвонимо за 10 хвилин",
    subtitle: "Залиште телефон — спеціаліст зателефонує, уточнить обсяг робіт, назве орієнтовну ціну та запропонує дату монтажу. Без зобов'язань.",
    nameLabel: "Ім'я",
    namePlaceholder: "Ваше ім'я",
    phoneLabel: "Телефон",
    phonePlaceholder: "+359 88 888 8888",
    submit: "Зателефонуйте мені",
    submitting: "Надсилання...",
    successTitle: "Заявку прийнято",
    successText: "Зателефонуємо протягом 10 хвилин у робочий час (Пн–Сб).",
    error: "Щось пішло не так. Спробуйте ще раз або зателефонуйте нам.",
    requiredName: "Введіть ім'я",
    requiredPhone: "Введіть телефон",
    legal: "Надсилаючи заявку, ви погоджуєтесь на обробку контактних даних.",
    perks: [
      { icon: "clock", text: "Відповідь за 10 хвилин" },
      { icon: "shield", text: "Без зобов'язань" },
      { icon: "badge", text: "Безкоштовна консультація" },
    ],
  },
};

const perkIcon = {
  clock: Clock,
  shield: ShieldCheck,
  badge: BadgeCheck,
};

export default function QuickOrderForm({ locale }: QuickOrderFormProps) {
  const L = t[locale] || t.bg;
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trap, setTrap] = useState(""); // honeypot
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: { name?: string; phone?: string } = {};
    if (name.trim().length < 2) next.name = L.requiredName;
    if (phone.trim().length < 6) next.phone = L.requiredPhone;
    setErrors(next);
    if (next.name || next.phone) return;
    if (trap) {
      // honeypot — silently succeed for bots
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          locale,
          source: "quick-order-home",
        }),
      });
      if (!res.ok) throw new Error("Failed");
      trackInquirySubmit("quick-order-home");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="bg-gradient-to-b from-white to-[#f0f9ff]/40 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: copy + perks */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/[0.08] border border-primary/15 rounded-full mb-4">
              <Phone className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">{L.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-foreground leading-tight">
              {L.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              {L.subtitle}
            </p>
            <ul className="mt-5 sm:mt-6 flex flex-wrap gap-2.5 sm:gap-3">
              {L.perks.map((p) => {
                const Icon = perkIcon[p.icon];
                return (
                  <li
                    key={p.text}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border/70 rounded-full text-xs sm:text-sm text-foreground/80 shadow-[0_1px_2px_rgb(0_0_0/0.03)]"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    {p.text}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: form */}
          <div className="relative">
            {/* Subtle gradient ring */}
            <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/25 via-accent/15 to-transparent rounded-3xl blur-sm opacity-70" aria-hidden="true" />
            <div className="relative bg-white border border-border/60 rounded-2xl shadow-[0_10px_40px_rgb(2_132_199/0.08)] p-5 sm:p-7">
              {status === "success" ? (
                <div className="text-center py-6" role="status" aria-live="polite">
                  <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{L.successTitle}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">{L.successText}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={trap}
                    onChange={(e) => setTrap(e.target.value)}
                    className="absolute -left-[9999px] opacity-0"
                    aria-hidden="true"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="qo-name" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                        {L.nameLabel}
                      </label>
                      <input
                        id="qo-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                        }}
                        placeholder={L.namePlaceholder}
                        maxLength={100}
                        autoComplete="name"
                        className="w-full px-3.5 py-3 text-sm border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors min-h-[44px]"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "qo-name-err" : undefined}
                      />
                      {errors.name && (
                        <p id="qo-name-err" role="alert" className="mt-1 text-xs text-danger">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="qo-phone" className="block text-xs font-semibold text-foreground/80 mb-1.5">
                        {L.phoneLabel}
                      </label>
                      <input
                        id="qo-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
                        }}
                        placeholder={L.phonePlaceholder}
                        maxLength={20}
                        autoComplete="tel"
                        inputMode="tel"
                        className="w-full px-3.5 py-3 text-sm border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors min-h-[44px]"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? "qo-phone-err" : undefined}
                      />
                      {errors.phone && (
                        <p id="qo-phone-err" role="alert" className="mt-1 text-xs text-danger">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_20px_rgb(2_132_199/0.25)] hover:-translate-y-0.5 min-h-[48px] text-sm sm:text-base"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        {L.submitting}
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        {L.submit}
                      </>
                    )}
                  </button>

                  {status === "error" && (
                    <div className="flex items-center gap-2 mt-3 text-danger text-xs" role="alert">
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {L.error}
                    </div>
                  )}

                  <p className="mt-3 text-[11px] text-muted-foreground/80 leading-relaxed">{L.legal}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
