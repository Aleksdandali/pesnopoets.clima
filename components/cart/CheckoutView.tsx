"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { EUR_TO_BGN } from "@/lib/pricing";

type Status = "idle" | "submitting" | "success" | "error";

interface CheckoutViewProps {
  locale: string;
  dictionary: {
    checkout: {
      yourOrder: string;
      customerData: string;
      name: string;
      namePlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      comment: string;
      commentPlaceholder: string;
      noPaymentNotice: string;
      submit: string;
      submitting: string;
      successTitle: string;
      successDesc: string;
      newInquiry: string;
      error: string;
      total: string;
      items: string;
    };
    cart: {
      empty: string;
      emptyDesc: string;
      browseCatalog: string;
      includesInstallation: string;
    };
    common: {
      currency: { bgn: string };
    };
  };
}

function formatBgn(eur: number, label: string): string {
  return `${(eur * EUR_TO_BGN).toFixed(0)} ${label}`;
}

export default function CheckoutView({ locale, dictionary }: CheckoutViewProps) {
  const { items, itemCount, subtotalEur, clear, hydrated } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", comment: "" });
  const t = dictionary.checkout;
  const bgnLabel = dictionary.common.currency.bgn;

  // Redirect if cart empty (only after hydration)
  useEffect(() => {
    if (hydrated && items.length === 0 && status === "idle") {
      // don't redirect if success (we already emptied it)
    }
  }, [hydrated, items.length, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const response = await fetch("/api/cart-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || null,
          comment: form.comment || null,
          locale,
          items: items.map((i) => ({
            id: i.id,
            title: i.title,
            manufacturer: i.manufacturer,
            quantity: i.quantity,
            priceEur: i.priceEur,
            priceBgn: Math.round(i.priceEur * EUR_TO_BGN),
            btu: i.btu,
          })),
          subtotalBgn: Math.round(subtotalEur * EUR_TO_BGN),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || t.error);
      }

      clear();
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : t.error);
      setStatus("error");
    }
  }

  if (!hydrated) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div
        className="text-center py-16 bg-white border border-border/60 rounded-2xl max-w-xl mx-auto"
        role="status"
        aria-live="polite"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-success-light rounded-full mb-4">
          <CheckCircle2 className="w-8 h-8 text-success" aria-hidden="true" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{t.successTitle}</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{t.successDesc}</p>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          {dictionary.cart.browseCatalog}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-border/60 rounded-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light/60 rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{dictionary.cart.empty}</h2>
        <p className="text-sm text-muted-foreground mb-6">{dictionary.cart.emptyDesc}</p>
        <Link
          href={`/${locale}/klimatici`}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/${locale}/klimatici`);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          {dictionary.cart.browseCatalog}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const isSubmitting = status === "submitting";
  const isError = status === "error";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8"
      noValidate
      aria-busy={isSubmitting}
    >
      {/* Form */}
      <div className="lg:col-span-3 bg-white border border-border rounded-2xl p-5 sm:p-7">
        <h2 className="text-lg font-bold text-foreground mb-4">{t.customerData}</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="checkout-name" className="block text-sm font-medium text-foreground mb-1.5">
              {t.name} <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="checkout-name"
              type="text"
              required
              aria-required="true"
              aria-invalid={isError && !form.name ? "true" : undefined}
              minLength={2}
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t.namePlaceholder}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="checkout-phone" className="block text-sm font-medium text-foreground mb-1.5">
              {t.phone} <span className="text-danger" aria-hidden="true">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              required
              aria-required="true"
              aria-invalid={isError && !form.phone ? "true" : undefined}
              aria-describedby="checkout-phone-hint"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t.phonePlaceholder}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              autoComplete="tel"
              inputMode="tel"
              pattern="[+0-9 ()\-]{7,}"
            />
            <p id="checkout-phone-hint" className="mt-1 text-[11px] text-muted-foreground">
              {t.phonePlaceholder}
            </p>
          </div>

          <div>
            <label htmlFor="checkout-email" className="block text-sm font-medium text-foreground mb-1.5">
              {t.email}
            </label>
            <input
              id="checkout-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t.emailPlaceholder}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div>
            <label htmlFor="checkout-comment" className="block text-sm font-medium text-foreground mb-1.5">
              {t.comment}
            </label>
            <textarea
              id="checkout-comment"
              rows={3}
              maxLength={1000}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder={t.commentPlaceholder}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
            />
          </div>
        </div>

        {/* No-payment notice */}
        <div className="mt-5 flex items-start gap-3 p-4 bg-primary-light/60 border border-primary/20 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-foreground leading-relaxed">{t.noPaymentNotice}</p>
        </div>

        {isError && (
          <div
            className="mt-4 flex items-start gap-3 p-4 bg-danger-light border border-danger/30 rounded-xl"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-danger">{errorMsg || t.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[48px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              {t.submitting}
            </>
          ) : (
            <>
              {t.submit}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {/* Order summary */}
      <aside className="lg:col-span-2">
        <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-foreground mb-4">{t.yourOrder}</h2>
          <ul className="space-y-3 mb-5 pb-5 border-b border-border">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-foreground line-clamp-2">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.quantity} × {formatBgn(item.priceEur, bgnLabel)}
                  </p>
                </div>
                <span className="font-semibold whitespace-nowrap text-foreground">
                  {formatBgn(item.priceEur * item.quantity, bgnLabel)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-semibold text-foreground">{t.total}</span>
            <span className="text-2xl font-extrabold text-foreground">
              {formatBgn(subtotalEur, bgnLabel)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {itemCount} × {dictionary.cart.includesInstallation.toLowerCase()}
          </p>
        </div>
      </aside>
    </form>
  );
}
