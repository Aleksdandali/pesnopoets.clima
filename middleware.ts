import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["bg", "en", "ru", "ua"];
const defaultLocale = "bg";

// Paths that should NOT be locale-prefixed
const publicPaths = [
  "/api",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/admin",
  "/tg",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Skip static files
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // Check if locale is already in path
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    // Locale present — let the request through unmodified. We used to set
    // an `x-locale` REQUEST header so the root layout could read it via
    // `headers()`, but (a) that call put every route into Dynamic SSR
    // (no-store), and (b) modifying request headers in middleware via
    // `NextResponse.next({ request })` itself disables response caching.
    // The root layout no longer reads any request data, and not-found.tsx
    // falls back to "bg" if the header is missing.
    return NextResponse.next();
  }

  // No locale in path — permanently redirect to default locale (Bulgarian).
  // 308 (vs 307) signals canonicalization to Google. We deliberately do NOT
  // detect Accept-Language here: Google Search Central explicitly recommends
  // against content-negotiation redirects for localized versions, and the
  // resulting unstable canonical signal was causing /bg to be flagged as
  // "Duplicate, Google chose different canonical than user" in GSC.
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
