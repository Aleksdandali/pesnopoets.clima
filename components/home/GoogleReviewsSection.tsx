import Image from "next/image";
import { Star } from "lucide-react";
import type { PlaceDetails } from "@/lib/google-reviews";
import { GBP_REVIEW_URL } from "@/lib/constants";

interface Labels {
  heading: string;
  subheading: string;
  basedOn: string; // "based on {count} Google reviews"
  viewAll: string;
  leaveReview: string;
  verifiedByGoogle: string;
}

interface Props {
  data: PlaceDetails;
  labels: Labels;
}

/**
 * Renders a "What our clients say on Google" section using live data from
 * Google Places API. Per Google ToS, we MUST preserve:
 *   - Author name
 *   - Author photo (if provided)
 *   - Link back to Google
 *   - Relative publish time as returned by Google (already localised)
 *
 * Component is a Server Component — `data` is fetched upstream by
 * `getGoogleReviews(locale)` and passed in. If the data is empty, render null.
 */
export default function GoogleReviewsSection({ data, labels }: Props) {
  if (!data || !data.reviews || data.reviews.length === 0) return null;

  // Display up to 3 best reviews on home; clients can "View all" on Google.
  const visible = data.reviews.slice(0, 3);
  const ratingFmt = data.rating ? data.rating.toFixed(1) : "—";

  return (
    <section
      aria-labelledby="google-reviews-heading"
      className="relative bg-gradient-to-b from-white to-muted/20 py-12 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-3">
            {/* Google "G" mark – use the official multi-color icon */}
            <GoogleGlyph className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
              {labels.verifiedByGoogle}
            </span>
          </div>
          <h2
            id="google-reviews-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground"
          >
            {labels.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            {labels.subheading}
          </p>

          {/* Rating summary */}
          <div className="mt-5 inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white shadow-sm border border-border">
            <span className="text-3xl font-extrabold tabular-nums text-foreground">
              {ratingFmt}
            </span>
            <div className="flex flex-col items-start">
              <Stars value={data.rating} />
              <span className="text-xs text-muted-foreground mt-0.5">
                {labels.basedOn.replace(
                  "{count}",
                  String(data.userRatingCount)
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {visible.map((r, i) => (
            <article
              key={`${r.author}-${i}`}
              className="flex flex-col bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <header className="flex items-center gap-3 mb-3">
                {r.authorPhotoUrl ? (
                  <Image
                    src={r.authorPhotoUrl}
                    alt={r.author}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover bg-muted"
                    // Google profile photos: don't optimize through Next /image proxy
                    unoptimized
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold"
                    aria-hidden="true"
                  >
                    {r.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {r.authorUrl ? (
                    <a
                      href={r.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-sm font-semibold text-foreground hover:text-primary truncate block"
                    >
                      {r.author}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-foreground truncate">
                      {r.author}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Stars value={r.rating} size="sm" />
                    {r.relativePublishTime && (
                      <span className="text-[11px] text-muted-foreground">
                        · {r.relativePublishTime}
                      </span>
                    )}
                  </div>
                </div>
                <GoogleGlyph className="w-4 h-4 shrink-0" aria-hidden="true" />
              </header>
              {r.text && (
                <p className="text-sm text-foreground/85 leading-relaxed line-clamp-6">
                  {r.text}
                </p>
              )}
            </article>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {data.googleMapsUrl && (
            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              <GoogleGlyph className="w-4 h-4" />
              {labels.viewAll}
            </a>
          )}
          <a
            href={GBP_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <Star className="w-4 h-4" aria-hidden="true" />
            {labels.leaveReview}
          </a>
        </div>
      </div>
    </section>
  );
}

function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const filled = Math.round(value);
  const px = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${px} ${
            i < filled
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground/40"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
