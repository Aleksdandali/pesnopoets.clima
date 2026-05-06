/**
 * Central business constants — edit in ONE place.
 * Avoid hardcoding phone/email anywhere else in the codebase.
 */

export const BUSINESS_PHONE_DISPLAY = "+359 87 799 8795";
export const BUSINESS_PHONE_TEL = "+359877998795"; // for tel: links
export const BUSINESS_EMAIL = "pesnopoetsklima@gmail.com";

// Address — must EXACTLY match Google Business Profile (NAP consistency).
// GBP submitted in Bulgarian; we mirror that for citation matching.
export const BUSINESS_STREET = "ул. Хисарлъка 6";
export const BUSINESS_ADDRESS_CITY = "Варна";
export const BUSINESS_ADDRESS_REGION = "Варненска област";
export const BUSINESS_POSTAL_CODE = "9000";
export const BUSINESS_COUNTRY = "BG";

// Geo coordinates (centroid for Varna; refine after GBP verification reveals exact pin).
export const BUSINESS_LAT = 43.2141;
export const BUSINESS_LNG = 27.9147;

/** Viber & WhatsApp deep links derived from BUSINESS_PHONE_TEL. */
export const WHATSAPP_URL = `https://wa.me/${BUSINESS_PHONE_TEL.replace(/^\+/, "")}`;
export const VIBER_URL = `viber://chat?number=${encodeURIComponent(BUSINESS_PHONE_TEL)}`;

/** Social profiles. */
export const INSTAGRAM_URL = "https://www.instagram.com/pesnopoets.klima/";
export const INSTAGRAM_HANDLE = "@pesnopoets.klima";
