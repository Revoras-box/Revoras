"use client";

import { useState } from "react";
import { Avatar, RatingDisplay, Pagination, EmptyState, CardSkeleton } from "@/components/ui";
import { useBusinessReviews } from "@/lib/hooks";

interface ReviewSectionProps {
  businessId: string;
}

export default function ReviewSection({ businessId }: ReviewSectionProps) {
  const [page, setPage] = useState(1);
  const { data, loading } = useBusinessReviews(businessId, { page: String(page), limit: "10" });
  const reviews = data?.reviews ?? [];
  const stats = data?.stats;
  const pagination = data?.pagination;

  if (loading) {
    return (
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first to leave a review after your visit." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {stats ? (
        <div className="flex items-center gap-3">
          <RatingDisplay value={stats.averageRating} count={stats.total} size="md" />
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3 border-b border-border pb-4 last:border-0">
            <Avatar name={review.customer_name} src={review.customer_avatar ?? undefined} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-on-surface">{review.customer_name}</span>
                <RatingDisplay value={review.rating} />
              </div>
              {review.title ? <p className="mt-1 text-sm font-medium text-on-surface">{review.title}</p> : null}
              {review.comment ? <p className="mt-1 text-sm text-muted">{review.comment}</p> : null}
            </div>
          </div>
        ))}
      </div>
      {pagination ? <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} /> : null}
    </div>
  );
}
