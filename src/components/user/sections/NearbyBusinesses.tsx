"use client";

import { useBusinesses } from "@/lib/hooks";
import BusinessRailGrid from "./BusinessRailGrid";

interface NearbyBusinessesProps {
  lat?: number;
  lng?: number;
}

/**
 * Phase 2.3 - now renders through BusinessRailGrid like every other rail.
 * Phase 2.2 left this component's duplicated grid alone on "it works and isn't
 * broken" grounds; adding favorite hearts changed that calculus, since keeping
 * it standalone meant wiring isFavorite/toggleFavorite into a fourth copy of
 * the same markup. Its own sortBy-depends-on-geolocation logic stays here.
 */
export default function NearbyBusinesses({ lat, lng }: NearbyBusinessesProps) {
  const hasLocation = lat !== undefined && lng !== undefined;
  const { data, loading } = useBusinesses({
    sortBy: hasLocation ? "distance" : "rating",
    limit: "8",
    ...(hasLocation ? { lat: String(lat), lng: String(lng) } : {}),
  });

  return (
    <BusinessRailGrid
      businesses={data?.businesses ?? []}
      loading={loading}
      count={8}
      emptyTitle="No studios found nearby"
      emptyDescription="Try exploring by category or search instead."
    />
  );
}
