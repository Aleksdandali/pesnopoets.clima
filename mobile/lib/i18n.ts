/**
 * Minimal i18n for mobile. BG primary, RU for the Varna diaspora.
 * EN/UA can be added once the BG/RU app is stable in production.
 */

export const locales = ["bg", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "bg";

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Resolve a translation map keyed by locale. Falls back to BG.
 */
export function t<T>(dict: Record<Locale, T>, locale: Locale): T {
  return dict[locale] ?? dict[defaultLocale];
}
