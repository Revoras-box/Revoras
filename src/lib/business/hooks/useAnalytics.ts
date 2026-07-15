import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { AnalyticsData } from "../types";

export function useAnalytics(studioId: string | undefined, params: { period?: string; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["business", studioId, "analytics", params],
    queryFn: () => businessApi.getAnalytics(studioId as string, params).then((r) => (r as { analytics: AnalyticsData }).analytics),
    enabled: !!studioId,
    staleTime: 60_000,
  });
}
