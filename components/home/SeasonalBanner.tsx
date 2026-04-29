import Link from "next/link";
import { CalendarClock, Flame, Snowflake } from "lucide-react";

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
  // month is 0-indexed: 0=Jan, 3=Apr, 4=May, 7=Aug
  // Apr-Aug (3-7): peak cooling season — installations booming
  if (month >= 3 && month <= 7) {
    return { type: "peak" as const, freeDates: 4, icon: Flame };
  }
  // Nov-Feb (10-1): heating season
  if (month >= 10 || month <= 1) {
    return { type: "heating" as const, freeDates: 8, icon: Snowflake };
  }
  // Sep-Oct, Mar: pre/post season
  return { type: "offSeason" as const, freeDates: 10, icon: CalendarClock };
}

export default function SeasonalBanner({ locale, labels }: SeasonalBannerProps) {
  const month = new Date().getMonth();
  const config = getSeasonConfig(month);
  const Icon = config.icon;

  const message = config.type === "peak"
    ? labels.peak
    : config.type === "heating"
    ? labels.heating
    : labels.offSeason;

  const slotsText = labels.slots.replace("{count}", String(config.freeDates));

  return (
    <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-center">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-semibold">{message}</span>
        </div>
        <span className="hidden sm:inline text-white/40">·</span>
        <span className="text-xs sm:text-sm font-medium text-white/80">{slotsText}</span>
        <Link
          href={`/${locale}/inquiry`}
          className="inline-flex items-center px-3.5 py-1.5 bg-white text-primary text-xs font-bold rounded-full hover:bg-white/90 transition-colors"
        >
          {labels.cta} →
        </Link>
      </div>
    </div>
  );
}
