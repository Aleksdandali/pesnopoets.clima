/**
 * Central business constants — edit in ONE place.
 * Avoid hardcoding phone/email anywhere else in the codebase.
 */

export const BUSINESS_PHONE_DISPLAY = "+359 888 123 456";
export const BUSINESS_PHONE_TEL = "+359888123456"; // for tel: links
export const BUSINESS_EMAIL = "info@pesnopoets-clima.com";
export const BUSINESS_ADDRESS_CITY = "Varna";
export const BUSINESS_ADDRESS_REGION = "Varna Province";
export const BUSINESS_COUNTRY = "BG";

/** Viber & WhatsApp deep links derived from BUSINESS_PHONE_TEL. */
export const WHATSAPP_URL = `https://wa.me/${BUSINESS_PHONE_TEL.replace(/^\+/, "")}`;
export const VIBER_URL = `viber://chat?number=${encodeURIComponent(BUSINESS_PHONE_TEL)}`;

/** Social profiles. */
export const INSTAGRAM_URL = "https://www.instagram.com/pesnopoets.klima/";
export const INSTAGRAM_HANDLE = "@pesnopoets.klima";
