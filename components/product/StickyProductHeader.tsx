"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";

interface StickyProductHeaderProps {
  locale: string;
  title: string;
  priceEUR: string;
  cartItem: Omit<CartItem, "quantity">;
  labels: {
    buy: string;          // "Купи" / "Buy"
    added: string;        // "Добавено" / "Added"
    inquiry: string;      // "Запитване" / "Inquiry"
    eur: string;
  };
}

/**
 * Top sticky header that slides in after the user scrolls past the main price block.
 *
 * Hierarchy (intentional):
 *   Primary  → "Купи" (adds to cart; second click → /cart)
 *   Secondary → "Заявка" (scrolls to inquiry form on-page)
 *
 * Matches the visual prominence of competitor sticky bars (e.g. bittel.bg's red КУПИ)
 * while staying honest to our MVP: "Купи" = add to cart → full checkout-style inquiry
 * (no direct payment yet).
 */
export default function StickyProductHeader({
  locale,
  title,
  priceEUR,
  cartItem,
  labels,
}: StickyProductHeaderProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 520);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleBuy() {
    if (justAdded) {
      // Second click — go to cart for checkout
      router.push(`/${locale}/cart`);
      return;
    }
    addItem(cartItem, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  }

  function scrollToInquiry() {
    const el =
      document.getElementById("inquiry-form-section-mobile") ||
      document.getElementById("inquiry-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstField = el.querySelector<HTMLElement>("input,textarea,select,button");
      if (firstField) {
        setTimeout(() => firstField.focus({ preventScroll: true }), 400);
      }
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="bg-white/95 backdrop-blur-xl border-b border-border shadow-[0_2px_12px_rgb(0_0_0/0.06)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3">
          {/* Title — hidden on very narrow screens to keep price + buttons visible */}
          <p className="hidden sm:block flex-1 min-w-0 text-sm font-semibold text-foreground truncate">
            {title}
          </p>

          {/* Price — always visible; on mobile it's the main info element */}
          <div className="flex items-baseline leading-tight shrink-0 flex-1 sm:flex-none min-w-0">
            <span className="text-sm sm:text-base font-extrabold text-foreground tabular-nums whitespace-nowrap">
              {priceEUR} {labels.eur}
            </span>
          </div>

          {/* Secondary: Inquiry (text/ghost on desktop, icon hidden on very narrow) */}
          <button
            type="button"
            onClick={scrollToInquiry}
            tabIndex={visible ? 0 : -1}
            className="hidden sm:inline-flex shrink-0 items-center justify-center px-3 min-h-[40px] text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {labels.inquiry}
          </button>

          {/* Primary: Buy / Add to cart */}
          <button
            type="button"
            onClick={handleBuy}
            tabIndex={visible ? 0 : -1}
            aria-label={justAdded ? labels.added : labels.buy}
            className={`shrink-0 inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 min-h-[40px] text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm ${
              justAdded
                ? "bg-success text-white"
                : "bg-primary text-primary-foreground hover:bg-primary-dark"
            }`}
          >
            {justAdded ? (
              <Check className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{justAdded ? labels.added : labels.buy}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
