import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

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
  "Gree",
  "Mitsubishi Heavy",
  "Mitsubishi",
  "AUX",
  "Toshiba",
  "Nippon",
  "HITACHI",
  "LG",
];

export default function Footer({ locale, dictionary }: FooterProps) {
  const t = dictionary.common;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0c1425] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5">
              <Image
                src="/logo.png"
                alt="Песнопоец Клима"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight leading-none">
                  Песнопоец
                </span>
                <span className="text-[10px] text-primary-light font-semibold tracking-widest uppercase leading-none mt-0.5">
                  Клима
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
            <ul className="space-y-3">
              {[
                { href: `/${locale}`, label: t.nav.home },
                { href: `/${locale}/klimatici`, label: t.nav.catalog },
                { href: `/${locale}/brands`, label: t.nav.brands },
                { href: `/${locale}/za-nas`, label: t.nav.about },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
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
              {locale === "bg"
                ? "Марки"
                : locale === "ru"
                  ? "Бренды"
                  : locale === "ua"
                    ? "Бренди"
                    : "Brands"}
            </h3>
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link
                    href={`/${locale}/klimatici?brand=${encodeURIComponent(brand)}`}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200"
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
            <ul className="space-y-3.5">
              <li>
                <a
                  href="mailto:info@clima.bg"
                  className="flex items-center gap-2.5 text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 shrink-0 text-white/30" />
                  <span>info@clima.bg</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/50">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-white/30" />
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
        <div className="mt-14 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {year} {t.siteName}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/privacy`}
              className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href={`/${locale}/terms`}
              className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
