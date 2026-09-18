"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const locales = ["bg", "en", "ru", "ua"];

// Client component on purpose: reading `headers()` here dragged every route
// under /[locale] into Dynamic SSR (cache-control: no-store), because the
// not-found boundary is analysed together with the segment layout. The
// locale is derived from the URL instead.
export default function NotFound() {
  const pathname = usePathname();
  const first = pathname.split("/")[1];
  const locale = locales.includes(first) ? first : "bg";
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <h2 className="text-6xl font-bold text-primary mb-2">404</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Page not found
      </p>
      <Link
        href={`/${locale}`}
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
