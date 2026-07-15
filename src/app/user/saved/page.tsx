"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Tabs, TabsPanel, BusinessCard, ProfessionalCard, CardSkeleton, EmptyState, Button } from "@/components/ui";
import { useFavorites, useFavoriteProfessionals } from "@/lib/hooks";
import { useFavoriteState } from "@/lib/favorites";
import { favoriteToCardProps, professionalToCardProps } from "@/components/user/sections/utils";

const TAB_ITEMS = [
  { value: "businesses", label: "Studios" },
  { value: "professionals", label: "Professionals" },
];

/**
 * Phase 2.3 — the dedicated "Saved" page. Favorites previously lived only as a
 * rail inside a profile tab, which had nowhere to put professionals.
 *
 * Both tabs filter their fetched list through the shared favorites context, so
 * unfavoriting removes the card immediately (optimistically) rather than after
 * a refetch round-trip — and `version` re-fetches in the background to stay
 * honest with the server.
 */
function SavedPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "businesses");

  const { data: businessData, loading: loadingBusinesses, refetch: refetchBusinesses } = useFavorites();
  const { data: professionalData, loading: loadingProfessionals, refetch: refetchProfessionals } = useFavoriteProfessionals();
  const { isFavorite, isProfessionalFavorite, toggleFavorite, toggleProfessionalFavorite, version } = useFavoriteState();

  useEffect(() => {
    if (version === 0) return;
    refetchBusinesses();
    refetchProfessionals();
    // Both refetch fns are recreated per render by useApi; depending on them loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const businesses = (businessData?.favorites ?? []).filter((b) => isFavorite(b.id));
  const professionals = (professionalData?.professionals ?? []).filter((p) => isProfessionalFavorite(p.id));

  return (
    <Container className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">Saved</h1>
        <p className="mt-1 text-sm text-muted">Studios and professionals you&apos;ve favorited.</p>
      </div>

      <Tabs items={TAB_ITEMS} value={activeTab} onValueChange={setActiveTab}>
        <TabsPanel value="businesses">
          {loadingBusinesses ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <EmptyState
              title="No saved studios yet"
              description="Tap the heart on any studio to save it here for later."
              action={<Button onClick={() => router.push("/user")}>Explore studios</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {businesses.map((b) => (
                <BusinessCard
                  key={b.id}
                  {...favoriteToCardProps(b)}
                  isFavorite={isFavorite(b.id)}
                  onFavoriteToggle={() => toggleFavorite(b.id)}
                  onClick={() => router.push(`/user/business/${b.id}`)}
                />
              ))}
            </div>
          )}
        </TabsPanel>

        <TabsPanel value="professionals">
          {loadingProfessionals ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : professionals.length === 0 ? (
            <EmptyState
              title="No saved professionals yet"
              description="Save a stylist or barber from any studio page to find them again quickly."
              action={<Button onClick={() => router.push("/user")}>Explore studios</Button>}
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {professionals.map((p) => (
                <ProfessionalCard
                  key={p.id}
                  {...professionalToCardProps(p)}
                  isFavorite={isProfessionalFavorite(p.id)}
                  onFavoriteToggle={() => toggleProfessionalFavorite(p.id)}
                  onClick={() => router.push(`/user/business/${p.business_id}`)}
                />
              ))}
            </div>
          )}
        </TabsPanel>
      </Tabs>
    </Container>
  );
}

export default function SavedPage() {
  return (
    <Suspense fallback={<Container className="py-8 text-sm text-muted">Loading saved…</Container>}>
      <SavedPageContent />
    </Suspense>
  );
}
