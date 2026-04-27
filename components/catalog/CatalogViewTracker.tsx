"use client";

import { useEffect } from "react";
import { trackCatalogView } from "@/lib/gtag";

export default function CatalogViewTracker() {
  useEffect(() => { trackCatalogView(); }, []);
  return null;
}
