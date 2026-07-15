"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusinessCard } from "@/components/ui";
import { useRecentlyViewed } from "@/lib/hooks";
import { useFavoriteState } from "@/lib/favorites";
import { recentCardToCardProps } from "./utils";

interface RecentlyViewedRailProps {
  onItemsChange?: (count: number) => void;
  limit?: number;
}

/**
 * Phase 2.3 - now sourced from useRecentlyViewed (server history when signed
 * in, localStorage otherwise) instead of reading localStorage directly, and
 * carries favorite hearts like every other card surface.
 *
 * Stays a horizontal scroller rather than moving to BusinessRailGrid: this rail
 * is deliberately a different shape (narrow w-48 cards, scrolls sideways, hides
 * itself entirely when empty rather than showing an empty state).
 */
export default function RecentlyViewedRail({ onItemsChange, limit = 12 }: RecentlyViewedRailProps) {
  const router = useRouter();
  const { businesses, loading } = useRecentlyViewed(limit);
  const { isFavorite, toggleFavorite } = useFavoriteState();

  useEffect(() => {
    // Only report a settled count. Reporting the pre-fetch 0 lets a parent that
    // keys layout off this count (the homepage does) flip back to its empty
    // shape mid-load — which, if that flip also relocates this component in the
    // tree, remounts it and restarts the fetch forever.
    if (loading) return;
    onItemsChange?.(businesses.length);
    // onItemsChange is an inline arrow from the parent; depending on it loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, businesses.length]);

  if (businesses.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {businesses.map((item) => (
        <BusinessCard
          key={item.id}
          {...recentCardToCardProps(item)}
          isFavorite={isFavorite(item.id)}
          onFavoriteToggle={() => toggleFavorite(item.id)}
          className="w-48 shrink-0"
          onClick={() => router.push(`/user/business/${item.id}`)}
        />
      ))}
    </div>
  );
}
