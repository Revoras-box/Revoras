import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { ServiceRow } from "../types";

export function useServices(studioId: string | undefined, activeOnly = false) {
  return useQuery({
    queryKey: ["business", studioId, "services", { activeOnly }],
    queryFn: () =>
      businessApi
        .listServices(studioId as string, { activeOnly })
        // Postgres returns the `price` numeric column as a string ("50.00"). Coerce
        // it to a real number so ServiceRow.price matches its type and the edit form
        // re-sends a number (the API's z.number() rejects the stringy value).
        .then((r) => (r as { services: ServiceRow[] }).services.map((s) => ({ ...s, price: Number(s.price) }))),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useServiceCategories() {
  return useQuery({
    queryKey: ["categories", "service"],
    queryFn: () => businessApi.listCategories("service").then((r) => (r as { categories: { id: string; name: string; slug: string }[] }).categories),
    staleTime: 5 * 60_000,
  });
}

// Phase 1.5a - business (not service) categories, for the onboarding Basics step.
export function useBusinessCategories() {
  return useQuery({
    queryKey: ["categories", "business"],
    queryFn: () => businessApi.listCategories("business").then((r) => (r as { categories: { id: string; name: string }[] }).categories),
    staleTime: 5 * 60_000,
  });
}

export function useCreateService(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => businessApi.createService(studioId as string, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "services"] }),
  });
}

export function useUpdateService(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, ...body }: { serviceId: string } & Record<string, unknown>) =>
      businessApi.updateService(studioId as string, serviceId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "services"] }),
  });
}

export function useDeactivateService(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: string) => businessApi.deactivateService(studioId as string, serviceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "services"] }),
  });
}
