import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { BusinessMemberRow } from "../types";

// The self-service profile is the same shape as a member row plus the computed
// completion signals the backend attaches in getMember.
export type MyProfile = BusinessMemberRow & { profile_completion: number; profile_missing: string[] };

const myProfileKey = (studioId?: string) => ["me", "profile", studioId];

export function useMyProfile(studioId?: string) {
  return useQuery({
    queryKey: myProfileKey(studioId),
    queryFn: () => businessApi.meGetProfile(studioId as string).then((r) => (r as { profile: MyProfile }).profile),
    enabled: !!studioId,
  });
}

export function useUpdateMyProfile(studioId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => businessApi.meUpdateProfile(studioId as string, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myProfileKey(studioId) }),
  });
}
