import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bittel.bg",
        pathname: "/web/img/**",
      },
      {
        protocol: "https",
        hostname: "dealers.bittel.bg",
        pathname: "/web/files/**",
      },
      {
        protocol: "https",
        hostname: "gzdcbkrtpbqcugqgrqut.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
  async redirects() {
    // Legacy category URLs (pre-2026 structure, still linked from external
    // sites and in Google's index as 404s per GSC 2026-09-18) → current
    // category landing pages. Locale-aware via :locale(bg|en|ru|ua).
    const locale = ":locale(bg|en|ru|ua)";
    const legacyCategories: Array<[string, string]> = [
      ["/klimatici/invertorni-klimatitsi/:rest*", "/klimatici/inverter"],
      ["/klimatici/invertorni-multisplit-sistemi/:rest*", "/klimatici/multisplit"],
      ["/klimatici/termopompi/:rest*", "/klimatici/termopompa"],
      ["/klimatici/profesionalni-sistemi/kanalen-tip", "/klimatici/kanalen"],
      ["/klimatici/profesionalni-sistemi/kasetachen-tip", "/klimatici/kasetachen"],
      ["/klimatici/profesionalni-sistemi/kolonni-klimatitsi", "/klimatici/kolonen"],
      ["/klimatici/profesionalni-sistemi/:rest*", "/klimatici"],
      ["/klimatici/aksesoari/:rest*", "/klimatici"],
    ];
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.pesnopoets-clima.com" }],
        destination: "https://pesnopoets-clima.com/:path*",
        permanent: true,
      },
      ...legacyCategories.map(([from, to]) => ({
        source: `/${locale}${from}`,
        destination: `/:locale${to}`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      {
        // Telegram Mini App: allow iframe from Telegram only
        source: "/tg/:path*",
        headers: [
          ...securityHeaders,
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org" },
        ],
      },
      {
        // All other routes: block iframes
        source: "/((?!tg/).*)",
        headers: [
          ...securityHeaders,
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
