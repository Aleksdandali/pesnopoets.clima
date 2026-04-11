import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  locale: string;
  dictionary: {
    common: {
      siteName: string;
      siteNameFirst: string;
      siteNameSecond: string;
      country: string;
      nav: {
        home: string;
        catalog: string;
        brands: string;
        about: string;
        contact: string;
      };
      footer: {
        description: string;
        quickLinks: string;
        contactUs: string;
        rights: string;
        privacy: string;
        terms: string;
        brands?: string;
      };
      deliveryBanner?: string;
    };
  };
}

const PHONE_NUMBER = "+359 888 123 456";
const EMAIL = "info@pesnopoets-clima.com";

const brands = [
  "Daikin",
  "Gree",
  "Mitsubishi Heavy",
  "Mitsubishi",
  "AUX",
  "Toshiba",
  "Nippon",
  "HITACHI",
  "LG",
];

const dealerLine: Record<string, string> = {
  bg: "Официален дилър на Daikin, Mitsubishi, Toshiba и Gree в България",
  en: "Authorized dealer of Daikin, Mitsubishi, Toshiba and Gree in Bulgaria",
  ru: "Официальный дилер Daikin, Mitsubishi, Toshiba и Gree в Болгарии",
  ua: "Офіційний дилер Daikin, Mitsubishi, Toshiba та Gree в Болгарії",
};

export default function Footer({ locale, dictionary }: FooterProps) {
  const t = dictionary.common;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c1425] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5">
              <Image
                src="/logo.png"
                alt={t.siteName}
                width={40}
                height={40}
                className="rounded-lg"
                loading="lazy"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight leading-none">
                  {t.siteNameFirst}
                </span>
                <span className="text-[10px] text-primary-light font-semibold tracking-widest uppercase leading-none mt-0.5">
                  {t.siteNameSecond}
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-[0.15em] mb-5">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-1">
              {[
                { href: `/${locale}`, label: t.nav.home },
                { href: `/${locale}/klimatici`, label: t.nav.catalog },
                { href: `/${locale}/brands`, label: t.nav.brands },
                { href: `/${locale}/za-nas`, label: t.nav.about },
                { href: `/${locale}/kontakti`, label: t.nav.contact },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block text-sm text-white/50 hover:text-white transition-colors duration-200 py-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-[0.15em] mb-5">
              {t.footer.brands || t.nav.brands}
            </h3>
            <ul className="space-y-1">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/${locale}/klimatici?brand=${encodeURIComponent(brand)}`}
                    className="block text-sm text-white/50 hover:text-white transition-colors duration-200 py-2"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white/90 uppercase tracking-[0.15em] mb-5">
              {t.footer.contactUs}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors duration-200 py-2"
                  aria-label={`${t.footer.contactUs}: ${PHONE_NUMBER}`}
                >
                  <Phone className="w-4 h-4 shrink-0 text-white/30" />
                  <span>{PHONE_NUMBER}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors duration-200 py-2"
                  aria-label={`Email: ${EMAIL}`}
                >
                  <Mail className="w-4 h-4 shrink-0 text-white/30" />
                  <span className="break-all">{EMAIL}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/50 py-2">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/30" aria-hidden="true" />
                  <span>{t.country}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Dealer trust line */}
        <div className="mt-12 sm:mt-14 pt-6 border-t border-white/8 text-center">
          <p className="text-xs sm:text-sm text-white/40 leading-relaxed">{dealerLine[locale] || dealerLine.bg}</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Copyright — left on desktop, centered on mobile */}
          <p className="text-xs text-white/30 text-center sm:text-left">
            &copy; {year} {t.siteName}. {t.footer.rights}
          </p>

          {/* Privacy + Terms — center row */}
          <div className="flex items-center gap-5">
            <Link
              href={`/${locale}/privacy`}
              className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 py-2"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200 py-2"
            >
              {t.footer.terms}
            </Link>
          </div>

          {/* DANGROW badge — right on desktop, centered on mobile */}
          <a
            href="https://dangrow.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full hover:bg-white/[0.07] transition-colors"
          >
            <svg viewBox="0 0 64 64" width="13" height="13" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="#CCFF00"/>
              <path d="M21 44 L32 20 L43 44" stroke="#06060A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="32" y1="20" x2="32" y2="14" stroke="#06060A" strokeWidth="5" strokeLinecap="round"/>
              <line x1="27" y1="18" x2="32" y2="14" stroke="#06060A" strokeWidth="4" strokeLinecap="round"/>
              <line x1="37" y1="18" x2="32" y2="14" stroke="#06060A" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] text-white/35">powered by</span>
            <span className="text-[10px] font-extrabold text-white tracking-wide">DAN<span className="text-[#CCFF00]">GROW</span></span>
          </a>
        </div>
      </div>
    </footer>
  );
}
