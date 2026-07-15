import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { DashboardData } from "../types";

export function useDashboard(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "dashboard"],
    queryFn: () => businessApi.getDashboard(studioId as string).then((r) => r.dashboard as unknown as DashboardData),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}
