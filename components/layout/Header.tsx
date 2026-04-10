"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Globe, Phone } from "lucide-react";

interface HeaderProps {
  locale: string;
  dictionary: {
    common: {
      nav: {
        home: string;
        catalog: string;
        brands: string;
        about: string;
        contact: string;
      };
      siteName: string;
      phone: string;
      inquiry?: string;
      callUs?: string;
      deliveryBanner?: string;
    };
  };
}

const PHONE_NUMBER = "+359 888 123 456";

const localeLabels: Record<string, string> = {
  bg: "BG",
  en: "EN",
  ru: "RU",
  ua: "UA",
};

const localeNames: Record<string, string> = {
  bg: "Български",
  en: "English",
  ru: "Русский",
  ua: "Українська",
};

export default function Header({ locale, dictionary }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const t = dictionary.common;

  const callLabel = t.callUs || "Call us";
  const inquiryLabel = t.inquiry || "Inquiry";
  const deliveryBanner = t.deliveryBanner || "Delivery and installation across Bulgaria";

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/klimatici`, label: t.nav.catalog },
    { href: `/${locale}/brands`, label: t.nav.brands },
    { href: `/${locale}/za-nas`, label: t.nav.about },
    { href: `/${locale}/kontakti`, label: t.nav.contact },
  ];

  return (
    <header>
      {/* Top bar with phone — desktop only */}
      <div className="hidden lg:block bg-[#0c1425] text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <p className="text-xs text-white/50">
            {deliveryBanner}
          </p>
          <a
            href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors font-medium"
            aria-label={`${callLabel}: ${PHONE_NUMBER}`}
          >
            <Phone className="w-3 h-3" aria-hidden="true" />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]"
            : "bg-white/95 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[64px] sm:h-[72px]">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 sm:gap-2.5 shrink-0 group"
              aria-label={t.siteName}
            >
              <Image
                src="/logo.png"
                alt={t.siteName}
                width={44}
                height={44}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-foreground tracking-tight leading-none">
                  Песнопоец
                </span>
                <span className="text-[10px] text-primary font-semibold tracking-widest uppercase leading-none mt-0.5">
                  Клима
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: lang + CTA + mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Phone link — visible on mobile as icon, 44px tap target */}
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="lg:hidden flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                aria-label={callLabel}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
              </a>

              {/* Language switcher */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 min-w-[44px] min-h-[44px] px-2 sm:px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                  aria-label="Change language"
                  aria-expanded={langMenuOpen}
                  aria-haspopup="true"
                >
                  <Globe className="w-4 h-4" aria-hidden="true" />
                  <span>{localeLabels[locale]}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      langMenuOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {langMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-border/80 py-1.5 min-w-[160px] z-50" role="menu">
                    {Object.entries(localeNames).map(([code, name]) => (
                      <Link
                        key={code}
                        href={`/${code}`}
                        className={`block px-4 py-3 text-sm transition-colors ${
                          code === locale
                            ? "bg-primary-light text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setLangMenuOpen(false)}
                        role="menuitem"
                      >
                        {name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                href={`/${locale}/inquiry`}
                className="hidden sm:inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {inquiryLabel}
              </Link>

              {/* Mobile menu button — 44px tap target */}
              <button
                className="lg:hidden flex items-center justify-center w-11 h-11 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Menu className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col pb-5 pt-2 border-t border-border/60" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3.5 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Call us button in mobile menu */}
              <a
                href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`}
                className="mx-4 mt-3 flex items-center justify-center gap-2 px-5 py-3.5 border border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-colors min-h-[48px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                {callLabel}: {PHONE_NUMBER}
              </a>

              <Link
                href={`/${locale}/inquiry`}
                className="mx-4 mt-2 text-center px-5 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors min-h-[48px] flex items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {inquiryLabel}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
