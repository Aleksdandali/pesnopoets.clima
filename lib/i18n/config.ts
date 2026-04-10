export const locales = ["bg", "en", "ru", "ua"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bg";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    bg: "Български",
    en: "English",
    ru: "Русский",
    ua: "Українська",
  };
  return names[locale];
}

export function getHtmlLang(locale: Locale): string {
  const map: Record<Locale, string> = {
    bg: "bg",
    en: "en",
    ru: "ru",
    ua: "uk",
  };
  return map[locale];
}
