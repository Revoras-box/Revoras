import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi, type BusinessDocument, type GalleryImage, type OnboardingState } from "../api";

// Phase 1.5a - onboarding wizard state. Read is member-only on the backend, so
// any active owner/staff can load it; the gate and the wizard both consume this.
export function useOnboarding(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "onboarding"],
    queryFn: () => businessApi.getOnboarding(studioId as string),
    enabled: !!studioId,
    staleTime: 15_000,
  });
}

/**
 * Persist one step's field data and/or advance the resume cursor. The wizard
 * autosaves through this on every step transition (no manual Save button); the
 * backend flips DRAFT -> ONBOARDING on the first write. We seed the onboarding
 * cache with the returned state so progress/percent update without a refetch.
 */
export function useSaveOnboardingStep(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { step?: number; data?: Record<string, unknown> }) =>
      businessApi.saveOnboardingStep(studioId as string, body),
    onSuccess: (state) => {
      queryClient.setQueryData<OnboardingState>(["business", studioId, "onboarding"], (prev) =>
        prev ? { ...prev, ...state } : state
      );
      // Basics/Information edits change the underlying profile too.
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "profile"] });
    },
  });
}

export function useSubmitOnboarding(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => businessApi.submitOnboarding(studioId as string),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] }),
  });
}

// ---- Gallery (Phase 1.1 backend, first frontend consumer is the wizard) ----

export function useGallery(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "gallery"],
    queryFn: () => businessApi.listGallery(studioId as string).then((r) => r.images),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useAddGalleryImage(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return businessApi.addGalleryImage(studioId as string, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "gallery"] });
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] });
    },
  });
}

export function useRemoveGalleryImage(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => businessApi.removeGalleryImage(studioId as string, imageId),
    onSuccess: (r) => {
      queryClient.setQueryData<GalleryImage[]>(["business", studioId, "gallery"], r.images);
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] });
    },
  });
}

export function useSetGalleryCover(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) => businessApi.setGalleryCover(studioId as string, imageId),
    onSuccess: (r) => queryClient.setQueryData<GalleryImage[]>(["business", studioId, "gallery"], r.images),
  });
}

// ---- Documents (PAN/GST/other) — compulsory onboarding upload to R2 ----

export function useDocuments(studioId: string | undefined) {
  return useQuery({
    queryKey: ["business", studioId, "documents"],
    queryFn: () => businessApi.listDocuments(studioId as string).then((r) => r.documents),
    enabled: !!studioId,
    staleTime: 30_000,
  });
}

export function useAddDocument(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, docType }: { file: File; docType: string }) => {
      const form = new FormData();
      form.append("file", file);
      form.append("docType", docType);
      return businessApi.addDocument(studioId as string, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "documents"] });
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] });
    },
  });
}

export function useRemoveDocument(studioId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => businessApi.removeDocument(studioId as string, documentId),
    onSuccess: (r) => {
      queryClient.setQueryData<BusinessDocument[]>(["business", studioId, "documents"], r.documents);
      queryClient.invalidateQueries({ queryKey: ["business", studioId, "onboarding"] });
    },
  });
}
