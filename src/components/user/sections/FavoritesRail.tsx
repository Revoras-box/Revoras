"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusinessCard, CardSkeleton, EmptyState } from "@/components/ui";
import { useFavorites } from "@/lib/hooks";
import { useFavoriteState } from "@/lib/favorites";
import { favoriteToCardProps } from "./utils";

/**
 * Phase 2.3 - the rail still fetches full favorite cards (it needs names and
 * images, which the id projection doesn't carry), but the toggle itself now
 * goes through the shared favorites context. That keeps this rail in sync with
 * the hearts on every other rail: unfavoriting here empties the heart on the
 * same business in "Trending now" without a refetch, and vice versa.
 *
 * `version` bumps on every successful toggle, which is what re-runs the fetch
 * so a business unfavorited elsewhere actually leaves this list.
 */
export default function FavoritesRail() {
  const router = useRouter();
  const { data, loading, refetch } = useFavorites();
  const { isFavorite, toggleFavorite, version } = useFavoriteState();

  useEffect(() => {
    if (version > 0) refetch();
    // refetch is recreated per render by useApi; depending on it would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const favorites = (data?.favorites ?? []).filter((f) => isFavorite(f.id));

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[1, 2].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return <EmptyState title="No favorites yet" description="Studios you favorite will show up here." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {favorites.map((favorite) => (
        <BusinessCard
          key={favorite.id}
          {...favoriteToCardProps(favorite)}
          isFavorite={isFavorite(favorite.id)}
          onFavoriteToggle={() => toggleFavorite(favorite.id)}
          onClick={() => router.push(`/user/business/${favorite.id}`)}
        />
      ))}
    </div>
  );
}
