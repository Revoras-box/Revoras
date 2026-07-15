import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { BusinessMemberRow } from "../types";

export function useMembers(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "members"],
    queryFn: () => businessApi.listMembers(studioId as string).then((r) => (r as { members: BusinessMemberRow[] }).members),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useAddMember(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; roleKey: "owner" | "staff"; designation?: string; providesServices?: boolean; specialties?: string[]; experienceYears?: number }) =>
      businessApi.addMember(studioId as string, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "members"] }),
  });
}

export function useUpdateMember(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, ...body }: { memberId: string } & Record<string, unknown>) =>
      businessApi.updateMember(studioId as string, memberId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "members"] }),
  });
}

export function useRemoveMember(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => businessApi.removeMember(studioId as string, memberId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "members"] }),
  });
}
