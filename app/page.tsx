import { redirect } from "next/navigation";
import { headers } from "next/headers";

const localeMap: Record<string, string> = {
  bg: "bg",
  en: "en",
  ru: "ru",
  uk: "ua",
  ua: "ua",
};

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  // Parse Accept-Language to find best matching locale
  const preferred = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().split("-")[0].toLowerCase())
    .find((lang) => localeMap[lang]);

  const locale = preferred ? localeMap[preferred] : "bg";
  redirect(`/${locale}`);
}
