"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Re-fires fbq('track', 'PageView') on every client-side SPA navigation.
 * The initial PageView is handled by the server-rendered TrackingPixels script.
 */
export default function MetaPixelPageView() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip the first render — server already fired PageView
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (fbq) {
      fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
