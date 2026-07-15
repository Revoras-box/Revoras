"use client";

import { useCollection } from "@/lib/hooks";
import BusinessRailGrid from "./BusinessRailGrid";

/**
 * Phase 2.2 (Discovery Curation System) - renders one resolved collection as
 * a homepage rail. Distinct from DiscoveryRail (which drives useBusinesses
 * off raw filter params) because a collection's businesses are already
 * resolved server-side (pinned + auto-filled) - this just fetches that result
 * and hands it to the same BusinessRailGrid every other rail renders through.
 */
export default function CollectionRail({ slug, count = 4 }: { slug: string; count?: number }) {
  const { data, loading } = useCollection(slug, { limit: count });

  return (
    <BusinessRailGrid
      businesses={data?.businesses ?? []}
      loading={loading}
      emptyTitle="Nothing here yet"
      emptyDescription="Check back soon."
      count={count}
    />
  );
}
