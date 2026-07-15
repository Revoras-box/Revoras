"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Container, Button, BusinessCard, CardSkeleton, EmptyState } from "@/components/ui";
import { useRecentlyViewed } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import { useFavoriteState } from "@/lib/favorites";
import { api } from "@/lib/api";
import { clearRecentlyViewed as clearLocalRecentlyViewed } from "@/lib/recently-viewed";
import { recentCardToCardProps } from "@/components/user/sections/utils";

/**
 * Phase 2.3 — the full Recently Viewed history, beyond the homepage rail's
 * short strip.
 *
 * Renders BusinessCard directly rather than through BusinessRailGrid: that
 * component takes `Business[]`, and a RecentlyViewedCard isn't one (no
 * category_name, no badges, no rankScore). Forcing the shape with a cast would
 * only hide that mismatch, so this maps explicitly via recentCardToCardProps —
 * the same mapper the homepage rail uses.
 *
 * "Clear history" has to clear whichever half of the hybrid is in play — the
 * server table for a signed-in user, the localStorage store otherwise.
 */
const PAGE_LIMIT = 50;

export default function RecentlyViewedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavoriteState();
  const [version, setVersion] = useState(0);
  const [clearing, setClearing] = useState(false);
  const { businesses, loading } = useRecentlyViewed(PAGE_LIMIT, version);

  const handleClear = async () => {
    setClearing(true);
    try {
      if (user) {
        const res = await api.clearRecentlyViewed();
        if (res.error) throw new Error(res.error);
      } else {
        clearLocalRecentlyViewed();
      }
      setVersion((v) => v + 1);
      toast.success("History cleared");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't clear history");
    } finally {
      setClearing(false);
    }
  };

  return (
    <Container className="flex flex-col gap-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Recently viewed</h1>
          <p className="mt-1 text-sm text-muted">Studios you&apos;ve looked at, most recent first.</p>
        </div>
        {businesses.length > 0 ? (
          <Button intent="secondary" onClick={handleClear} loading={clearing}>
            Clear history
          </Button>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="Studios you view will appear here so you can pick up where you left off."
          action={<Button onClick={() => router.push("/user")}>Start exploring</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {businesses.map((b) => (
            <BusinessCard
              key={b.id}
              {...recentCardToCardProps(b)}
              isFavorite={isFavorite(b.id)}
              onFavoriteToggle={() => toggleFavorite(b.id)}
              onClick={() => router.push(`/user/business/${b.id}`)}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
