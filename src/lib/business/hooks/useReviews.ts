import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { Pagination, ReviewRow } from "../types";

export interface ReviewFilters {
  rating?: number;
  sortBy?: "highest" | "lowest" | "helpful" | "recent";
  page?: number;
  limit?: number;
}

export interface ReviewsResult {
  reviews: ReviewRow[];
  stats: { total: number; averageRating: number; distribution: Record<string, number> };
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
