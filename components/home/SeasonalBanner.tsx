import Link from "next/link";
import { Clock, Flame, Snowflake } from "lucide-react";

interface SeasonalBannerProps {
  locale: string;
  labels: {
    peak: string;
    slots: string;
    heating: string;
    offSeason: string;
    cta: string;
  };
}

function getSeasonConfig(month: number) {
  // May-August: peak cooling season
  if (month >= 4 && month <= 7) {
    return { type: "peak" as const, slots: 6, icon: Flame };
  }
  // Nov-Feb: heating season
  if (month >= 10 || month <= 1) {
    return { type: "heating" as const, slots: 8, icon: Snowflake };
  }
  // Mar-Apr, Sep-Oct: off-season
  return { type: "offSeason" as const, slots: 12, icon: Clock };
}

export default function SeasonalBanner({ locale, labels }: SeasonalBannerProps) {
  const month = new Date().getMonth(); // 0-indexed
  const config = getSeasonConfig(month);
  const Icon = config.icon;

  const message = config.type === "peak"
    ? labels.peak
    : config.type === "heating"
    ? labels.heating
    : labels.offSeason;

  const slotsText = labels.slots.replace("{count}", String(config.slots));

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-center">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 shrink-0 animate-pulse" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-semibold">{message}</span>
        </div>
        <span className="hidden sm:inline text-white/60">•</span>
        <span className="text-xs sm:text-sm font-medium text-white/90">{slotsText}</span>
        <Link
          href={`/${locale}/inquiry`}
          className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full hover:bg-white/30 transition-colors border border-white/30"
        >
          {labels.cta} →
        </Link>
      </div>
    </div>
  );
}
