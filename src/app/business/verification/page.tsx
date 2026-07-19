"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  Circle,
  Upload,
  Trash2,
  FileText,
  Clock,
  Send,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Timeline, type TimelineEvent } from "@/components/ui/Timeline";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBusinessAuth } from "@/lib/business/auth";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { useBusinessProfile } from "@/lib/business/hooks/useSettings";
import { VerifiedBadgePreview } from "@/components/business/VerifiedBadgePreview";
import {
  useVerification,
  useCreateVerificationRequest,
  useAddVerificationDocument,
  useRemoveVerificationDocument,
  useSubmitVerificationRequest,
} from "@/lib/business/hooks/useVerification";
import type { VerificationDocumentType, VerificationStatus } from "@/lib/types";
import { VERIFICATION_STATUS_META } from "@/lib/business/verification-status";

const STATUS_META = VERIFICATION_STATUS_META;

const DOC_TYPES: { value: VerificationDocumentType; label: string }[] = [
  { value: "business_license", label: "Business license" },
  { value: "id_proof", label: "ID proof" },
  { value: "address_proof", label: "Address proof" },
  { value: "tax_document", label: "Tax document" },
  { value: "other", label: "Other" },
];

const docTypeLabel = (t: string) => DOC_TYPES.find((d) => d.value === t)?.label ?? t;
const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : "");

