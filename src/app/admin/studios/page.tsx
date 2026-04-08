"use client";

import { useEffect, useState, useCallback, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { api, type AdminStudioSummary, type Pagination, type StudioApprovalStatus } from "@/lib/api";

const statusColors: Record<StudioApprovalStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
  suspended: "bg-gray-500/20 text-gray-400",
};

export default function AdminStudiosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [studios, setStudios] = useState<AdminStudioSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [status, setStatus] = useState<string>(searchParams.get("status") || "");

  const loadStudios = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: searchParams.get("page") || "1",
        limit: "15",
      };
      if (search) params.search = search;
      if (status) params.status = status;

      const result = await api.getAdminStudios(params);
      if (!result.error) {
        setStudios(result.studios || []);
        setPagination(result.pagination || null);
      }
    } catch (error) {
      console.error("Failed to load studios:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, search, status]);

  useEffect(() => {
    loadStudios();
  }, [loadStudios]);

  const updateFilters = (newStatus?: string, newSearch?: string): void => {
    const params = new URLSearchParams();
    if (newStatus ?? status) params.set("status", newStatus ?? status);
    if (newSearch ?? search) params.set("search", newSearch ?? search);
    router.push(`/admin/studios?${params.toString()}`);
  };

  const handleApprove = async (id: number): Promise<void> => {
    if (!confirm("Are you sure you want to approve this studio?")) return;
    
    try {
      const result = await api.approveStudio(id);
      if (!result.error) {
        loadStudios();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to approve studio");
    }
  };

  const handleReject = async (id: number): Promise<void> => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;
    
    try {
      const result = await api.rejectStudio(id, reason);
      if (!result.error) {
        loadStudios();
      } else {
        alert(result.error);
      }
    } catch {
      alert("Failed to reject studio");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline">Studios</h1>
          <p className="text-gray-500 mt-1">Manage studio registrations and approvals</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search studios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateFilters()}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E5C487]"
            />
          </div>
          
          <div className="flex gap-2">
            {["", "pending", "approved", "rejected", "suspended"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  updateFilters(s);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  status === s
                    ? "bg-[#E5C487] text-[#1a1a1a]"
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                }`}
              >
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadStudios()}
            className="p-2 bg-[#1a1a1a] text-gray-400 hover:text-white rounded-lg"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* Studios Table */}
      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E5C487]"></div>
          </div>
        ) : studios.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">store</span>
            <p className="text-gray-500">No studios found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#1a1a1a] border-b border-[#222]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Studio</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Coords</th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {studios.map((studio) => (
                <tr key={studio.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/studios/${studio.id}`} className="hover:text-[#E5C487]">
                      <p className="font-medium text-white">{studio.name}</p>
                      <p className="text-sm text-gray-500">
                        {studio.barber_count} barbers • {studio.booking_count} bookings
                      </p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{studio.owner_name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{studio.owner_email || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[studio.approval_status] || "bg-gray-500/20 text-gray-400"}`}>
                      {studio.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-400">{studio.city}, {studio.state}</p>
                  </td>
                  <td className="px-6 py-4">
                    {studio.lat && studio.lng ? (
                      <span className="text-green-400 text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Set
                      </span>
                    ) : (
                      <span className="text-amber-400 text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Missing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {studio.approval_status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(studio.id)}
                            className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                          <button
                            onClick={() => handleReject(studio.id)}
                            className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </>
                      )}
                      <Link
                        href={`/admin/studios/${studio.id}`}
                        className="p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#222]">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} studios
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(pagination.page - 1));
                  router.push(`/admin/studios?${params.toString()}`);
                }}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(pagination.page + 1));
                  router.push(`/admin/studios?${params.toString()}`);
                }}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-[#1a1a1a] text-gray-400 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
