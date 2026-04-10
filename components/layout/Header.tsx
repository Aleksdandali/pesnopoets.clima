"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Phone, ChevronDown, Globe } from "lucide-react";

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
    };
  };
}

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
  const t = dictionary.common;

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/klimatici`, label: t.nav.catalog },
    { href: `/${locale}/brands`, label: t.nav.brands },
    { href: `/${locale}/za-nas`, label: t.nav.about },
    { href: `/${locale}/kontakti`, label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9 text-sm">
          <a
            href="tel:+359000000000"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.phone || "+359 XX XXX XXXX"}</span>
          </a>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{localeLabels[locale]}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border py-1 min-w-[140px] z-50">
                  {Object.entries(localeNames).map(([code, name]) => (
                    <Link
                      key={code}
                      href={`/${code}`}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        code === locale
                          ? "bg-primary-light text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setLangMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              {t.siteName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile menu button */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/inquiry`}
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
            >
              {locale === "bg"
                ? "Запитване"
                : locale === "ru"
                  ? "Запрос"
                  : locale === "ua"
                    ? "Запит"
                    : "Inquiry"}
            </Link>
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <nav className="flex flex-col pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/inquiry`}
                className="mx-4 mt-3 text-center px-5 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-dark transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {locale === "bg"
                  ? "Запитване"
                  : locale === "ru"
                    ? "Запрос"
                    : locale === "ua"
                      ? "Запит"
                      : "Inquiry"}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
