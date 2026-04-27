"use client";

import { useState } from "react";
import { Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { trackInquirySubmit } from "@/lib/gtag";

interface OneClickOrderProps {
  locale: string;
  productId: number;
  productTitle: string;
}

const translations: Record<
  string,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    phoneLabel: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    required: string;
  }
> = {
  bg: {
    title: "Поръчай с 1 клик",
    subtitle: "Въведете телефон и ние ще ви се обадим",
    placeholder: "+359 88 888 8888",
    phoneLabel: "Телефонен номер",
    submit: "Обадете ми се",
    submitting: "Изпращане...",
    success: "Ще ви се обадим скоро за",
    error: "Грешка. Опитайте отново.",
    required: "Въведете телефонен номер",
  },
  en: {
    title: "Order in 1 click",
    subtitle: "Enter phone and we'll call you",
    placeholder: "+359 88 888 8888",
    phoneLabel: "Phone number",
    submit: "Call me",
    submitting: "Sending...",
    success: "We'll call you soon about",
    error: "Error. Please try again.",
    required: "Enter a phone number",
  },
  ru: {
    title: "Заказ в 1 клик",
    subtitle: "Введите телефон и мы вам перезвоним",
    placeholder: "+359 88 888 8888",
    phoneLabel: "Номер телефона",
    submit: "Позвоните мне",
    submitting: "Отправка...",
    success: "Мы вам скоро перезвоним по",
    error: "Ошибка. Попробуйте снова.",
    required: "Введите номер телефона",
  },
  ua: {
    title: "Замовлення в 1 клік",
    subtitle: "Введіть телефон і ми вам зателефонуємо",
    placeholder: "+359 88 888 8888",
    phoneLabel: "Номер телефону",
    submit: "Зателефонуйте мені",
    submitting: "Надсилання...",
    success: "Ми вам скоро зателефонуємо щодо",
    error: "Помилка. Спробуйте ще раз.",
    required: "Введіть номер телефону",
  },
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function OneClickOrder({
  locale,
  productId,
  productTitle,
}: OneClickOrderProps) {
  const t = translations[locale] || translations.bg;
  const [status, setStatus] = useState<FormStatus>("idle");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!phone.trim() || phone.trim().length < 6) {
      setError(t.required);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "1-click order",
          phone: phone.trim(),
          product_id: productId,
          locale,
          source: "one-click",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      trackInquirySubmit("one-click");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary rounded-xl p-5 sm:p-6 text-center" role="status" aria-live="polite">
        <CheckCircle2 className="w-10 h-10 text-white mx-auto mb-2" aria-hidden="true" />
        <p className="text-white font-semibold text-lg">{t.success}</p>
        <p className="text-white/80 text-sm mt-1">{productTitle}</p>
      </div>
    );
  }

  const hasError = !!error;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 sm:p-5 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm sm:text-base font-bold text-foreground">{t.title}</h3>
      </div>
      <p className="text-muted-foreground text-xs sm:text-sm mb-3">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="oneclick-phone" className="sr-only">
            {t.phoneLabel}
          </label>
          <input
            id="oneclick-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            placeholder={t.placeholder}
            maxLength={20}
            className="w-full px-4 py-2.5 text-sm border border-border rounded-lg bg-white text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors min-h-[44px]"
            aria-invalid={hasError}
            aria-describedby={hasError ? "oneclick-phone-error" : undefined}
          />
          {hasError && (
            <p id="oneclick-phone-error" role="alert" className="mt-1 text-xs text-danger">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm min-h-[44px] text-sm"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              {t.submitting}
            </>
          ) : (
            <>
              <Phone className="w-4 h-4" aria-hidden="true" />
              {t.submit}
            </>
          )}
        </button>
      </form>

      {status === "error" && (
        <div className="flex items-center gap-2 mt-2 text-danger text-sm" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {t.error}
        </div>
      )}
    </div>
  );
}
