"use client";

import { useRouter } from "next/navigation";
import { BusinessCard, CardSkeleton, EmptyState } from "@/components/ui";
import type { Business } from "@/lib/types";
import { useFavoriteState } from "@/lib/favorites";
import { businessToCardProps } from "./utils";

/**
 * Phase 2.2 (Discovery Curation System) - the shared presentation for every
 * business rail. DiscoveryRail (filter-param driven) and CollectionRail
 * (resolved-collection driven) differ only in where their businesses come
 * from; the loading/empty/card-grid rendering below was duplicated verbatim
 * between them until this was extracted. Data fetching stays in the callers -
 * this component deliberately takes no hooks so a rail backed by any future
 * source can reuse it.
 */
/**
 * Columns are derived from the space available, not from viewport breakpoints.
 *
 * This grid was `grid-cols-2 md:grid-cols-4` — four columns from `md` upward, no
 * matter how wide the container actually was. That is fine at the ~990px the
 * home rails get, and wrong on the widened Discover page, where four columns
 * across ~1400px stretched each card to 424px: enormous photos, three words of
 * text, and a page that looked zoomed in.
 *
 * `auto-fill` asks the container how many ~200px cards fit instead, so the same
 * component gives four columns in a narrow rail and six or seven on Discover,
 * with the card itself staying a consistent, legible size in both. The
 * `min(200px, 45%)` floor is what keeps phones at two columns rather than
 * collapsing to one — 45% of a small container is well under 200px, so the
 * smaller value wins exactly where it needs to.
 *
 * Written as an inline style rather than `grid-cols-[repeat(auto-fill,...)]`
 * because Tailwind v4 silently drops some arbitrary grid-template values in this
 * project, which fails as a *layout that looks fine* — the class is simply
 * absent and the browser falls back to one column.
 */
const RAIL_GRID_STYLE = { gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 45%), 1fr))" } as const;

export interface BusinessRailGridProps {
  businesses: Business[];
  loading: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  count?: number;
}

export default function BusinessRailGrid({ businesses, loading, emptyTitle, emptyDescription, count = 4 }: BusinessRailGridProps) {
  const router = useRouter();
  // Phase 2.3 - hearts on every rail come from here, so DiscoveryRail,
  // CollectionRail and anything else built on this grid get them for free.
  const { isFavorite, toggleFavorite } = useFavoriteState();

  if (loading) {
    return (
      <div className="grid gap-4" style={RAIL_GRID_STYLE}>
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4" style={RAIL_GRID_STYLE}>
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          {...businessToCardProps(business)}
          isFavorite={isFavorite(business.id)}
          onFavoriteToggle={() => toggleFavorite(business.id)}
          onClick={() => router.push(`/user/business/${business.id}`)}
        />
      ))}
    </div>
  );
}
