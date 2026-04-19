"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface HeaderCartBadgeProps {
  locale: string;
  label: string;
}

export default function HeaderCartBadge({ locale, label }: HeaderCartBadgeProps) {
  const { itemCount, hydrated } = useCart();
  const showCount = hydrated && itemCount > 0;

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
      aria-label={`${label}${showCount ? ` (${itemCount})` : ""}`}
    >
      <ShoppingCart className="w-5 h-5" aria-hidden="true" />
      {showCount && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center leading-none ring-2 ring-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
