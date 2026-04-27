"use client";

import { useEffect } from "react";
import { trackProductView } from "@/lib/gtag";

interface Props {
  productId: number;
  title: string;
  priceEur: number;
}

/** Fires Meta ViewContent + Google event on product page load. */
export default function ProductViewTracker({ productId, title, priceEur }: Props) {
  useEffect(() => {
    trackProductView(productId, title, priceEur);
  }, [productId, title, priceEur]);

  return null;
}
