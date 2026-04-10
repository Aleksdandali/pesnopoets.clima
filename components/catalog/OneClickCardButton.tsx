"use client";

import { useState } from "react";
import { Phone, Loader2, CheckCircle2, X } from "lucide-react";

interface OneClickCardButtonProps {
  locale: string;
  productId: number;
  productTitle: string;
}

const translations: Record<
  string,
  {
    title: string;
    placeholder: string;
    submit: string;
    success: string;
    required: string;
  }
> = {
  bg: {
    title: "Поръчай с 1 клик",
    placeholder: "+359 88 888 8888",
    submit: "Обади ми се",
    success: "Ще ви се обадим!",
    required: "Въведете телефон",
  },
  en: {
    title: "Order in 1 click",
    placeholder: "+359 88 888 8888",
    submit: "Call me",
    success: "We'll call you!",
    required: "Enter phone",
  },
  ru: {
    title: "Заказ в 1 клик",
    placeholder: "+359 88 888 8888",
    submit: "Позвоните",
    success: "Мы перезвоним!",
    required: "Введите телефон",
  },
  ua: {
    title: "Замовлення в 1 клік",
    placeholder: "+359 88 888 8888",
    submit: "Зателефонуйте",
    success: "Ми зателефонуємо!",
    required: "Введіть телефон",
  },
};

type Status = "idle" | "open" | "submitting" | "success" | "error";

export default function OneClickCardButton({
  locale,
  productId,
  productTitle,
}: OneClickCardButtonProps) {
  const t = translations[locale] || translations.bg;
  const [status, setStatus] = useState<Status>("idle");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!phone.trim() || phone.trim().length < 6) return;

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
          source: "one-click-card",
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("open"), 2000);
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex items-center gap-1.5 text-success text-xs font-medium px-2 py-1"
        onClick={(e) => e.preventDefault()}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        {t.success}
      </div>
    );
  }

  if (status === "open" || status === "submitting" || status === "error") {
    return (
      <div
        className="absolute inset-x-0 bottom-0 bg-white border-t border-border p-3 rounded-b-2xl shadow-[0_-4px_12px_rgb(0_0_0/0.08)] z-10"
      style={{ position: "absolute" }}
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground">
            {t.title}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setStatus("idle");
            }}
            className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.placeholder}
            maxLength={20}
            className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            autoFocus
            onClick={(e) => e.preventDefault()}
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            className="shrink-0 px-3 py-2.5 min-h-[44px] bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {status === "submitting" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              t.submit
            )}
          </button>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setStatus("open");
      }}
      className="w-11 h-11 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
      aria-label={t.title}
      title={t.title}
    >
      <Phone className="w-4 h-4" />
    </button>
  );
}
