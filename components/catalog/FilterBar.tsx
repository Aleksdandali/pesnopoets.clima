"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterBarProps {
  locale: string;
  manufacturers: string[];
  dictionary: {
    catalog: {
      filters: {
        brand: string;
        btuRange: string;
        priceRange: string;
        energyClass: string;
        availability: string;
        allBrands: string;
        allClasses: string;
        inStock: string;
        clearFilters: string;
      };
      sort: {
        label: string;
        priceAsc: string;
        priceDesc: string;
        btuAsc: string;
        btuDesc: string;
        nameAsc: string;
      };
    };
  };
}

const btuRanges = [
  { label: "7 000 BTU", min: 5000, max: 8000 },
  { label: "9 000 BTU", min: 8000, max: 10000 },
  { label: "12 000 BTU", min: 10000, max: 14000 },
  { label: "18 000 BTU", min: 14000, max: 20000 },
  { label: "24 000+ BTU", min: 20000, max: 100000 },
];

const energyClasses = ["A+++", "A++", "A+", "A", "B"];

export default function FilterBar({
  locale,
  manufacturers,
  dictionary,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = dictionary.catalog;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // reset pagination on filter change
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (name: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString(name, value)}`, {
        scroll: false,
      });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const activeBrand = searchParams.get("brand") || "";
  const activeBtu = searchParams.get("btu") || "";
  const activeEnergy = searchParams.get("energy") || "";
  const activeAvailability = searchParams.get("available") || "";
  const activeSort = searchParams.get("sort") || "";
  const hasFilters = activeBrand || activeBtu || activeEnergy || activeAvailability;

  return (
    <div className={`transition-opacity ${isPending ? "opacity-60" : ""}`}>
      {/* Filter row — horizontally scrollable on mobile */}
      <div className="flex flex-nowrap items-center gap-2 sm:gap-3 mb-5 sm:mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-2 sm:pb-0 scrollbar-hide">
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mr-1 shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">{t.filters.brand}:</span>
        </div>

        {/* Brand */}
        <select
          value={activeBrand}
          onChange={(e) => setFilter("brand", e.target.value)}
          className="shrink-0 text-sm border border-border rounded-lg px-3 py-2.5 min-h-[44px] bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t.filters.allBrands}</option>
          {manufacturers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* BTU */}
        <select
          value={activeBtu}
          onChange={(e) => setFilter("btu", e.target.value)}
          className="shrink-0 text-sm border border-border rounded-lg px-3 py-2.5 min-h-[44px] bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t.filters.btuRange}</option>
          {btuRanges.map((r) => (
            <option key={r.label} value={`${r.min}-${r.max}`}>
              {r.label}
            </option>
          ))}
        </select>

        {/* Energy Class */}
        <select
          value={activeEnergy}
          onChange={(e) => setFilter("energy", e.target.value)}
          className="shrink-0 text-sm border border-border rounded-lg px-3 py-2.5 min-h-[44px] bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">{t.filters.allClasses}</option>
          {energyClasses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Availability */}
        <label className="shrink-0 flex items-center gap-2 text-sm text-muted-foreground cursor-pointer whitespace-nowrap min-h-[44px] px-1">
          <input
            type="checkbox"
            checked={activeAvailability === "1"}
            onChange={(e) =>
              setFilter("available", e.target.checked ? "1" : "")
            }
            className="w-5 h-5 rounded border-border text-primary focus:ring-ring"
          />
          {t.filters.inStock}
        </label>

        {/* Sort */}
        <select
          value={activeSort}
          onChange={(e) => setFilter("sort", e.target.value)}
          className="shrink-0 text-sm border border-border rounded-lg px-3 py-2.5 min-h-[44px] bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:ml-auto"
        >
          <option value="">{t.sort.label}</option>
          <option value="price_asc">{t.sort.priceAsc}</option>
          <option value="price_desc">{t.sort.priceDesc}</option>
          <option value="btu_asc">{t.sort.btuAsc}</option>
          <option value="btu_desc">{t.sort.btuDesc}</option>
          <option value="name_asc">{t.sort.nameAsc}</option>
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="shrink-0 flex items-center gap-1 text-sm text-danger hover:text-danger/80 transition-colors whitespace-nowrap min-h-[44px] px-2"
          >
            <X className="w-3.5 h-3.5" />
            {t.filters.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}
