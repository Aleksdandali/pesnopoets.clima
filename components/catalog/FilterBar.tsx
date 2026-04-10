"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { X, ChevronDown } from "lucide-react";

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
      params.delete("page");
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

  // Active filter count for mobile indicator
  const activeCount = [activeBrand, activeBtu, activeEnergy, activeAvailability].filter(Boolean).length;

  const selectClass = (isActive: boolean) =>
    `shrink-0 text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] appearance-none cursor-pointer transition-all duration-200 pr-8 ${
      isActive
        ? "bg-primary text-white border-primary shadow-sm font-medium"
        : "bg-white text-foreground border border-border/80 hover:border-primary/30 hover:shadow-sm"
    }`;

  return (
    <div className={`transition-opacity duration-200 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Filter chips — horizontally scrollable on mobile */}
      <div className="flex flex-nowrap items-center gap-2 mb-5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-2 sm:pb-0 scrollbar-hide">

        {/* Brand */}
        <div className="relative shrink-0">
          <select
            value={activeBrand}
            onChange={(e) => setFilter("brand", e.target.value)}
            className={selectClass(!!activeBrand)}
          >
            <option value="">{t.filters.allBrands}</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${activeBrand ? "text-white/70" : "text-muted-foreground"}`} aria-hidden="true" />
        </div>

        {/* BTU */}
        <div className="relative shrink-0">
          <select
            value={activeBtu}
            onChange={(e) => setFilter("btu", e.target.value)}
            className={selectClass(!!activeBtu)}
          >
            <option value="">{t.filters.btuRange}</option>
            {btuRanges.map((r) => (
              <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>
            ))}
          </select>
          <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${activeBtu ? "text-white/70" : "text-muted-foreground"}`} aria-hidden="true" />
        </div>

        {/* Energy Class */}
        <div className="relative shrink-0">
          <select
            value={activeEnergy}
            onChange={(e) => setFilter("energy", e.target.value)}
            className={selectClass(!!activeEnergy)}
          >
            <option value="">{t.filters.energyClass}</option>
            {energyClasses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${activeEnergy ? "text-white/70" : "text-muted-foreground"}`} aria-hidden="true" />
        </div>

        {/* Availability toggle */}
        <button
          onClick={() => setFilter("available", activeAvailability === "1" ? "" : "1")}
          className={`shrink-0 flex items-center gap-2 text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] transition-all duration-200 whitespace-nowrap ${
            activeAvailability === "1"
              ? "bg-success text-white border-success shadow-sm font-medium"
              : "bg-white text-foreground border border-border/80 hover:border-success/30 hover:shadow-sm"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${activeAvailability === "1" ? "bg-white" : "bg-success"}`} />
          {t.filters.inStock}
        </button>

        {/* Sort */}
        <div className="relative shrink-0 sm:ml-auto">
          <select
            value={activeSort}
            onChange={(e) => setFilter("sort", e.target.value)}
            className="shrink-0 text-sm bg-white text-muted-foreground border border-border/80 rounded-xl px-3.5 py-2.5 min-h-[44px] appearance-none cursor-pointer pr-8 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
          >
            <option value="">{t.sort.label}</option>
            <option value="price_asc">{t.sort.priceAsc}</option>
            <option value="price_desc">{t.sort.priceDesc}</option>
            <option value="btu_asc">{t.sort.btuAsc}</option>
            <option value="btu_desc">{t.sort.btuDesc}</option>
            <option value="name_asc">{t.sort.nameAsc}</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground" aria-hidden="true" />
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="shrink-0 flex items-center gap-1.5 text-sm text-danger hover:text-danger/80 transition-colors whitespace-nowrap min-h-[44px] px-2 font-medium"
          >
            <X className="w-4 h-4" />
            {t.filters.clearFilters}
            {activeCount > 0 && (
              <span className="bg-danger/10 text-danger text-xs font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
