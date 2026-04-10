"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";

interface CategoryGroup {
  group_name: string;
  subcategories: Array<{
    id: number;
    subgroup_name: string;
    slug: string;
    product_count: number;
  }>;
  total_count: number;
}

interface CategorySidebarProps {
  locale: string;
  categories: CategoryGroup[];
  activeCategoryId?: number;
  labels: {
    allProducts: string;
    categories: string;
    filters: string;
  };
  totalProducts: number;
}

export default function CategorySidebar({
  locale,
  categories,
  activeCategoryId,
  labels,
  totalProducts,
}: CategorySidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(categories.map((c) => c.group_name))
  );

  function toggleGroup(name: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const sidebarContent = (
    <nav className="space-y-1">
      {/* All products */}
      <Link
        href={`/${locale}/klimatici`}
        className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
          !activeCategoryId
            ? "bg-primary-light text-primary"
            : "text-foreground hover:bg-muted"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <span>{labels.allProducts}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {totalProducts}
        </span>
      </Link>

      {/* Category groups */}
      {categories.map((group) => (
        <div key={group.group_name}>
          <button
            onClick={() => toggleGroup(group.group_name)}
            className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold text-foreground hover:bg-muted transition-colors min-h-[44px]"
          >
            <span className="truncate">{group.group_name}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">{group.total_count}</span>
              {expandedGroups.has(group.group_name) ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
          </button>

          {expandedGroups.has(group.group_name) && (
            <div className="ml-3 border-l border-border/60 pl-3 space-y-0.5 pb-1">
              {group.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/${locale}/klimatici?category=${sub.id}`}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] ${
                    activeCategoryId === sub.id
                      ? "bg-primary-light text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="truncate">{sub.subgroup_name}</span>
                  <span className="text-xs text-muted-foreground/70">{sub.product_count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Mobile toggle button — 44px tap target */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors mb-4 min-h-[44px]"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {labels.categories}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">{labels.categories}</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-11 h-11 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close categories"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">{sidebarContent}</div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-border/80 rounded-2xl p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 px-3">
            {labels.categories}
          </h2>
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
