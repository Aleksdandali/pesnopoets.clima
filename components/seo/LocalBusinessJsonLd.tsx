import {
  BUSINESS_ADDRESS_CITY,
  BUSINESS_ADDRESS_REGION,
  BUSINESS_COUNTRY,
  BUSINESS_EMAIL,
  BUSINESS_LAT,
  BUSINESS_LNG,
  BUSINESS_PHONE_TEL,
  BUSINESS_POSTAL_CODE,
  BUSINESS_STREET,
  INSTAGRAM_URL,
} from "@/lib/constants";

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
      streetAddress: BUSINESS_STREET,
      addressLocality: BUSINESS_ADDRESS_CITY,
      addressRegion: BUSINESS_ADDRESS_REGION,
      postalCode: BUSINESS_POSTAL_CODE,
      addressCountry: BUSINESS_COUNTRY,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_LAT,
      longitude: BUSINESS_LNG,
    },
    areaServed: [
      { "@type": "City", name: "Варна" },
      { "@type": "City", name: "Девня" },
      { "@type": "City", name: "Аксаково" },
      { "@type": "City", name: "Белослав" },
      { "@type": "AdministrativeArea", name: "Варненска област" },
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
    sameAs: [INSTAGRAM_URL, "https://www.wikidata.org/wiki/Q139819378"],
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
