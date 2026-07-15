"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCertificates, useCertificateMutations } from "@/lib/business/hooks/useCertificates";
import type { Certificate, MediaScope } from "@/lib/business/types";

const EMPTY = { title: "", issuer: "", issuedDate: "", expiryDate: "", credentialId: "", verificationUrl: "" };
const day = (d: string | null) => (d ? d.slice(0, 10) : "");
const errText = (err: unknown, fallback: string) => (err instanceof Error ? err.message : fallback);

// Shared by the owner Team drawer and My Profile via MediaScope.
export function CertificatesManager({ scope }: { scope: MediaScope }) {
  const { data: certificates, isLoading } = useCertificates(scope);
  const { add, update, remove } = useCertificateMutations(scope);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showForm, setShowForm] = useState(false);

  const reset = () => {
    setForm(EMPTY);
    setFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (c: Certificate) => {
    setForm({
      title: c.title,
      issuer: c.issuer,
      issuedDate: day(c.issued_date),
      expiryDate: day(c.expiry_date),
      credentialId: c.credential_id ?? "",
      verificationUrl: c.verification_url ?? "",
    });
    setEditingId(c.id);
    setFile(null);
    setShowForm(true);
  };

  const submit = () => {
    if (!form.title.trim() || !form.issuer.trim()) {
      toast.error("Title and issuer are required");
      return;
    }
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("issuer", form.issuer.trim());
    if (form.issuedDate) fd.append("issuedDate", form.issuedDate);
    if (form.expiryDate) fd.append("expiryDate", form.expiryDate);
    if (form.credentialId.trim()) fd.append("credentialId", form.credentialId.trim());
    if (form.verificationUrl.trim()) fd.append("verificationUrl", form.verificationUrl.trim());
    if (file) fd.append("file", file);

    const opts = {
      onSuccess: () => {
        toast.success(editingId ? "Certificate updated" : "Certificate added");
        reset();
      },
      onError: (err: unknown) => toast.error(errText(err, "Couldn't save certificate")),
    };
    if (editingId) update.mutate({ certId: editingId, form: fd }, opts);
    else add.mutate(fd, opts);
  };

  if (isLoading) return <Skeleton className="h-40 rounded-xl" />;

  const list = certificates ?? [];

  return (
    <div className="flex flex-col gap-4">
      {list.length === 0 && !showForm ? (
        <EmptyState title="No certificates yet" description="Add certifications to build customer trust." className="py-8" />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((c) => (
            <div key={c.id} className="flex gap-3 rounded-xl border border-border p-3">
              {c.media_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.media_url} alt={c.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="font-medium text-on-surface">{c.title}</div>
                <div className="text-sm text-muted">{c.issuer}</div>
                <div className="text-xs text-muted">
                  {[day(c.issued_date), c.expiry_date ? `exp ${day(c.expiry_date)}` : ""].filter(Boolean).join(" · ")}
                </div>
                {c.credential_id ? <div className="text-xs text-muted">ID: {c.credential_id}</div> : null}
                {c.verification_url ? (
                  <a
                    href={c.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Verify <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                <button type="button" title="Edit" onClick={() => startEdit(c)} className="text-muted hover:text-on-surface">
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => remove.mutate(c.id, { onSuccess: () => toast.success("Certificate removed") })}
                  className="text-error hover:opacity-80"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border p-3">
          <Input label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          <Input label="Issuer" value={form.issuer} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Issue date" type="date" value={form.issuedDate} onChange={(e) => setForm((f) => ({ ...f, issuedDate: e.target.value }))} />
            <Input label="Expiry date" type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} />
          </div>
          <Input label="Credential ID" value={form.credentialId} onChange={(e) => setForm((f) => ({ ...f, credentialId: e.target.value }))} />
          <Input label="Verification URL" placeholder="https://…" value={form.verificationUrl} onChange={(e) => setForm((f) => ({ ...f, verificationUrl: e.target.value }))} />
          <label className="text-sm text-muted">
            Certificate image (optional)
            <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <div className="flex gap-2">
            <Button size="sm" loading={add.isPending || update.isPending} onClick={submit}>
              {editingId ? "Update" : "Add"} certificate
            </Button>
            <Button size="sm" intent="ghost" onClick={reset}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button size="sm" intent="secondary" onClick={() => setShowForm(true)}>
          <Plus size={16} /> Add certificate
        </Button>
      )}
    </div>
  );
}
