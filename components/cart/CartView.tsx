"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { EUR_TO_BGN } from "@/lib/pricing";

interface CartViewProps {
  locale: string;
  dictionary: {
    cart: {
      pageTitle: string;
      empty: string;
      emptyDesc: string;
      browseCatalog: string;
      quantity: string;
      remove: string;
      item: string;
      items: string;
      subtotal: string;
      includesInstallation: string;
      checkout: string;
      continueShopping: string;
      clear: string;
      decrease?: string;
      increase?: string;
      clearConfirm?: string;
    };
    common: {
      currency: { bgn: string };
    };
  };
}

function t(locale: string, bg: string, en: string, ru: string, ua: string): string {
  return locale === "en" ? en : locale === "ru" ? ru : locale === "ua" ? ua : bg;
}

function formatBgn(eur: number, label: string): string {
  return `${(eur * EUR_TO_BGN).toFixed(0)} ${label}`;
}

export default function CartView({ locale, dictionary }: CartViewProps) {
  const { items, itemCount, subtotalEur, updateQuantity, removeItem, clear, hydrated } =
    useCart();
  const d = dictionary.cart;
  const bgnLabel = dictionary.common.currency.bgn;

  const decreaseLabel = d.decrease || t(locale, "Намали количеството", "Decrease quantity", "Уменьшить количество", "Зменшити кількість");
  const increaseLabel = d.increase || t(locale, "Увеличи количеството", "Increase quantity", "Увеличить количество", "Збільшити кількість");

  if (!hydrated) {
    return <div className="py-12 text-center text-muted-foreground">...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-border/60 rounded-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light/60 rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{d.empty}</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{d.emptyDesc}</p>
        <Link
          href={`/${locale}/klimatici`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[48px]"
        >
          {d.browseCatalog}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* SR-only live region — announces cart changes */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {itemCount} {itemCount === 1 ? d.item : d.items} · {formatBgn(subtotalEur, bgnLabel)}
      </div>

      {/* Items list */}
      <div className="lg:col-span-2 space-y-3">
        <ul className="space-y-3 list-none" aria-label={d.pageTitle}>
        {items.map((item) => (
          <li key={item.id}>
          <article
            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-border/60 rounded-xl"
            aria-label={`${item.manufacturer} ${item.title}`}
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#fafbfc] rounded-lg shrink-0 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <p className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                {item.manufacturer}
              </p>
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-auto">
                <Link
                  href={`/${locale}/klimatici/${item.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              </h3>
              <div className="flex items-center justify-between gap-2 sm:gap-3 mt-3 flex-wrap">
                {/* Quantity — 44px hit target */}
                <div className="inline-flex items-center border border-border rounded-xl overflow-hidden" role="group" aria-label={`${d.quantity}: ${item.title}`}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label={`${decreaseLabel}: ${item.title}`}
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    className="min-w-[2.25rem] text-center text-sm font-semibold tabular-nums"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label={`${increaseLabel}: ${item.title}`}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {/* Price */}
                <div className="text-right">
                  <p className="text-sm sm:text-base font-extrabold text-foreground tabular-nums">
                    {formatBgn(item.priceEur * item.quantity, bgnLabel)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-[10px] text-muted-foreground tabular-nums">
                      {formatBgn(item.priceEur, bgnLabel)} × {item.quantity}
                    </p>
                  )}
                </div>
                {/* Remove — 44px hit target */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger-light rounded-xl transition-colors"
                  aria-label={`${d.remove}: ${item.title}`}
                  title={d.remove}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
          </li>
        ))}
        </ul>

        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/${locale}/klimatici`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            ← {d.continueShopping}
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm((d.clearConfirm || d.clear) + "?")) clear();
            }}
            className="text-sm text-muted-foreground hover:text-danger transition-colors py-2 min-h-[44px]"
          >
            {d.clear}
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 h-fit" aria-label={d.subtotal}>
        <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
          <p className="text-sm text-muted-foreground mb-1">
            {itemCount} {itemCount === 1 ? d.item : d.items}
          </p>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-semibold text-foreground">{d.subtotal}</span>
            <span className="text-2xl font-extrabold text-foreground tabular-nums">
              {formatBgn(subtotalEur, bgnLabel)}
            </span>
          </div>
          <div className="mb-5" />
          <Link
            href={`/${locale}/checkout`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[48px]"
          >
            {d.checkout}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
