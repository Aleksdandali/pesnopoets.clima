"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface InquiryFormProps {
  locale: string;
  productId?: number;
  productTitle?: string;
  dictionary: {
    inquiry: {
      title: string;
      subtitle: string;
      name: string;
      namePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      phoneHelper?: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      successMessage: string;
      successNext?: string;
      error: string;
      errorMessage: string;
      privacy: string;
      required: string;
    };
    common?: {
      inquiryFor?: string;
      sendAnother?: string;
    };
  };
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const reassurance: Record<string, string> = {
  bg: "Без ангажимент. Ще ви се обадим в рамките на 1 час.",
  en: "No commitment. We'll call you within 1 hour.",
  ru: "Без обязательств. Перезвоним в течение 1 часа.",
  ua: "Без зобов'язань. Зателефонуємо протягом 1 години.",
};

export default function InquiryForm({
  locale,
  productId,
  productTitle,
  dictionary,
}: InquiryFormProps) {
  const t = dictionary.inquiry;
  const c = dictionary.common;
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const rawPhone = (form.get("phone") as string)?.trim() || "";
    const data = {
      name: (form.get("name") as string)?.trim(),
      phone: rawPhone ? `+359 ${rawPhone}`.trim() : "",
      email: (form.get("email") as string)?.trim(),
      message: (form.get("message") as string)?.trim(),
      product_id: productId,
      locale,
    };

    // Client-side validation
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = t.required;
    if (!data.phone) newErrors.phone = t.required;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Submission failed");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8 sm:py-10 px-4 sm:px-6">
        <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-success mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{t.success}</h3>
        <p className="text-sm sm:text-base text-muted-foreground">{t.successMessage}</p>
        {t.successNext && (
          <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-4 text-left">
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
            <p>{t.successNext}</p>
          </div>
        )}
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-primary hover:underline py-2"
        >
          {c?.sendAnother || "Send another inquiry"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Product context */}
      {productTitle && (
        <div className="bg-primary-light rounded-lg p-3 text-sm text-primary-dark">
          <span className="font-medium">
            {c?.inquiryFor || "Inquiry for:"}
          </span>{" "}
          {productTitle}
        </div>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {t.name} <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder={t.namePlaceholder}
          required
          maxLength={100}
          autoComplete="name"
          className={`w-full px-4 py-3 text-base sm:text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors min-h-[48px] ${
            errors.name ? "border-danger" : "border-border"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-danger" role="alert">{errors.name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {t.phone} <span className="text-danger">*</span>
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
            type="tel"
            id="phone"
            name="phone"
            placeholder="88 123 4567"
            required
            maxLength={20}
            autoComplete="tel-national"
            inputMode="tel"
            pattern="[0-9 ()\-]{7,}"
            onInput={(e) => {
              const el = e.currentTarget;
              // Strip any accidental +359 / 00359 / leading 0 so we never double-prefix
              const clean = el.value.replace(/^\+?359\s?/, "").replace(/^0+/, "");
              if (clean !== el.value) el.value = clean;
            }}
            className="flex-1 min-w-0 px-4 py-3 text-base sm:text-sm bg-transparent focus:outline-none min-h-[48px]"
          />
        </div>
        {errors.phone ? (
          <p className="mt-1 text-xs text-danger" role="alert">{errors.phone}</p>
        ) : t.phoneHelper ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{t.phoneHelper}</p>
        ) : null}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {t.email}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder={t.emailPlaceholder}
          maxLength={200}
          autoComplete="email"
          className="w-full px-4 py-3 text-base sm:text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors min-h-[48px]"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t.messagePlaceholder}
          maxLength={1000}
          className="w-full px-4 py-3 text-base sm:text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <div className="flex items-center gap-2 bg-danger-light text-danger rounded-lg p-3 text-sm" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          {t.errorMessage}
        </div>
      )}

      {/* Submit — 48px height on mobile */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm min-h-[48px] text-base sm:text-sm"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {t.submitting}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.submit}
          </>
        )}
      </button>

      {/* Reassurance + Privacy notice */}
      <p className="text-xs text-muted-foreground text-center font-medium">{reassurance[locale] || reassurance.bg}</p>
      <p className="text-xs text-muted-foreground text-center">{t.privacy}</p>
    </form>
  );
}
