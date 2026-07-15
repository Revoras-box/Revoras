import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { Certificate, MediaScope } from "../types";

const certificatesKey = (scope: MediaScope) =>
  scope.mode === "owner" ? ["certificates", scope.studioId, scope.memberId] : ["certificates", "me", scope.studioId];

const listFor = (scope: MediaScope) =>
  scope.mode === "owner" ? businessApi.listCertificates(scope.studioId, scope.memberId) : businessApi.meListCertificates(scope.studioId);

export function useCertificates(scope: MediaScope) {
  return useQuery({
    queryKey: certificatesKey(scope),
    queryFn: () => listFor(scope).then((r) => (r as { certificates: Certificate[] }).certificates),
    enabled: !!scope.studioId && (scope.mode === "self" || !!scope.memberId),
  });
}

export function useCertificateMutations(scope: MediaScope) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: certificatesKey(scope) });
  const owner = scope.mode === "owner";
  const sid = scope.studioId;
  const mid = scope.mode === "owner" ? scope.memberId : "";

  const add = useMutation({
    mutationFn: (form: FormData) => (owner ? businessApi.addCertificate(sid, mid, form) : businessApi.meAddCertificate(sid, form)),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: (vars: { certId: string; form: FormData }) =>
      owner ? businessApi.updateCertificate(sid, mid, vars.certId, vars.form) : businessApi.meUpdateCertificate(sid, vars.certId, vars.form),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (certId: string) => (owner ? businessApi.deleteCertificate(sid, mid, certId) : businessApi.meDeleteCertificate(sid, certId)),
    onSuccess: invalidate,
  });

  return { add, update, remove };
}
