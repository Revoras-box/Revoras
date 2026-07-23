import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";

export function useSubscription(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "subscription"],
    queryFn: () => businessApi.getSubscription(studioId as string),
    enabled: !!studioId,
    staleTime: 15_000,
  });
}

export function useCreateSubscriptionOrder(studioId: string | undefined) {
  return useMutation({
    mutationFn: () => businessApi.createSubscriptionOrder(studioId as string),
  });
}

export function useVerifySubscriptionPayment(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
      businessApi.verifySubscriptionPayment(studioId as string, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] });
    },
  });
}

// TEMPORARY: finish onboarding without a payment while no gateway is live.
export function useActivateSubscriptionFree(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => businessApi.activateSubscriptionFree(studioId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "subscription"] });
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] });
    },
  });
}
