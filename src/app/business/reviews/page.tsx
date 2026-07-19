"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { RatingDisplay } from "@/components/ui/RatingDisplay";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/ui/StatCard";
import { useBusinessAuth } from "@/lib/business/auth";
import {
  useReviews,
  useReplyToReview,
  useDeleteReviewReply,
  type ReviewFilters,
} from "@/lib/business/hooks/useReviews";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import type { ReviewRow } from "@/lib/business/types";
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

const REPLY_OPTIONS = [
  { value: "all", label: "All reviews" },
  { value: "awaiting", label: "Awaiting reply" },
];

export default function ReviewsPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canRespond = hasPermission(activeMembership?.permissions || [], PERMISSIONS.REVIEWS_RESPOND);

  const [rating, setRating] = useState("all");
  const [sortBy, setSortBy] = useState<ReviewFilters["sortBy"]>("recent");
  const [replyFilter, setReplyFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useReviews(studioId, {
    rating: rating === "all" ? undefined : Number(rating),
    sortBy,
    awaitingReply: replyFilter === "awaiting" ? true : undefined,
    page,
    limit: 10,
  });

  return (
    <div>
      <PageHeader title="Reviews" description="What customers are saying about your business." />

      {isLoading ? (
        <Skeleton className="h-20 rounded-2xl mb-4" />
      ) : data ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Card className="flex items-center gap-4 sm:col-span-2">
            <span className="text-3xl font-bold text-on-surface">{data.stats.averageRating.toFixed(1)}</span>
            <div>
              <RatingDisplay value={data.stats.averageRating} count={data.stats.total} size="md" />
              <div className="text-xs text-muted mt-1">Based on {data.stats.total} reviews</div>
            </div>
          </Card>
          <StatCard
            label="Awaiting reply"
            value={data.stats.awaitingReply}
            icon={<MessageSquare size={ICON_SIZE.md} />}
          />
        </div>
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
          <Select
            className="w-44"
            value={replyFilter}
            onValueChange={(v) => {
              setReplyFilter(v);
              setPage(1);
            }}
            options={REPLY_OPTIONS}
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
              <ReviewCard key={r.id} studioId={studioId} review={r} canRespond={canRespond} />
            ))}
          </div>
          {data.pagination.pages > 1 ? (
            <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} className="mt-4" />
          ) : null}
        </>
      ) : (
        <EmptyState
          title={replyFilter === "awaiting" ? "Every review has a reply" : "No reviews yet"}
          description={
            replyFilter === "awaiting"
              ? "You're all caught up — nothing is waiting on a response."
              : "Reviews from customers will appear here after their first completed booking."
          }
        />
      )}
    </div>
  );
}

function ReviewCard({
  studioId,
  review,
  canRespond,
}: {
  studioId: string | undefined;
  review: ReviewRow;
  canRespond: boolean;
}) {
  const replyMutation = useReplyToReview(studioId);
  const deleteReply = useDeleteReviewReply(studioId);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState(review.reply || "");

  const handleSubmit = () => {
    const text = draft.trim();
    if (!text) return toast.error("Reply can't be empty");

    replyMutation.mutate(
      { reviewId: review.id, reply: text },
      {
        onSuccess: () => {
          toast.success("Reply published");
          setComposing(false);
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't publish reply"),
      }
    );
  };

  const handleDelete = () => {
    if (!window.confirm("Remove your reply? Customers will no longer see it on your listing.")) return;
    deleteReply.mutate(review.id, {
      onSuccess: () => {
        toast.success("Reply removed");
        setDraft("");
        setComposing(false);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't remove reply"),
    });
  };

  return (
    <Card padding="md">
      <div className="flex items-start gap-3">
        <Avatar name={review.customer_name} src={review.customer_avatar} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-on-surface">{review.customer_name}</span>
            <div className="flex items-center gap-2 shrink-0">
              {!review.reply ? <Badge tone="warning">Needs reply</Badge> : null}
              <span className="text-xs text-muted">
                {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>
          <RatingDisplay value={review.rating} className="mt-1" />
          {review.title ? <div className="text-sm font-medium text-on-surface mt-2">{review.title}</div> : null}
          {review.comment ? <p className="text-sm text-muted mt-1">{review.comment}</p> : null}
          {review.helpful_count > 0 ? (
            <div className="flex items-center gap-1.5 text-xs text-muted mt-2">
              <ThumbsUp size={ICON_SIZE.sm} /> {review.helpful_count} found this helpful
            </div>
          ) : null}

          {/* Published reply — indented to read as a response, the way it appears publicly. */}
          {review.reply && !composing ? (
            <div className="mt-3 rounded-xl border-l-2 border-primary bg-surface-container-low p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-on-surface">
                  Your reply
                  {review.replied_by_name ? <span className="font-normal text-muted"> · {review.replied_by_name}</span> : null}
                </span>
                {review.replied_at ? (
                  <span className="text-xs text-muted shrink-0">
                    {new Date(review.replied_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-on-surface mt-1.5 whitespace-pre-wrap">{review.reply}</p>
              {canRespond ? (
                <div className="flex gap-2 mt-2.5">
                  <Button intent="ghost" size="sm" onClick={() => { setDraft(review.reply || ""); setComposing(true); }}>
                    Edit
                  </Button>
                  <Button intent="ghost" size="sm" onClick={handleDelete} loading={deleteReply.isPending}>
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}

          {canRespond && composing ? (
            <div className="mt-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Thank them, or address the issue directly. This is public on your listing."
                aria-label={`Reply to ${review.customer_name}`}
              />
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-xs text-muted">{draft.trim().length}/2000</span>
                <div className="flex gap-2">
                  <Button intent="ghost" size="sm" onClick={() => { setComposing(false); setDraft(review.reply || ""); }}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSubmit} loading={replyMutation.isPending}>
                    {review.reply ? "Save reply" : "Publish reply"}
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {canRespond && !review.reply && !composing ? (
            <Button intent="outline" size="sm" className="mt-3" onClick={() => setComposing(true)}>
              <MessageSquare size={16} /> Reply
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
