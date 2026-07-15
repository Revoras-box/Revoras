import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { VerificationCenter } from "@/lib/types";

// Phase 1.4b/1.4d - the business Verification Center. One query for the whole
// center payload; mutations invalidate it so status/timeline/documents refresh.

const key = (studioId?: string) => ["business", studioId, "verification"];

export function useVerification(studioId: string | undefined) {
  return useQuery({
    queryKey: key(studioId),
    queryFn: () => businessApi.getVerification(studioId as string) as Promise<VerificationCenter>,
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useCreateVerificationRequest(studioId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { applicantNote?: string }) => businessApi.createVerificationRequest(studioId as string, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(studioId) }),
  });
}

export function useAddVerificationDocument(studioId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, form }: { requestId: string; form: FormData }) =>
      businessApi.addVerificationDocument(studioId as string, requestId, form),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(studioId) }),
  });
}

export function useRemoveVerificationDocument(studioId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, documentId }: { requestId: string; documentId: string }) =>
      businessApi.removeVerificationDocument(studioId as string, requestId, documentId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(studioId) }),
  });
}

export function useSubmitVerificationRequest(studioId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => businessApi.submitVerificationRequest(studioId as string, requestId),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(studioId) }),
  });
}
