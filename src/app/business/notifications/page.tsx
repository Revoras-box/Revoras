"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/lib/business/hooks/useNotifications";
import { ICON_SIZE } from "@/lib/design-tokens";

export default function NotificationsPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useNotifications({ unreadOnly, page, limit: 20 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Updates about your bookings and account."
        actions={
          <div className="flex items-center gap-2">
            <Button intent={unreadOnly ? "primary" : "outline"} size="sm" onClick={() => setUnreadOnly((v) => !v)}>
              {unreadOnly ? "Showing unread" : "All notifications"}
            </Button>
            <Button intent="ghost" size="sm" onClick={() => markAllRead.mutate()} loading={markAllRead.isPending}>
              <CheckCheck size={16} /> Mark all read
            </Button>
          </div>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load notifications." />
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : data && data.notifications.length > 0 ? (
        <>
          <div className="flex flex-col divide-y divide-border rounded-2xl border border-border overflow-hidden">
            {data.notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read_at && markRead.mutate(n.id)}
                className={cn(
                  "flex items-start gap-3 p-4 text-left w-full transition-colors hover:bg-surface-container-low",
                  !n.read_at && "bg-primary-container/20"
                )}
              >
                <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", n.read_at ? "bg-surface-container-low text-muted" : "bg-primary-container text-on-primary-container")}>
                  <Bell size={ICON_SIZE.sm} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-on-surface">{n.title}</span>
                    {!n.read_at ? <Badge tone="primary">New</Badge> : null}
                  </div>
                  <p className="text-sm text-muted mt-0.5">{n.message}</p>
                  <span className="text-xs text-muted mt-1 block">
                    {new Date(n.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {data.pagination.pages > 1 ? (
            <Pagination page={data.pagination.page} pages={data.pagination.pages} onPageChange={setPage} className="mt-4" />
          ) : null}
        </>
      ) : (
        <Card>
          <EmptyState
            icon={<Bell size={ICON_SIZE.lg} />}
            title={unreadOnly ? "No unread notifications" : "No notifications yet"}
            description="You're all caught up."
          />
        </Card>
      )}
    </div>
  );
}
