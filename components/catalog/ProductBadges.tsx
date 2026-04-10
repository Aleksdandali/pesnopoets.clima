import { Wifi, Zap, Snowflake, Leaf, Volume2, Flame, Tag, AlertTriangle, Wrench } from "lucide-react";
import type { Badge } from "@/lib/bittel/badges";

interface ProductBadgesProps {
  badges: Badge[];
  max?: number;
  /** Overlay mode: stacked vertically on top of product image (like vimax.bg) */
  overlay?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  energy: Zap,
  silent: Volume2,
  wifi: Wifi,
  inverter: Snowflake,
  eco: Leaf,
  area: Flame,
  btu: Zap,
  promo: Tag,
  low_stock: AlertTriangle,
  install: Wrench,
};

export default function ProductBadges({ badges, max, overlay }: ProductBadgesProps) {
  const visible = max ? badges.slice(0, max) : badges;
  if (visible.length === 0) return null;

  if (overlay) {
    // Sticker-style badges overlaid on the product image
    return (
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-[3]" role="list" aria-label="Product badges">
        {visible.map((badge) => {
          const Icon = iconMap[badge.type];
          return (
            <span
              key={badge.type}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm ${badge.color}`}
              role="listitem"
            >
              {Icon && <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />}
              {badge.label}
            </span>
          );
        })}
      </div>
    );
  }

  // Inline pill mode (for product detail page)
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="list" aria-label="Product badges">
      {visible.map((badge) => {
        const Icon = iconMap[badge.type];
        return (
          <span
            key={badge.type}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${badge.color}`}
            role="listitem"
          >
            {Icon && <Icon className="w-3 h-3" aria-hidden="true" />}
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}
