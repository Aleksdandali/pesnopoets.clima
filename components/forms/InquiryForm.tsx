"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
      submitting: string;
      success: string;
      successMessage: string;
      error: string;
      errorMessage: string;
      privacy: string;
      required: string;
    };
  };
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function InquiryForm({
  locale,
  productId,
  productTitle,
  dictionary,
}: InquiryFormProps) {
  const t = dictionary.inquiry;
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const data = {
      name: (form.get("name") as string)?.trim(),
      phone: (form.get("phone") as string)?.trim(),
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
      <div className="text-center py-10 px-6">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">{t.success}</h3>
        <p className="text-muted-foreground">{t.successMessage}</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-primary hover:underline"
        >
          {locale === "bg"
            ? "Изпрати ново запитване"
            : locale === "ru"
              ? "Отправить новый запрос"
              : locale === "ua"
                ? "Надіслати новий запит"
                : "Send another inquiry"}
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
            {locale === "bg"
              ? "Запитване за:"
              : locale === "ru"
                ? "Запрос на:"
                : locale === "ua"
                  ? "Запит на:"
                  : "Inquiry for:"}
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
          className={`w-full px-4 py-3 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            errors.name ? "border-danger" : "border-border"
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-danger">{errors.name}</p>
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
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder={t.phonePlaceholder}
          required
          maxLength={20}
          className={`w-full px-4 py-3 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            errors.phone ? "border-danger" : "border-border"
          }`}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-danger">{errors.phone}</p>
        )}
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
          className="w-full px-4 py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
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
          className="w-full px-4 py-3 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-ring transition-colors resize-none"
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <div className="flex items-center gap-2 bg-danger-light text-danger rounded-lg p-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {t.errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            {t.submit}
          </>
        )}
      </button>

      {/* Privacy notice */}
      <p className="text-xs text-muted-foreground text-center">{t.privacy}</p>
    </form>
  );
}
