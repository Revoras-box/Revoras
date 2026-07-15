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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
