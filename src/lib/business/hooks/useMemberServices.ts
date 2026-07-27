"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "@/lib/business/api";
import type { MemberServiceAssignment, MemberServicesResponse } from "@/lib/types";

/**
 * The owner's "which services does this professional perform" screen.
 *
 * The scheduling interval comes down with the rows but is never sent back up —
 * it's derived from the durations, so there is nothing for the client to set and
 * nothing that can drift out of sync with the data it was computed from.
 */
export function useMemberServices(studioId: string | undefined, memberId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "member-services", memberId],
    queryFn: () =>
      businessApi.getMemberServices(studioId as string, memberId as string) as Promise<MemberServicesResponse>,
    enabled: !!studioId && !!memberId,
  });
}

export function useUpdateMemberServices(studioId: string | undefined, memberId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (services: MemberServiceAssignment[]) =>
      businessApi.updateMemberServices(studioId as string, memberId as string, { services }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "member-services", memberId] });
      // Durations decide both what this professional can be booked for and how
      // far apart their start times sit, so every cached availability view for
      // this studio is now stale.
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "availability"] });
    },
  });
}
