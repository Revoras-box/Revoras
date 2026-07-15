"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBusinessAuth } from "@/lib/business/auth";
import { useReviews, type ReviewFilters } from "@/lib/business/hooks/useReviews";
import { ICON_SIZE } from "@/lib/design-tokens";

const RATING_OPTIONS = [
  { value: "all", label: "All ratings" },
  { value: "5", label: "5 stars" },
  { value: "4", label: "4 stars" },
  { value: "3", label: "3 stars" },
  { value: "2", label: "2 stars" },
  { value: "1", label: "1 star" },
];

const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
  { value: "helpful", label: "Most helpful" },
];

export default function ReviewsPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;

  const [rating, setRating] = useState("all");
  const [sortBy, setSortBy] = useState<ReviewFilters["sortBy"]>("recent");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useReviews(studioId, {
    rating: rating === "all" ? undefined : Number(rating),
    sortBy,
    page,
    limit: 10,
  });

  return (
    <div>
      <PageHeader title="Reviews" description="What customers are saying about your business." />

      {isLoading ? (
        <Skeleton className="h-20 rounded-2xl mb-4" />
      ) : data ? (
        <Card className="mb-4 flex items-center gap-4">
          <span className="text-3xl font-bold text-on-surface">{data.stats.averageRating.toFixed(1)}</span>
          <div>
            <RatingDisplay value={data.stats.averageRating} count={data.stats.total} size="md" />
            <div className="text-xs text-muted mt-1">Based on {data.stats.total} reviews</div>
          </div>
        </Card>
      ) : null}

      <Card padding="sm" className="mb-4">
        <div className="flex flex-wrap gap-3">
          <Select
            className="w-40"
            value={rating}
            onValueChange={(v) => {
              setRating(v);
              setPage(1);
            }}
            options={RATING_OPTIONS}
          />
          <Select
            className="w-44"
            value={sortBy}
            onValueChange={(v) => {
              setSortBy(v as ReviewFilters["sortBy"]);
              setPage(1);
            }}
            options={SORT_OPTIONS}
          />
        </div>
      </Card>

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load reviews." />
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : data && data.reviews.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {data.reviews.map((r) => (
              <Card key={r.id} padding="md">
                <div className="flex items-start gap-3">
                  <Avatar name={r.customer_name} src={r.customer_avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-on-surface">{r.customer_name}</span>
                      <span className="text-xs text-muted shrink-0">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <RatingDisplay value={r.rating} className="mt-1" />
                    {r.title ? <div className="text-sm font-medium text-on-surface mt-2">{r.title}</div> : null}
                    {r.comment ? <p className="text-sm text-muted mt-1">{r.comment}</p> : null}
                    {r.helpful_count > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted mt-2">
                        <ThumbsUp size={ICON_SIZE.sm} /> {r.helpful_count} found this helpful
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {data.pagination.pages > 1 ? (
            <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} className="mt-4" />
          ) : null}
        </>
      ) : (
        <EmptyState title="No reviews yet" description="Reviews from customers will appear here after their first completed booking." />
      )}
    </div>
  );
}
