"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { FileText, Upload, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDocuments, useAddDocument, useRemoveDocument } from "@/lib/business/hooks/useOnboarding";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

/**
 * Compulsory document upload (PAN / GST / other). This is a plain "keep it on
 * file" upload straight to storage - NOT the eligibility-gated, admin-reviewed
 * verification flow (which a brand-new business can't satisfy). At least one
 * document is required to continue.
 */
const DOC_TYPES = [
  { value: "pan", label: "PAN card" },
  { value: "gst", label: "GST certificate" },
  { value: "other", label: "Other document" },
];
const DOC_LABEL: Record<string, string> = { pan: "PAN card", gst: "GST certificate", other: "Other document" };
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,application/pdf";

export function StepVerification({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: documents, isLoading } = useDocuments(studioId);
  const addDocument = useAddDocument(studioId);
  const removeDocument = useRemoveDocument(studioId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("pan");
  const [uploading, setUploading] = useState(false);

  const hasDoc = (documents || []).length > 0;

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await addDocument.mutateAsync({ file, docType });
      toast.success("Document uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 8 of 10"
        title="Documents"
        description="Upload your business documents (PAN, GST or another). At least one is required to continue — we simply keep them on file, there's no verification step."
      />

      <div className="flex max-w-2xl flex-col gap-4">
        <Card className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Select label="Document type" className="sm:w-56" value={docType} onValueChange={setDocType} options={DOC_TYPES} />
            <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={(e) => handleFile(e.target.files)} />
            <Button onClick={() => inputRef.current?.click()} loading={uploading}>
              <Upload size={16} /> Upload document
            </Button>
          </div>
          <p className="text-xs text-muted">JPG, PNG, WEBP or PDF, up to 5MB.</p>
        </Card>

        {isLoading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : !hasDoc ? (
          <Card>
            <EmptyState
              icon={<FileText size={28} />}
              title="No documents yet"
              description="Upload at least one document (PAN, GST or other) to continue."
            />
          </Card>
        ) : (
          <Card className="flex flex-col divide-y divide-border p-0">
            {(documents || []).map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-on-surface">{DOC_LABEL[doc.doc_type] || doc.doc_type}</span>
                    <Badge tone="neutral">Uploaded</Badge>
                  </div>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-xs text-muted hover:text-primary hover:underline"
                  >
                    {doc.original_name || "View document"}
                  </a>
                </div>
                <button
                  className="rounded-lg p-2 text-error hover:bg-error/10"
                  aria-label="Remove document"
                  onClick={() => removeDocument.mutate(doc.id, { onSuccess: () => toast.success("Document removed") })}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </Card>
        )}
      </div>

      <WizardFooter
        onPrev={goPrev}
        onNext={() => goNext()}
        onExit={exit}
        nextDisabled={!hasDoc}
        nextLoading={saving}
        hint={!hasDoc ? "Upload at least one document to continue." : undefined}
      />
    </div>
  );
}
