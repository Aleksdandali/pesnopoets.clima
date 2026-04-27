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

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") || "";
  const localeMap: Record<string, string> = {
    bg: "bg",
    en: "en",
    ru: "ru",
    uk: "ua",
  };

  const preferred = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().split("-")[0].toLowerCase())
    .find((lang) => localeMap[lang]);

  return preferred ? localeMap[preferred] || defaultLocale : defaultLocale;
}

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
    // Locale present — set html lang header for layout
    const response = NextResponse.next();
    response.headers.set("x-locale", pathnameLocale);
    return response;
  }

  // No locale in path — redirect to detected locale
  const detectedLocale = getLocaleFromHeaders(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${detectedLocale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
