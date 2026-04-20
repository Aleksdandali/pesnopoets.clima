import { BUSINESS_EMAIL, BUSINESS_PHONE_TEL, INSTAGRAM_URL } from "@/lib/constants";

interface LocalBusinessJsonLdProps {
  locale: string;
  siteUrl: string;
  siteName: string;
  description: string;
}

/**
 * HVACBusiness + LocalBusiness structured data for the Varna area.
 * Rendered into the document head via a server-component <script> tag.
 */
export default function LocalBusinessJsonLd({
  locale,
  siteUrl,
  siteName,
  description,
}: LocalBusinessJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HVACBusiness"],
    "@id": `${siteUrl}/#business`,
    name: siteName,
    description,
    url: `${siteUrl}/${locale}`,
    telephone: BUSINESS_PHONE_TEL,
    email: BUSINESS_EMAIL,
    priceRange: "€€",
    image: `${siteUrl}/logo.png`,
    logo: `${siteUrl}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Varna, 1",
      addressLocality: "Varna",
      addressRegion: "Varna",
      postalCode: "9000",
      addressCountry: "BG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 43.2141,
      longitude: 27.9147,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Varna",
      },
      {
        "@type": "AdministrativeArea",
        name: "Varna Province",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    sameAs: [INSTAGRAM_URL],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Air conditioner installation",
          areaServed: { "@type": "City", name: "Varna" },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AC maintenance & repair",
          areaServed: { "@type": "City", name: "Varna" },
        },
      },
    ],
    brand: [
      { "@type": "Brand", name: "Daikin" },
      { "@type": "Brand", name: "Mitsubishi" },
      { "@type": "Brand", name: "Gree" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is fully controlled server-side (no user input) — safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
