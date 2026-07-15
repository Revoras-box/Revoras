import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { OfferRow } from "../types";

// Phase 2.4 (Offers & Promotions). Same React Query shape as useServices - the
// business dashboard's data layer - not the customer app's hand-rolled useApi.

export function useOffers(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "offers"],
    queryFn: () => businessApi.listOffers(studioId as string).then((r) => (r as { offers: OfferRow[] }).offers),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useCreateOffer(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => businessApi.createOffer(studioId as string, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "offers"] }),
  });
}

export function useUpdateOffer(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ offerId, ...body }: { offerId: string } & Record<string, unknown>) =>
      businessApi.updateOffer(studioId as string, offerId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "offers"] }),
  });
}

export function useDeleteOffer(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offerId: string) => businessApi.deleteOffer(studioId as string, offerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "offers"] }),
  });
}
