import { useQuery } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { Pagination, PaymentRow, PaymentsSummary } from "../types";

export interface PaymentFilters {
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export function usePayments(studioId: string | undefined, filters: PaymentFilters) {
  return useQuery({
    queryKey: ["business", studioId, "payments", filters],
    queryFn: () =>
      businessApi
        .listPayments(studioId as string, filters)
        .then((r) => r as { payments: PaymentRow[]; summary: PaymentsSummary; pagination: Pagination }),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}
