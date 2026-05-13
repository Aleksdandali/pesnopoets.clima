"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Check, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { useInstall } from "@/contexts/InstallContext";
import { trackAddToCart } from "@/lib/gtag";

interface ProductBuyBoxProps {
  locale: string;
  /** Bittel API product price in EUR (clean, no install). */
  priceEur: number;
  /** Standard installation price in EUR for this BTU tier. */
  installEur: number;
  /** Promo "list price" before discount (EUR), if applicable. */
  promoListPriceEur?: number | null;
  /** Savings amount (EUR), shown next to the strike-through price. */
  savingsEur?: number | null;
  cartItem: Omit<CartItem, "quantity">;
  labels: {
    productOnly: string;
    installationPrice: string;
    addInstallToggle: string;
    addInstallNote: string;
    total: string;
    withInstallation: string;
    youSave: string;
    priceVat: string;
    addToCart: string;
    addedToCart: string;
    goToCart: string;
  };
}

/**
 * Conversion-focused price block + add-to-cart with installation toggle.
 *
 * UX contract:
 * - Default state: installation OFF — base Bittel price as primary headline.
 * - Toggle ON: total = base + install (in EUR), breakdown shown.
 * - Cart line carries `withInstallation` + `installEur` so checkout reflects choice.
 */
export default function ProductBuyBox({
  locale,
  priceEur,
  installEur,
  promoListPriceEur,
  savingsEur,
  cartItem,
  labels,
}: ProductBuyBoxProps) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const { withInstallation, setWithInstallation } = useInstall();
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = items.some((i) => i.id === cartItem.id);
  const showGoToCart = isInCart || justAdded;

  const totalEur = priceEur + (withInstallation ? installEur : 0);
  const fmt = (v: number) => Math.round(v).toLocaleString("bg-BG");

  function handleAddToCart() {
    if (showGoToCart) {
      router.push(`/${locale}/cart`);
      return;
    }
    addItem(
      {
        ...cartItem,
        withInstallation,
        installEur: withInstallation ? installEur : undefined,
      },
      1
    );
    setJustAdded(true);
    trackAddToCart(cartItem.id, cartItem.title, totalEur);
  }

  return (
    <div className="space-y-3 mb-4">
      {/* Price block */}
      <div className="bg-muted rounded-xl p-4 sm:p-5">
        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
          <span className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight tabular-nums">
            {fmt(totalEur)} €
          </span>
          {withInstallation && (
            <span className="text-xs sm:text-sm font-semibold text-emerald-600">
              {labels.withInstallation}
            </span>
          )}
          {promoListPriceEur && savingsEur && savingsEur > 0 && (
            <>
              <span className="text-sm sm:text-base line-through text-muted-foreground tabular-nums">
                {fmt(promoListPriceEur + (withInstallation ? installEur : 0))} €
              </span>
              <span className="text-xs sm:text-sm font-bold text-danger">
                {labels.youSave}: {fmt(savingsEur)} €
              </span>
            </>
          )}
        </div>

        {/* Breakdown only when install is on */}
        {withInstallation && (
          <div className="mt-2.5 pt-2.5 border-t border-border/50 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{labels.productOnly}</span>
              <span className="font-medium text-foreground tabular-nums">
                {fmt(priceEur)} €
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                {labels.installationPrice}
              </span>
              <span className="font-medium text-emerald-600 tabular-nums">
                +{fmt(installEur)} €
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">{labels.priceVat}</p>
      </div>

      {/* Installation toggle — large tap target, switch-style */}
      {installEur > 0 && (
        <button
          type="button"
          onClick={() => setWithInstallation(!withInstallation)}
          aria-pressed={withInstallation}
          className={`w-full flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border-2 transition-all text-left min-h-[64px] ${
            withInstallation
              ? "border-emerald-500 bg-emerald-50/60 hover:bg-emerald-50"
              : "border-border bg-white hover:border-emerald-300 hover:bg-muted/40"
          }`}
        >
          {/* Custom checkbox/switch */}
          <span
            className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-md border-2 shrink-0 transition-colors ${
              withInstallation
                ? "bg-emerald-600 border-emerald-600"
                : "bg-white border-muted-foreground/40"
            }`}
            aria-hidden="true"
          >
            {withInstallation && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                {labels.addInstallToggle}
              </span>
              <span
                className={`text-sm sm:text-base font-bold tabular-nums shrink-0 ${
                  withInstallation ? "text-emerald-600" : "text-foreground"
                }`}
              >
                +{fmt(installEur)} €
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">
              {labels.addInstallNote}
            </p>
          </div>
        </button>
      )}

      {/* Add-to-cart — primary CTA */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 min-h-[48px] ${
          showGoToCart
            ? "bg-success text-white hover:bg-success/90"
            : "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow-md"
        }`}
        aria-label={showGoToCart ? labels.goToCart : labels.addToCart}
      >
        {showGoToCart ? (
          <>
            <Check className="w-5 h-5" aria-hidden="true" />
            {labels.goToCart}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            {labels.addToCart}
          </>
        )}
      </button>
    </div>
  );
}
