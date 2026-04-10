"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Globe } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const t = dictionary.common;

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl shadow-[0_1px_3px_0_rgb(0_0_0/0.04)]"
          : "bg-white/95 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <Image
              src="/logo.png"
              alt="Песнопоец Клима"
              width={44}
              height={44}
              className="rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-foreground tracking-tight leading-none">
                Песнопоец
              </span>
              <span className="text-[10px] text-primary font-semibold tracking-widest uppercase leading-none mt-0.5">
                Клима
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
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
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span>{localeLabels[locale]}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    langMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-border/80 py-1.5 min-w-[160px] z-50">
                  {Object.entries(localeNames).map(([code, name]) => (
                    <Link
                      key={code}
                      href={`/${code}`}
                      className={`block px-4 py-2.5 text-sm transition-colors ${
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
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/${locale}/inquiry`}
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {locale === "bg"
                ? "Запитване"
                : locale === "ru"
                  ? "Запрос"
                  : locale === "ua"
                    ? "Запит"
                    : "Inquiry"}
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col pb-5 pt-2 border-t border-border/60">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/${locale}/inquiry`}
              className="mx-4 mt-3 text-center px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary-dark transition-colors"
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
      </div>
    </header>
  );
}
