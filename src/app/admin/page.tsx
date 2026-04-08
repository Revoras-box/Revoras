"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface DashboardStats {
  studios: {
    pending: number;
    approved: number;
    rejected: number;
    suspended: number;
    total: number;
  };
  users: { total: number };
  bookings: {
    total: number;
    completed: number;
    upcoming: number;
    revenue: number;
  };
  recentPendingStudios: Array<{
    id: number;
    name: string;
    city: string;
    state: string;
    created_at: string;
  }>;
  recentActivity: Array<{
    id: number;
    admin_name: string;
    action: string;
    entity_type: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await api.getAdminDashboard();
      if (result.error) {
        setError(result.error);
      } else {
        setStats(result as DashboardStats);
      }
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E5C487]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-4xl text-red-400 mb-2">error</span>
        <p className="text-gray-400">{error}</p>
        <button onClick={loadDashboard} className="mt-4 text-[#E5C487] hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white font-headline">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="store"
          label="Pending Studios"
          value={stats?.studios.pending || 0}
          color="amber"
          href="/admin/studios?status=pending"
        />
        <StatCard
          icon="check_circle"
          label="Approved Studios"
          value={stats?.studios.approved || 0}
          color="green"
        />
        <StatCard
          icon="people"
          label="Total Users"
          value={stats?.users.total || 0}
          color="blue"
        />
        <StatCard
          icon="payments"
          label="Monthly Revenue"
          value={`$${(stats?.bookings.revenue || 0).toLocaleString()}`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Studios */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Pending Approval</h2>
            <Link
              href="/admin/studios?status=pending"
              className="text-sm text-[#E5C487] hover:underline"
            >
              View all
            </Link>
          </div>

          {stats?.recentPendingStudios.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending studios</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentPendingStudios.map((studio) => (
                <Link
                  key={studio.id}
                  href={`/admin/studios/${studio.id}`}
                  className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
                >
                  <div>
                    <p className="font-medium text-white">{studio.name}</p>
                    <p className="text-sm text-gray-500">
                      {studio.city}, {studio.state}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                      Pending
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(studio.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>

          {stats?.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-4">
              {stats?.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border-b border-[#222] last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E5C487]/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#E5C487] text-sm">
                      {getActivityIcon(activity.action)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.admin_name || "System"}</span>{" "}
                      {formatAction(activity.action)} {activity.entity_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bookings Summary */}
      <div className="mt-8 bg-[#111] border border-[#222] rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-6">Bookings Summary (Last 30 Days)</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{stats?.bookings.total || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total Bookings</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">{stats?.bookings.completed || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{stats?.bookings.upcoming || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  href,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: "amber" | "green" | "blue" | "purple";
  href?: string;
}) {
  const colorClasses = {
    amber: "bg-amber-500/20 text-amber-400",
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  const content = (
    <div className={`bg-[#111] border border-[#222] rounded-xl p-6 ${href ? "hover:border-[#333] transition-colors cursor-pointer" : ""}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function getActivityIcon(action: string): string {
  switch (action) {
    case "approve_studio":
      return "check_circle";
    case "reject_studio":
      return "cancel";
    case "suspend_studio":
      return "block";
    case "update_studio":
      return "edit";
    case "login":
      return "login";
    default:
      return "history";
  }
}

function formatAction(action: string): string {
  switch (action) {
    case "approve_studio":
      return "approved";
    case "reject_studio":
      return "rejected";
    case "suspend_studio":
      return "suspended";
    case "update_studio":
      return "updated";
    case "geocode_studio":
      return "geocoded";
    case "login":
      return "logged in";
    default:
      return action.replace(/_/g, " ");
  }
}
