import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { Pagination, ReviewRow } from "../types";

export interface ReviewFilters {
  rating?: number;
  sortBy?: "highest" | "lowest" | "helpful" | "recent";
  awaitingReply?: boolean;
  page?: number;
  limit?: number;
}

export interface ReviewsResult {
  reviews: ReviewRow[];
  stats: {
    total: number;
    averageRating: number;
    distribution: Record<string, number>;
    /** Unanswered reviews across the whole business — not just the current page or filter. */
    awaitingReply: number;
  };
  pagination: Pagination;
}

export function useReviews(studioId: string | undefined, filters: ReviewFilters) {
  return useQuery({
    queryKey: ["business", studioId, "reviews", filters],
    queryFn: () => businessApi.listReviews(studioId as string, filters).then((r) => r as ReviewsResult),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

// Both reply mutations invalidate the dashboard too — the "awaiting reply" tile
// is derived from the same count this write changes.
const invalidateReviews = (queryClient: ReturnType<typeof useQueryClient>, studioId?: string) => {
  queryClient.invalidateQueries({ queryKey: ["business", studioId, "reviews"] });
  queryClient.invalidateQueries({ queryKey: ["business", studioId, "dashboard"] });
};

export function useReplyToReview(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, reply }: { reviewId: string; reply: string }) =>
      businessApi.replyToReview(studioId as string, reviewId, reply),
    onSuccess: () => invalidateReviews(queryClient, studioId),
  });
}

export function useDeleteReviewReply(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => businessApi.deleteReviewReply(studioId as string, reviewId),
    onSuccess: () => invalidateReviews(queryClient, studioId),
  });
}