export default function VerificationCenterPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canManage = hasPermission(activeMembership?.permissions ?? [], PERMISSIONS.SETTINGS_MANAGE);

  const { data, isLoading } = useVerification(studioId);
  const createRequest = useCreateVerificationRequest(studioId);
  const addDocument = useAddVerificationDocument(studioId);
  const removeDocument = useRemoveVerificationDocument(studioId);
  const submitRequest = useSubmitVerificationRequest(studioId);

  const [applicantNote, setApplicantNote] = useState("");
  const [docType, setDocType] = useState<VerificationDocumentType>("business_license");
  const fileRef = useRef<HTMLInputElement>(null);

  // Only for the badge preview's name/photo — the verification flow itself
  // doesn't need the profile, so a slow/failed load just falls back to a placeholder.
  const { data: profile } = useBusinessProfile(studioId);

  const request = data?.currentRequest ?? null;
  const editable = request?.status === "draft" || request?.status === "more_info";
  const isVerified = request?.status === "approved";

  const onStart = () => {
    createRequest.mutate(
      { applicantNote: applicantNote.trim() || undefined },
      {
        onSuccess: () => toast.success("Verification request created — add your documents next."),
        onError: (e: unknown) => toast.error((e as Error).message || "Could not start verification"),
      }
    );
  };

  const onUpload = (file: File) => {
    if (!request) return;
    const form = new FormData();
    form.append("file", file);
    form.append("type", docType);
    addDocument.mutate(
      { requestId: request.id, form },
      {
        onSuccess: () => toast.success("Document uploaded"),
        onError: (e: unknown) => toast.error((e as Error).message || "Upload failed"),
      }
    );
  };

  const onSubmit = () => {
    if (!request) return;
    submitRequest.mutate(request.id, {
      onSuccess: () => toast.success("Submitted for review"),
      onError: (e: unknown) => toast.error((e as Error).message || "Could not submit"),
    });
  };

  const timelineEvents: TimelineEvent[] = (data?.history ?? []).map((h) => ({
    id: h.id,
    title: STATUS_META[h.to_status]?.label ?? h.to_status,
    description: h.note ?? undefined,
    timestamp: fmtDate(h.created_at),
    tone: STATUS_META[h.to_status]?.tone ?? "neutral",
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Trust"
        title="Verification Center"
        description="Get the Verified badge on your public listing — it boosts customer trust and your discovery ranking."
        actions={
          data?.verified ? (
            <Badge tone="success">
              <BadgeCheck size={14} /> Verified
            </Badge>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left / main column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Status */}
            {request ? (
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Current request</CardTitle>
                    <CardDescription>{STATUS_META[request.status].blurb}</CardDescription>
                  </div>
                  <Badge tone={STATUS_META[request.status].tone} dot>
                    {STATUS_META[request.status].label}
                  </Badge>
                </CardHeader>

                {request.decisionReason && (request.status === "more_info" || request.status === "rejected" || request.status === "suspended") ? (
                  <p className="mb-4 rounded-lg bg-tertiary-container/40 px-3 py-2 text-sm text-on-surface">
                    <span className="font-medium">Reviewer note:</span> {request.decisionReason}
                  </p>
                ) : null}

                {/* Documents */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-medium text-on-surface">Documents</h4>
                  {request.documents.length === 0 ? (
                    <p className="text-sm text-muted">No documents yet.</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {request.documents.map((doc) => (
                        <li key={doc.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
                          <FileText size={18} className="shrink-0 text-muted" />
                          <div className="min-w-0 flex-1">
                            <a href={doc.url} target="_blank" rel="noreferrer" className="block truncate text-sm text-on-surface hover:underline">
                              {doc.original_name ?? doc.originalName ?? docTypeLabel(doc.type)}
                            </a>
                            <span className="text-xs text-muted">{docTypeLabel(doc.type)}</span>
                          </div>
                          <Badge tone={doc.status === "accepted" ? "success" : doc.status === "rejected" ? "danger" : "neutral"}>
                            {doc.status}
                          </Badge>
                          {editable ? (
                            <button
                              type="button"
                              aria-label="Remove document"
                              className="text-muted hover:text-error"
                              onClick={() =>
                                removeDocument.mutate(
                                  { requestId: request.id, documentId: doc.id },
                                  { onError: (e: unknown) => toast.error((e as Error).message) }
                                )
                              }
                            >
                              <Trash2 size={16} />
                            </button>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}

                  {editable && canManage ? (
                    <>
                      <div className="mt-2 flex flex-wrap items-end gap-2">
                        <div className="w-48">
                          <Select
                            label="Document type"
                            value={docType}
                            onValueChange={(v) => setDocType(v as VerificationDocumentType)}
                            options={DOC_TYPES}
                          />
                        </div>
                        <input
                          ref={fileRef}
                          type="file"
                          className="hidden"
                          accept="image/*,application/pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onUpload(f);
                            e.target.value = "";
                          }}
                        />
                        <Button intent="outline" onClick={() => fileRef.current?.click()} disabled={addDocument.isPending}>
                          <Upload size={16} /> {addDocument.isPending ? "Uploading…" : "Upload document"}
                        </Button>
                        <Button onClick={onSubmit} disabled={request.documents.length === 0 || submitRequest.isPending} className="ml-auto">
                          <Send size={16} /> Submit for review
                        </Button>
                      </div>
                    </>
                  ) : null}
                </div>
              </Card>
            ) : data?.verified ? (
              <Card>
                <EmptyState
                  icon={<ShieldCheck size={40} className="text-secondary" />}
                  title="Your business is verified"
                  description="The Verified badge is live on your public listing. Nothing more to do here."
                />
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Start verification</CardTitle>
                    <CardDescription>
                      {data?.canStart
                        ? "You’re eligible. Add an optional note for the reviewer, then create your request."
                        : "Meet the eligibility criteria on the right, then you can start a verification request."}
                    </CardDescription>
                  </div>
                </CardHeader>
                <Textarea
                  label="Note to reviewer (optional)"
                  placeholder="Anything the reviewer should know…"
                  value={applicantNote}
                  onChange={(e) => setApplicantNote(e.target.value)}
                  rows={3}
                />
                {canManage ? (
                  <Button className="mt-4" onClick={onStart} disabled={!data?.canStart || createRequest.isPending}>
                    {createRequest.isPending ? "Starting…" : "Start verification"}
                  </Button>
                ) : null}
              </Card>
            )}

            {/* Timeline */}
            {timelineEvents.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock size={16} /> Timeline
                  </CardTitle>
                </CardHeader>
                <Timeline events={timelineEvents} />
              </Card>
            ) : null}
          </div>

          {/* Right column — eligibility */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Eligibility</CardTitle>
                  <CardDescription>
                    {data?.eligibility.eligible ? "You meet all requirements." : "Complete these to become eligible."}
                  </CardDescription>
                </div>
              </CardHeader>
              <ul className="flex flex-col gap-3">
                {data?.eligibility.criteria.map((c) => (
                  <li key={c.key} className="flex items-start gap-2.5">
                    {c.met ? (
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-secondary" />
                    ) : (
                      <Circle size={18} className="mt-0.5 shrink-0 text-muted" />
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-on-surface">{c.label}</p>
                      <p className="text-xs text-muted">
                        {c.current} / {c.required}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isVerified ? "Your verified badge" : "What you’ll earn"}</CardTitle>
                <CardDescription>
                  Verification adds the Verified badge to your listing and increases your trust score, which lifts
                  your position in discovery results.
                </CardDescription>
              </CardHeader>
              <VerifiedBadgePreview
                businessName={profile?.name || "Your business"}
                imageUrl={profile?.image_url}
                city={profile?.city}
                active={isVerified}
              />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
