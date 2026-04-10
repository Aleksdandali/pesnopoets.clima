"use client";

import { useState } from "react";
import { Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
    submit: "Обадете ми се",
    submitting: "Изпращане...",
    success: "Ще ви се обадим скоро!",
    error: "Грешка. Опитайте отново.",
    required: "Въведете телефонен номер",
  },
  en: {
    title: "Order in 1 click",
    subtitle: "Enter phone and we'll call you",
    placeholder: "+359 88 888 8888",
    submit: "Call me",
    submitting: "Sending...",
    success: "We'll call you soon!",
    error: "Error. Please try again.",
    required: "Enter a phone number",
  },
  ru: {
    title: "Заказ в 1 клик",
    subtitle: "Введите телефон и мы вам перезвоним",
    placeholder: "+359 88 888 8888",
    submit: "Позвоните мне",
    submitting: "Отправка...",
    success: "Мы вам скоро перезвоним!",
    error: "Ошибка. Попробуйте снова.",
    required: "Введите номер телефона",
  },
  ua: {
    title: "Замовлення в 1 клік",
    subtitle: "Введіть телефон і ми вам зателефонуємо",
    placeholder: "+359 88 888 8888",
    submit: "Зателефонуйте мені",
    submitting: "Надсилання...",
    success: "Ми вам скоро зателефонуємо!",
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
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary rounded-xl p-5 sm:p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-white mx-auto mb-2" />
        <p className="text-white font-semibold text-lg">{t.success}</p>
      </div>
    );
  }

  return (
    <div className="bg-primary rounded-xl p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Phone className="w-5 h-5 text-white" />
        <h3 className="text-base sm:text-lg font-bold text-white">{t.title}</h3>
      </div>
      <p className="text-primary-foreground/80 text-sm mb-4">{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            placeholder={t.placeholder}
            maxLength={20}
            className="w-full px-4 py-3 text-sm border-2 border-white/20 rounded-lg bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors min-h-[44px]"
            aria-label={t.title}
          />
          {error && <p className="mt-1 text-xs text-white/90">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm min-h-[48px]"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.submitting}
            </>
          ) : (
            <>
              <Phone className="w-4 h-4" />
              {t.submit}
            </>
          )}
        </button>
      </form>

      {status === "error" && (
        <div className="flex items-center gap-2 mt-3 text-white/90 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {t.error}
        </div>
      )}
    </div>
  );
}
