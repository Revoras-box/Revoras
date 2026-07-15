"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { AdminVerificationDetail, VerificationStatus } from "@/lib/types";

const STATUS_COLORS: Record<VerificationStatus, string> = {
  draft: "bg-gray-500/20 text-gray-400",
  submitted: "bg-blue-500/20 text-blue-400",
  under_review: "bg-amber-500/20 text-amber-400",
  more_info: "bg-orange-500/20 text-orange-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  suspended: "bg-gray-500/20 text-gray-400",
};

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : "—");
const docLabel = (t: string) => t.replace(/_/g, " ");

export default function AdminVerificationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<AdminVerificationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getVerificationRequest(id);
      if (!result.error && result.request) setDetail(result.request);
    } catch (e) {
      console.error("Failed to load request:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (fn: () => Promise<{ error?: string }>, okMessage: string) => {
    setBusy(true);
    try {
      const result = await fn();
      if (result.error) alert(result.error);
      else {
        await load();
        if (okMessage) console.log(okMessage);
      }
    } catch {
      alert("Action failed");
    } finally {
      setBusy(false);
    }
  };

  const onStartReview = () => act(() => api.startVerificationReview(id), "Review started");
  const onApprove = () => {
    if (!confirm("Approve this verification? This turns on the Verified badge and lifts the trust score.")) return;
    const note = prompt("Optional approval note:") || undefined;
    act(() => api.approveVerification(id, note), "Approved");
  };
  const onReject = () => {
    const reason = prompt("Reason for rejection (required):");
    if (!reason) return;
    act(() => api.rejectVerification(id, reason), "Rejected");
  };
  const onSuspend = () => {
    const reason = prompt("Reason for suspension (required):");
    if (!reason) return;
    act(() => api.suspendVerification(id, reason), "Suspended");
  };
  const onRequestInfo = () => {
    const reason = prompt("What additional information is needed? (required)");
    if (!reason) return;
    act(() => api.requestVerificationInfo(id, reason), "Requested more info");
  };
  const onReviewDoc = (documentId: string, docStatus: "accepted" | "rejected") => {
    const note = docStatus === "rejected" ? prompt("Reason (optional):") || undefined : undefined;
    act(() => api.reviewVerificationDocument(id, documentId, docStatus, note), "Document reviewed");
  };
  const onAddNote = () => {
    if (!noteDraft.trim()) return;
    act(() => api.addVerificationNote(id, noteDraft.trim()), "Note added").then(() => setNoteDraft(""));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }
  if (!detail) return <p className="text-secondary-foreground">Request not found.</p>;

  const isOpen = ["submitted", "under_review", "more_info"].includes(detail.status);

  return (
    <div className="max-w-5xl">
      <Link href="/admin/verifications" className="text-sm text-primary hover:underline">
        ← Back to queue
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-headline">Verification review</h1>
          <p className="text-secondary-foreground mt-1 font-mono text-xs">Business {detail.business_id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[detail.status]}`}>
          {detail.status.replace("_", " ")}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        {detail.status === "submitted" ? (
          <button onClick={onStartReview} disabled={busy} className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 disabled:opacity-50">
            Start review
          </button>
        ) : null}
        {isOpen ? (
          <>
            <button onClick={onApprove} disabled={busy} className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/30 disabled:opacity-50">
              Approve
            </button>
            <button onClick={onRequestInfo} disabled={busy} className="px-4 py-2 rounded-lg bg-orange-500/20 text-orange-400 text-sm font-medium hover:bg-orange-500/30 disabled:opacity-50">
              Request more info
            </button>
            <button onClick={onReject} disabled={busy} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50">
              Reject
            </button>
          </>
        ) : null}
        {detail.status === "approved" ? (
          <button onClick={onSuspend} disabled={busy} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 disabled:opacity-50">
            Suspend
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {detail.applicant_note ? (
            <section className="bg-background border border-border rounded-xl p-4">
              <h2 className="text-sm font-semibold text-foreground mb-1">Applicant note</h2>
              <p className="text-sm text-secondary-foreground">{detail.applicant_note}</p>
            </section>
          ) : null}

          {/* Documents */}
          <section className="bg-background border border-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Documents ({detail.documents.length})</h2>
            {detail.documents.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No documents uploaded.</p>
            ) : (
              <ul className="space-y-2">
                {detail.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 border border-border rounded-lg px-3 py-2">
                    <span className="material-symbols-outlined text-secondary-foreground">description</span>
                    <div className="min-w-0 flex-1">
                      <a href={doc.url} target="_blank" rel="noreferrer" className="block truncate text-sm text-foreground hover:underline">
                        {doc.original_name ?? docLabel(doc.type)}
                      </a>
                      <span className="text-xs text-secondary-foreground">{docLabel(doc.type)}</span>
                      {doc.review_note ? <p className="text-xs text-red-400 mt-0.5">{doc.review_note}</p> : null}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${doc.status === "accepted" ? "bg-green-500/20 text-green-400" : doc.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {doc.status}
                    </span>
                    {isOpen ? (
                      <div className="flex gap-1">
                        <button onClick={() => onReviewDoc(doc.id, "accepted")} disabled={busy} title="Accept" className="text-green-400 hover:opacity-80 disabled:opacity-50">
                          <span className="material-symbols-outlined text-lg">check</span>
                        </button>
                        <button onClick={() => onReviewDoc(doc.id, "rejected")} disabled={busy} title="Reject" className="text-red-400 hover:opacity-80 disabled:opacity-50">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Timeline */}
          <section className="bg-background border border-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Timeline</h2>
            <ol className="space-y-3">
              {detail.history.map((h) => (
                <li key={h.id} className="flex gap-3 text-sm">
                  <span className="text-secondary-foreground shrink-0 w-36">{fmt(h.created_at)}</span>
                  <span className="text-foreground">
                    <span className="font-medium">{h.to_status.replace("_", " ")}</span>
                    <span className="text-secondary-foreground"> · {h.actor_type}</span>
                    {h.note ? <span className="text-secondary-foreground"> — {h.note}</span> : null}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Internal notes */}
        <div className="space-y-4">
          <section className="bg-background border border-border rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-1">Internal notes</h2>
            <p className="text-xs text-secondary-foreground mb-3">Admin-only. Never shown to the business.</p>
            <div className="space-y-3 mb-3">
              {detail.notes.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No notes yet.</p>
              ) : (
                detail.notes.map((n) => (
                  <div key={n.id} className="text-sm">
                    <p className="text-foreground">{n.note}</p>
                    <p className="text-xs text-secondary-foreground mt-0.5">
                      {n.admin_name || "Admin"} · {fmt(n.created_at)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Add an internal note…"
              rows={3}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-secondary-foreground focus:outline-none focus:border-primary text-sm"
            />
            <button onClick={onAddNote} disabled={busy || !noteDraft.trim()} className="mt-2 w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50">
              Add note
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
