"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { Container, ErrorState } from "@/components/ui";
import { useBusiness } from "@/lib/hooks";
import { businessPhotoUrls } from "@/lib/business-photos";

interface BusinessPhotosPageProps {
  params: Promise<{ id: string }>;
}

/**
 * The all-photos page for a business, reached by clicking any tile or the
 * "N photos" badge on the detail hero. Shows every uploaded photo in a
 * responsive grid, in the same order as the hero (cover first).
 */
export default function BusinessPhotosPage({ params }: BusinessPhotosPageProps) {
  const { id } = use(params);
  const { data, loading, error, refetch } = useBusiness(id);
  const business = data?.business;

  if (loading) {
    return (
      <Container width="lg" className="py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-container-high" />
          ))}
        </div>
      </Container>
    );
  }

  if (error || !business) {
    return (
      <Container width="lg" className="py-8">
        <ErrorState description={error || "This studio may not exist."} onRetry={refetch} />
      </Container>
    );
  }

  const photos = businessPhotoUrls(business);

  return (
    <Container width="lg" className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-2">
        <Link
          href={`/user/business/${id}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-on-surface"
        >
          <ArrowLeft size={16} /> Back to {business.name}
        </Link>
        <h1 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">Photos</h1>
        <p className="text-sm text-muted">
          {photos.length} photo{photos.length === 1 ? "" : "s"} · {business.name}
        </p>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface-container-high/40 py-16 text-center">
          <ImageIcon size={28} className="text-muted" />
          <p className="text-sm text-muted">This studio hasn&apos;t added any photos yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {photos.map((url, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface-container-high">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos */}
              <img
                src={url}
                alt={`${business.name} photo ${i + 1}`}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
