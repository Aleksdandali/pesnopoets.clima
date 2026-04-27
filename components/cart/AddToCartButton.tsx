"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, ArrowRight } from "lucide-react";
import { useCart, type CartItem } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  locale: string;
  item: Omit<CartItem, "quantity">;
  label: string;
  addedLabel: string;
  className?: string;
  variant?: "icon" | "full";
}

export default function AddToCartButton({
  locale,
  item,
  label,
  addedLabel,
  className = "",
  variant = "icon",
}: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const isInCart = items.some((i) => i.id === item.id);
  const [justAdded, setJustAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isInCart || justAdded) {
      router.push(`/${locale}/cart`);
      return;
    }

    addItem(item, 1);
    setJustAdded(true);
  }

  const showGoToCart = isInCart || justAdded;

  const goToCartLabel: Record<string, string> = {
    bg: "Към количката",
    en: "Go to cart",
    ru: "В корзину",
    ua: "До кошика",
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 min-h-[48px] ${
          showGoToCart
            ? "bg-success text-white hover:bg-success/90"
            : "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow-md"
        } ${className}`}
        aria-label={showGoToCart ? (goToCartLabel[locale] || goToCartLabel.bg) : label}
      >
        {showGoToCart ? (
          <>
            <Check className="w-5 h-5" aria-hidden="true" />
            {goToCartLabel[locale] || goToCartLabel.bg}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" aria-hidden="true" />
            {label}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center w-11 h-11 rounded-full shadow-md transition-all duration-200 ${
        showGoToCart
          ? "bg-success text-white scale-105"
          : "bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white hover:scale-105"
      } ${className}`}
      aria-label={showGoToCart ? (goToCartLabel[locale] || goToCartLabel.bg) : label}
      title={showGoToCart ? (goToCartLabel[locale] || goToCartLabel.bg) : label}
    >
      {showGoToCart ? (
        <Check className="w-5 h-5" aria-hidden="true" />
      ) : (
        <ShoppingCart className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
