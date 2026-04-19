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
    };
    common: {
      currency: { bgn: string };
    };
  };
}

function formatBgn(eur: number, label: string): string {
  return `${(eur * EUR_TO_BGN).toFixed(0)} ${label}`;
}

export default function CartView({ locale, dictionary }: CartViewProps) {
  const { items, itemCount, subtotalEur, updateQuantity, removeItem, clear, hydrated } =
    useCart();
  const t = dictionary.cart;
  const bgnLabel = dictionary.common.currency.bgn;

  if (!hydrated) {
    return <div className="py-12 text-center text-muted-foreground">...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-border/60 rounded-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light/60 rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">{t.empty}</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">{t.emptyDesc}</p>
        <Link
          href={`/${locale}/klimatici`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors"
        >
          {t.browseCatalog}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Items list */}
      <div className="lg:col-span-2 space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-border/60 rounded-xl"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#fafbfc] rounded-lg shrink-0 overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
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
              <Link
                href={`/${locale}/klimatici/${item.slug}`}
                className="text-sm font-semibold text-foreground hover:text-primary line-clamp-2 mb-auto"
              >
                {item.title}
              </Link>
              <div className="flex items-center justify-between gap-3 mt-2">
                {/* Quantity */}
                <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted"
                    aria-label="-"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted"
                    aria-label="+"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Price */}
                <div className="text-right">
                  <p className="text-sm sm:text-base font-extrabold text-foreground">
                    {formatBgn(item.priceEur * item.quantity, bgnLabel)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-[10px] text-muted-foreground">
                      {formatBgn(item.priceEur, bgnLabel)} × {item.quantity}
                    </p>
                  )}
                </div>
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-danger hover:bg-danger-light rounded-lg transition-colors"
                  aria-label={t.remove}
                  title={t.remove}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        ))}

        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/${locale}/klimatici`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {t.continueShopping}
          </Link>
          <button
            type="button"
            onClick={() => {
              if (confirm(t.clear + "?")) clear();
            }}
            className="text-sm text-muted-foreground hover:text-danger transition-colors"
          >
            {t.clear}
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="bg-white border border-border rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgb(0_0_0/0.04)]">
          <p className="text-sm text-muted-foreground mb-1">
            {itemCount} {itemCount === 1 ? t.item : t.items}
          </p>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-semibold text-foreground">{t.subtotal}</span>
            <span className="text-2xl font-extrabold text-foreground">
              {formatBgn(subtotalEur, bgnLabel)}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-5">{t.includesInstallation}</p>
          <Link
            href={`/${locale}/checkout`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[48px]"
          >
            {t.checkout}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
