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
    <div className="relative overflow-hidden bg-gradient-to-r from-[#064e6e] via-primary-dark to-[#064e6e] text-white">
      {/* Subtle animated shimmer overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 8s ease-in-out infinite",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-center gap-3 sm:gap-5 flex-wrap text-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="text-xs sm:text-sm font-semibold">{message}</span>
        </div>
        <span className="hidden sm:inline text-white/20">|</span>
        <span className="text-xs sm:text-sm font-medium text-white/70">{slotsText}</span>
        <Link
          href={`/${locale}/inquiry`}
          className="inline-flex items-center px-4 py-1.5 bg-white text-primary-dark text-xs font-bold rounded-full hover:bg-white/90 transition-all duration-200 shadow-[0_2px_8px_rgb(0_0_0/0.15)] hover:shadow-[0_4px_12px_rgb(0_0_0/0.2)]"
        >
          {labels.cta}
          <svg className="w-3 h-3 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
