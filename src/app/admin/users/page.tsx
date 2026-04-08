"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  booking_count: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: searchParams.get("page") || "1",
        limit: "20",
      };
      if (search) params.search = search;

      const result = await api.getAdminUsers(params);
      if (!result.error) {
        setUsers(result.users || []);
        setPagination(result.pagination || null);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-headline">Users</h1>
          <p className="text-gray-500 mt-1">Manage platform users</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#111] border border-[#222] rounded-xl p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E5C487]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-[#E5C487] text-[#1a1a1a] rounded-lg font-medium hover:bg-[#d4b377] transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => loadUsers()}
            className="p-2 bg-[#1a1a1a] text-gray-400 hover:text-white rounded-lg"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E5C487]"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">people</span>
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#1a1a1a] border-b border-[#222]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#E5C487]/20 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#E5C487] text-sm">person</span>
                      </div>
                      <p className="font-medium text-white">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone || "-"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{user.booking_count}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
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
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("page", String(pagination.page - 1));
                  router.push(`/admin/users?${params.toString()}`);
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
                  router.push(`/admin/users?${params.toString()}`);
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
