"use client";

import { CalendarCheck, CheckCircle2, Wallet } from "lucide-react";
import { Avatar, Button, Card, Skeleton, StatCard } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import type { Profile, ProfileStats } from "@/lib/types";

const rupees = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const memberSince = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

/**
 * Who this account belongs to, and what it has done.
 *
 * The page previously opened on the word "Profile" and a row of tabs — nothing
 * that identified the person whose profile it was. An account page's first job
 * is to confirm you are looking at your own account, which is why every mature
 * one leads with name, contact and standing.
 *
 * The three figures come from `stats` on the existing `GET /api/profile`
 * response. They were already being fetched and thrown away on every load; no
 * new endpoint, no new query.
 *
 * Two things are deliberately absent. There is no "Verified" chip, because
 * `email_verified` is not among the columns that endpoint returns — the badge
 * would be decoration asserting something this page cannot actually check. And
 * `stats.loyaltyPoints` is not shown: the backend computes it as
 * `completedBookings * 10` and its own comment calls a real tier system a later
 * product decision, so surfacing "points" would imply a loyalty programme that
 * does not exist yet.
 */
export function ProfileHeader({
  user,
  stats,
  loading,
  onEdit,
}: {
  user?: Profile;
  stats?: ProfileStats;
  loading?: boolean;
  onEdit: () => void;
}) {
  if (loading || !user) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const since = memberSince(user.created_at);

  return (
    <div className="flex flex-col gap-4">
      <Card padding="lg">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar src={user.avatar_url} name={user.name} size="xl" />
            <div className="min-w-0">
              <h1 className="font-headline text-2xl font-bold text-on-surface truncate">{user.name}</h1>
              <p className="text-sm text-muted truncate">{user.email}</p>
              {/* Phone is optional on this account type, so the line only
                  appears once there is something to put in it. */}
              <p className="mt-1 text-xs text-muted">
                {user.phone ? `${user.phone} · ` : ""}
                {since ? `Member since ${since}` : null}
              </p>
            </div>
          </div>
          <Button intent="outline" size="sm" onClick={onEdit} className="shrink-0">
            Edit profile
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total bookings" value={stats?.totalBookings ?? 0} icon={<CalendarCheck size={ICON_SIZE.sm} />} />
        <StatCard label="Completed" value={stats?.completedBookings ?? 0} icon={<CheckCircle2 size={ICON_SIZE.sm} />} />
        <StatCard label="Total spent" value={rupees(stats?.totalSpent ?? 0)} icon={<Wallet size={ICON_SIZE.sm} />} />
      </div>
    </div>
  );
}
