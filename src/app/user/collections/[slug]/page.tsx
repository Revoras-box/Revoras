"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, BusinessCard, CardSkeleton, EmptyState, ErrorState, Pagination } from "@/components/ui";
import { useCollection } from "@/lib/hooks";
import { useFavoriteState } from "@/lib/favorites";
import { businessToCardProps } from "@/components/user/sections/utils";

// Phase 2.2 (Discovery Curation System) - a collection's dedicated page.
// Reuses BusinessCard exactly like /user/search does; the only new thing here
// is fetching a resolved collection instead of a raw filter query.
export default function CollectionPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavoriteState();
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useCollection(params.slug, { page, limit: 20 });

  if (!loading && error) {
    return (
      <Container className="py-16">
        <ErrorState title="Collection not found" description={error} onRetry={refetch} />
      </Container>
    );
  }

  const collection = data?.collection;
  const businesses = data?.businesses ?? [];
  const pagination = data?.pagination;

  return (
    <Container className="flex flex-col gap-6 py-8">
      {loading && !collection ? (
        <div className="h-24 animate-pulse rounded-2xl bg-surface-container-high" />
      ) : collection ? (
        <div className="flex flex-col gap-4">
          {collection.coverImageUrl ? (
            <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-surface-container-high">
              {/* eslint-disable-next-line @next/next/no-img-element -- collection covers are arbitrary remote curator-supplied images */}
              <img src={collection.coverImageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          ) : null}
          <div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">{collection.title}</h1>
            {collection.subtitle ? <p className="mt-1 text-sm text-muted">{collection.subtitle}</p> : null}
            {collection.description ? <p className="mt-2 max-w-2xl text-sm text-secondary-foreground">{collection.description}</p> : null}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <EmptyState title="Nothing here yet" description="Check back soon — this collection is still filling up." />
      ) : (
        <>
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
          {pagination && pagination.pages > 1 ? <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} /> : null}
        </>
      )}
    </Container>
  );
}
