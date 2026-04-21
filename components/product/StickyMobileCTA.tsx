"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Check, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";

interface StickyMobileCTAProps {
  locale: string;
  priceEUR: string;
  phoneNumber: string;
  cartItem: Omit<CartItem, "quantity">;
  labels: {
    call: string;
    buy: string;
    added: string;
    eur: string;
  };
}

/**
 * Mobile-only bottom sticky CTA.
 * Hierarchy: Price → Call (secondary) → Buy / Add-to-cart (primary).
 * Second tap on "Buy" after item is added navigates to the cart for checkout.
 */
export default function StickyMobileCTA({
  locale,
  priceEUR,
  phoneNumber,
  cartItem,
  labels,
}: StickyMobileCTAProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  // Tell floating WA/Viber buttons to lift above this bar (on mobile).
  useEffect(() => {
    document.body.setAttribute("data-sticky-cta", "true");
    return () => document.body.removeAttribute("data-sticky-cta");
  }, []);

  function handleBuy() {
    if (justAdded) {
      router.push(`/${locale}/cart`);
      return;
    }
    addItem(cartItem, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden" data-sticky-mobile-cta>
      <div className="bg-white/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgb(0_0_0/0.08)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
          {/* Price: EUR */}
          <div className="flex-1 min-w-0 flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-extrabold text-foreground tabular-nums">
              {priceEUR} {labels.eur}
            </span>
          </div>

          {/* Call button — min 44px tap target */}
          <a
            href={`tel:${phoneNumber.replace(/\s/g, "")}`}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 min-h-[44px] min-w-[44px] border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
            aria-label={labels.call}
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{labels.call}</span>
          </a>

          {/* Buy / Add-to-cart — primary */}
          <button
            type="button"
            onClick={handleBuy}
            aria-label={justAdded ? labels.added : labels.buy}
            className={`flex items-center justify-center gap-1.5 px-4 sm:px-5 min-h-[44px] text-sm font-semibold rounded-xl transition-colors shadow-sm ${
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
