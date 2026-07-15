"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { AdminVerificationRow, VerificationStatus } from "@/lib/types";

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under review" },
  { value: "more_info", label: "More info" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

const STATUS_COLORS: Record<VerificationStatus, string> = {
  draft: "bg-gray-500/20 text-gray-400",
  submitted: "bg-blue-500/20 text-blue-400",
  under_review: "bg-amber-500/20 text-amber-400",
  more_info: "bg-orange-500/20 text-orange-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  suspended: "bg-gray-500/20 text-gray-400",
};

const fmt = (d: string | null) => (d ? new Date(d).toLocaleDateString() : "—");

export default function AdminVerificationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<AdminVerificationRow[]>([]);
  const [counts, setCounts] = useState<Partial<Record<VerificationStatus, number>>>({});
  const [loading, setLoading] = useState(true);
  const status = searchParams.get("status") || "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getVerificationQueue({ status: status || undefined, limit: 25 });
      if (!result.error) {
        setRows(result.requests || []);
        setCounts(result.counts || {});
      }
    } catch (e) {
      console.error("Failed to load verification queue:", e);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = (s: string) => router.push(`/admin/verifications${s ? `?status=${s}` : ""}`);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-headline">Verifications</h1>
        <p className="text-secondary-foreground mt-1">Review business trust-verification requests</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map((tab) => {
          const count = tab.value ? counts[tab.value as VerificationStatus] : undefined;
          return (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === tab.value ? "bg-primary text-primary-foreground" : "bg-card text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
              {count != null ? <span className="ml-1.5 opacity-70">({count})</span> : null}
            </button>
          );
        })}
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-secondary-foreground mb-2">verified</span>
            <p className="text-secondary-foreground">No verification requests</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-secondary-foreground">
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0 hover:bg-card/50">
                  <td className="px-4 py-3 text-foreground font-medium">{row.business_name}</td>
                  <td className="px-4 py-3 text-secondary-foreground">{row.business_city || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
                      {row.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary-foreground">{fmt(row.submitted_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/verifications/${row.id}`} className="text-primary hover:underline">
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
