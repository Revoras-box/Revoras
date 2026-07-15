import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { PortfolioImage, MediaScope } from "../types";

// One hook, two scopes (owner vs self) - the endpoint is chosen inside the
// query/mutation fns, so there is a single implementation and no rules-of-hooks
// branching.
const portfolioKey = (scope: MediaScope) =>
  scope.mode === "owner" ? ["portfolio", scope.studioId, scope.memberId] : ["portfolio", "me", scope.studioId];

const listFor = (scope: MediaScope) =>
  scope.mode === "owner" ? businessApi.listPortfolio(scope.studioId, scope.memberId) : businessApi.meListPortfolio(scope.studioId);

export function usePortfolio(scope: MediaScope) {
  return useQuery({
    queryKey: portfolioKey(scope),
    queryFn: () => listFor(scope).then((r) => (r as { images: PortfolioImage[] }).images),
    enabled: !!scope.studioId && (scope.mode === "self" || !!scope.memberId),
  });
}

export function usePortfolioMutations(scope: MediaScope) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: portfolioKey(scope) });
  const owner = scope.mode === "owner";
  const sid = scope.studioId;
  const mid = scope.mode === "owner" ? scope.memberId : "";

  const add = useMutation({
    mutationFn: (form: FormData) => (owner ? businessApi.addPortfolioImage(sid, mid, form) : businessApi.meAddPortfolioImage(sid, form)),
    onSuccess: invalidate,
  });
  const reorder = useMutation({
    mutationFn: (ids: string[]) => (owner ? businessApi.reorderPortfolio(sid, mid, ids) : businessApi.meReorderPortfolio(sid, ids)),
    onSuccess: invalidate,
  });
  const setCover = useMutation({
    mutationFn: (imageId: string) => (owner ? businessApi.setPortfolioCover(sid, mid, imageId) : businessApi.meSetPortfolioCover(sid, imageId)),
    onSuccess: invalidate,
  });
  const updateCaption = useMutation({
    mutationFn: (vars: { imageId: string; caption: string }) =>
      owner
        ? businessApi.updatePortfolioCaption(sid, mid, vars.imageId, vars.caption)
        : businessApi.meUpdatePortfolioCaption(sid, vars.imageId, vars.caption),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (imageId: string) => (owner ? businessApi.deletePortfolioImage(sid, mid, imageId) : businessApi.meDeletePortfolioImage(sid, imageId)),
    onSuccess: invalidate,
  });

  return { add, reorder, setCover, updateCaption, remove };
}
