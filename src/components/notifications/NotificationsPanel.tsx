"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/design-tokens";

/**
 * The shape this panel renders, which is neither side's API shape.
 *
 * The customer app and the business dashboard reach the same
 * `/api/notifications` endpoints through different data layers - `useApi` on one
 * side, React Query on the other - and describe the response with different
 * types. Rather than pick a winner and force one half to adopt the other's
 * fetching stack, the panel stays presentational and each bell maps its own rows
 * into this. The mapping is the only place the two differ, and it is three
 * lines.
 *
 * `isRead` is a boolean here even though the API sends `read_at`, a nullable
 * timestamp, because the panel only ever asks the yes/no question. Deriving it
 * at the edge also means the panel cannot repeat the mistake the business
 * dashboard made - reading an `is_read` field that has never existed on this
 * endpoint (the column is `read_at`), so every notification rendered as unread
 * forever.
 */
export interface PanelNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationsPanelProps {
  notifications: PanelNotification[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  onItemClick?: (id: string) => void;
  onMarkAllRead?: () => void;
  markingAll?: boolean;
  /** The full-page list this panel is a preview of. */
  seeAllHref: string;
  onNavigate?: () => void;
}

const formatWhen = (iso: string) => {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export function NotificationsPanel({
  notifications,
  loading,
  error,
  onRetry,
  onItemClick,
  onMarkAllRead,
  markingAll,
  seeAllHref,
  onNavigate,
}: NotificationsPanelProps) {
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    // Width is fixed on desktop but capped to the viewport, so the panel is a
    // panel on a laptop and doesn't overhang the screen edge on a phone.
    <div className="flex w-[min(22rem,calc(100vw-2rem))] flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-on-surface">Notifications</h2>
        {hasUnread && onMarkAllRead ? (
          <Button intent="ghost" size="sm" onClick={onMarkAllRead} loading={markingAll} className="-mr-2 h-8 px-2 text-xs">
            <CheckCheck size={14} /> Mark all read
          </Button>
        ) : null}
      </div>

      {/* The scroll lives here rather than on the whole panel so the header and
          the "See all" footer stay put while the list moves under them. */}
      <div className="max-h-96 overflow-y-auto overscroll-contain">
        {error ? (
          <div className="p-4">
            <ErrorState onRetry={onRetry} description="Couldn't load notifications." />
          </div>
        ) : loading ? (
          <div className="flex flex-col gap-2 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-6">
            <EmptyState icon={<Bell size={ICON_SIZE.lg} />} title="No notifications yet" description="You're all caught up." />
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id}>
                {/* A button only when there's something to do. An already-read
                    notification is inert text, and rendering it as a control
                    would promise an action that does nothing. */}
                {n.isRead ? (
                  <div className="flex items-start gap-3 px-4 py-3">
                    <NotificationBody notification={n} />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onItemClick?.(n.id)}
                    className="flex w-full items-start gap-3 bg-primary-container/20 px-4 py-3 text-left transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  >
                    <NotificationBody notification={n} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-border p-2">
        <Link
          href={seeAllHref}
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        >
          See all notifications
        </Link>
      </div>
    </div>
  );
}

function NotificationBody({ notification }: { notification: PanelNotification }) {
  return (
    <>
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          notification.isRead ? "bg-surface-container-low text-muted" : "bg-primary-container text-on-primary-container"
        )}
      >
        <Bell size={ICON_SIZE.sm} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-on-surface">{notification.title}</span>
          {!notification.isRead ? <Badge tone="primary" dot>New</Badge> : null}
        </span>
        {/* Clamped, not truncated to one line: two lines is enough to tell most
            of these apart, and the full text is one click away on the page. */}
        <span className="mt-0.5 line-clamp-2 block text-sm text-muted">{notification.message}</span>
        <span className="mt-1 block text-xs text-muted">{formatWhen(notification.createdAt)}</span>
      </span>
    </>
  );
}
