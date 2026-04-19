"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check } from "lucide-react";
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
  const { addItem } = useCart();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  function handleDoubleTarget(e: React.MouseEvent) {
    // allow right-click / aux → go to cart
    if (e.detail === 2) {
      router.push(`/${locale}/cart`);
    }
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={(e) => {
          handleClick(e);
          handleDoubleTarget(e);
        }}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 min-h-[48px] ${
          justAdded
            ? "bg-success text-white"
            : "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow-md"
        } ${className}`}
        aria-label={justAdded ? addedLabel : label}
      >
        {justAdded ? (
          <>
            <Check className="w-5 h-5" aria-hidden="true" />
            {addedLabel}
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
        justAdded
          ? "bg-success text-white scale-105"
          : "bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white hover:scale-105"
      } ${className}`}
      aria-label={justAdded ? addedLabel : label}
      title={label}
    >
      {justAdded ? (
        <Check className="w-5 h-5" aria-hidden="true" />
      ) : (
        <ShoppingCart className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
