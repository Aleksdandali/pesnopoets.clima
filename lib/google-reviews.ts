/**
 * Google Places API (New) integration — live reviews + aggregate rating.
 *
 * Per Google ToS:
 *   - Max cache window 30 days for ratings, but we choose 24h for freshness.
 *   - Reviews returned are 5 most recent / most relevant.
 *   - Author name + photo + link to Google MUST be preserved when displayed.
 *
 * Env required (server-only — NOT NEXT_PUBLIC):
 *   GOOGLE_PLACES_API_KEY   — restricted to Places API + HTTP referrer
 *   GOOGLE_PLACE_ID         — canonical Place ID (ChIJ…), find via
 *                              https://developers.google.com/maps/documentation/places/web-service/place-id
 *
 * If either env var is missing, this module returns null and the consumer
 * gracefully degrades (section hidden, JSON-LD aggregateRating omitted).
 */

export interface GoogleReview {
  author: string;
  authorPhotoUrl: string | null;
  authorUrl: string | null;
  rating: number;
  text: string;
  publishTime: string; // ISO
  relativePublishTime: string; // localized "2 weeks ago"
}

export interface PlaceDetails {
  rating: number;
  userRatingCount: number;
  googleMapsUrl: string;
  reviews: GoogleReview[];
}

const PLACE_ID = process.env.GOOGLE_PLACE_ID || "";
const API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";

const FIELD_MASK = [
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "reviews.authorAttribution",
  "reviews.rating",
  "reviews.text",
  "reviews.originalText",
  "reviews.publishTime",
  "reviews.relativePublishTimeDescription",
].join(",");

/**
 * Static fallback — captured manually from the live GBP profile on 2026-05-25.
 * Used when Places API env vars are not configured (free-tier path, no card).
 *
 * Refresh procedure: when new reviews come in, ask Claude to re-read
 *   https://www.google.com/maps?cid=14106443697488425758
 * and rebuild this constant. Place ID for live API: ChIJ2bQLqy4ecyoRHnPYwM0nxMM.
 */
const STATIC_PLACE: PlaceDetails = {
  rating: 5.0,
  userRatingCount: 4,
  googleMapsUrl: "https://www.google.com/maps?cid=14106443697488425758",
  reviews: [
    {
      author: "Arie Lev Khaimzon",
      authorPhotoUrl:
        "https://lh3.googleusercontent.com/a-/ALV-UjXNkrbcDSNz-GNgypzZzasnBJxb0jdERjqwW9JP2YeG5b4-WN11=w72-h72-p-rp-mo-br100",
      authorUrl:
        "https://www.google.com/maps/contrib/114407625007435184572/reviews?hl=bg",
      rating: 5,
      text: "Поръчахме климатик. Хазяинът започна да има проблеми с монтажа му. Случайно открихме Pesnopoets онлайн. Договорихме се за цена и Дима дойде предния ден, провери условията и огледа апартамента. Днес той пристигна с необходимите инструменти и материали. По време на монтажа възникна неочакван и непредвиден проблем. Дима го реши експертно и ефикасно. След работата в апартамента не остана нито грам мръсотия или прах. Дима беше възпитан и приятен за разговор, така че двата часа минаха без никакъв стрес.",
      publishTime: "2026-05-21T00:00:00Z",
      relativePublishTime: "",
    },
    {
      author: "ВЛАД VLAD",
      authorPhotoUrl:
        "https://lh3.googleusercontent.com/a/ACg8ocKtshyBfqY9_cKbc4oBvkwseKGVP1jVE0DT5_ewjdCz0qvVJw=w72-h72-p-rp-mo-br100",
      authorUrl:
        "https://www.google.com/maps/contrib/116992312341094740282/reviews?hl=bg",
      rating: 5,
      text: "Само положителни впечатления. Откликнаха много бързо на заявката ми, избраха необходимото оборудване и също толкова бързо завършиха монтажа. Когато работата приключи, апартаментът беше безупречно чист, сякаш никой никога не е бил в него. Ориентацията към клиента е на 5+, качеството на работа е на 5+, културата на производство е на 5+. Заключение: Горещо ги препоръчвам!!!",
      publishTime: "2026-05-23T00:00:00Z",
      relativePublishTime: "",
    },
    {
      author: "Даниил Муйдинов",
      authorPhotoUrl:
        "https://lh3.googleusercontent.com/a-/ALV-UjWEmgDbsfwUXejU4eFw5BDe0NQEslf_EmzObKCT9ZGcoh2ktf5d=w72-h72-p-rp-mo-ba2-br100",
      authorUrl:
        "https://www.google.com/maps/contrib/114902467105182377015/reviews?hl=bg",
      rating: 5,
      text: "Поръчах почистване и съм доволен. Препоръчвам го.",
      publishTime: "2026-05-24T00:00:00Z",
      relativePublishTime: "",
    },
    // 4th review is rating-only (Димитър Пукалев, 5★, no text) — counted in
    // aggregate but not surfaced as a card.
  ],
};

export async function getGoogleReviews(
  locale: string = "bg"
): Promise<PlaceDetails | null> {
  // Fallback to manually captured reviews when API not configured.
  if (!API_KEY || !PLACE_ID) return STATIC_PLACE;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=${locale}`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": FIELD_MASK,
        },
        // ISR — refresh every 24h to stay within Google ToS and minimise quota.
        next: { revalidate: 86400, tags: ["google-reviews"] },
      }
    );

    if (!res.ok) {
      console.error(`[google-reviews] HTTP ${res.status}`, await res.text());
      return null;
    }

    const json = await res.json();

    return {
      rating: typeof json.rating === "number" ? json.rating : 0,
      userRatingCount:
        typeof json.userRatingCount === "number" ? json.userRatingCount : 0,
      googleMapsUrl: json.googleMapsUri || "",
      reviews: Array.isArray(json.reviews)
        ? json.reviews.map((r: Record<string, unknown>) => {
            const attr = (r.authorAttribution || {}) as Record<string, string>;
            const text = (r.text || r.originalText || {}) as Record<
              string,
              string
            >;
            return {
              author: attr.displayName || "Google клиент",
              authorPhotoUrl: attr.photoUri || null,
              authorUrl: attr.uri || null,
              rating: typeof r.rating === "number" ? r.rating : 5,
              text: text.text || "",
              publishTime: (r.publishTime as string) || "",
              relativePublishTime:
                (r.relativePublishTimeDescription as string) || "",
            };
          })
        : [],
    };
  } catch (e) {
    console.error("[google-reviews] fetch failed", e);
    return null;
  }
}
