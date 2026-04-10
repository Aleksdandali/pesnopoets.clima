import type { Badge } from "@/lib/bittel/badges";

interface ProductBadgesProps {
  badges: Badge[];
  /** Maximum number of badges to display. Defaults to all passed badges. */
  max?: number;
}

/**
 * Renders product badges as small horizontal pills.
 * Light-theme design: subtle colored backgrounds with matching text.
 * No icons — text only for compact display.
 */
export default function ProductBadges({ badges, max }: ProductBadgesProps) {
  const visible = max ? badges.slice(0, max) : badges;

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list" aria-label="Product badges">
      {visible.map((badge) => (
        <span
          key={badge.type}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium leading-tight whitespace-nowrap ${badge.color}`}
          role="listitem"
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}
