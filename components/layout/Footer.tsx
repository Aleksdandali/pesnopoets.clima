import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  locale: string;
  dictionary: {
    common: {
      siteName: string;
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
      };
    };
  };
}

const brands = [
  "Daikin",
  "Mitsubishi Electric",
  "Toshiba",
  "Nippon",
  "Carmen",
  "Panasonic",
];

export default function Footer({ locale, dictionary }: FooterProps) {
  const t = dictionary.common;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t.siteName}
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: `/${locale}`, label: t.nav.home },
                { href: `/${locale}/klimatici`, label: t.nav.catalog },
                { href: `/${locale}/brands`, label: t.nav.brands },
                { href: `/${locale}/za-nas`, label: t.nav.about },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {locale === "bg"
                ? "Марки"
                : locale === "ru"
                  ? "Бренды"
                  : locale === "ua"
                    ? "Бренди"
                    : "Brands"}
            </h3>
            <ul className="space-y-2.5">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/${locale}/brands/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t.footer.contactUs}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+359000000000"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>+359 XX XXX XXXX</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@clima.bg"
                  className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>info@clima.bg</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/60">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {locale === "bg"
                      ? "България"
                      : locale === "ru"
                        ? "Болгария"
                        : locale === "ua"
                          ? "Болгарія"
                          : "Bulgaria"}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {year} {t.siteName}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/privacy`}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
