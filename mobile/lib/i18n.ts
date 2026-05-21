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
 *
 * Generic over the dict shape so callers can pass an `as const` object
 * (TS 5.x infers literal types per entry, which would conflict with
 * `Record<Locale, T>` if T were inferred from one entry).
 */
export function t<D extends Record<Locale, unknown>>(
  dict: D,
  locale: Locale,
): D[Locale] {
  return dict[locale] ?? dict[defaultLocale];
}
