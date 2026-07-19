import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { BusinessInviteRow, CreatedInvite } from "../types";

const invitesKey = (studioId: string | undefined) => ["business", studioId, "invites"];

export function useInvites(studioId: string | undefined) {
  return useQuery({
    queryKey: invitesKey(studioId),
    queryFn: () =>
      businessApi.listInvites(studioId as string).then((r) => (r as { invites: BusinessInviteRow[] }).invites),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useCreateInvite(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name: string;
      email?: string;
      phone?: string;
      roleKey: "owner" | "staff";
      designation?: string;
      providesServices?: boolean;
      experienceYears?: number;
    }) => businessApi.createInvite(studioId as string, body) as Promise<{ invite: CreatedInvite }>,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitesKey(studioId) }),
  });
}

export function useResendInvite(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) =>
      businessApi.resendInvite(studioId as string, inviteId) as Promise<{ invite: CreatedInvite }>,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitesKey(studioId) }),
  });
}

export function useRevokeInvite(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => businessApi.revokeInvite(studioId as string, inviteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitesKey(studioId) }),
  });
}
