"use client";

import { useBusinesses } from "@/lib/hooks";
import BusinessRailGrid from "./BusinessRailGrid";

/**
 * Phase 2 (Discovery Experience) - one parameterized rail instead of cloning
 * NearbyBusinesses.tsx per section (Recommended/Trending/Top Rated/New all
 * differ only in query params + empty-state copy). NearbyBusinesses itself is
 * left as-is since it already works and isn't broken.
 *
 * Phase 2.2 - rendering moved into BusinessRailGrid, shared with CollectionRail.
 */
export interface DiscoveryRailProps {
  params: Record<string, string>;
  emptyTitle: string;
  emptyDescription?: string;
  count?: number;
}

export default function DiscoveryRail({ params, emptyTitle, emptyDescription, count = 4 }: DiscoveryRailProps) {
  const { data, loading } = useBusinesses({ limit: String(count), ...params });

  return (
    <BusinessRailGrid
      businesses={data?.businesses ?? []}
      loading={loading}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      count={count}
    />
  );
}
