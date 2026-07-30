"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { NotificationsPanel, type PanelNotification } from "@/components/notifications/NotificationsPanel";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/business/hooks/useNotifications";
import { ICON_SIZE } from "@/lib/design-tokens";

/**
 * The bell used to be a link to /business/notifications. Reading a notification
 * is a glance, not a destination - navigating away costs the page you were on
 * and a trip back, which is why every platform that does this at scale answers
 * the click in place. The full page still exists and is still linked from the
 * panel's footer; it is now the archive rather than the only way in.
 *
 * The list query lives in the panel child so it only runs once the popover is
 * open. Mounting it alongside the badge would fetch a page of notifications for
 * every dashboard view, for a panel most of those views never open. The
 * unread-count query stays out here, because the badge does need it always.
 */
export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { data: count } = useUnreadNotificationCount();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={count ? `Notifications, ${count} unread` : "Notifications"}
      >
        <Bell size={ICON_SIZE.md} />
        {count ? (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-on-error">
            {count > 9 ? "9+" : count}
          </span>
        ) : null}
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <BusinessNotificationsPanel onNavigate={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function BusinessNotificationsPanel({ onNavigate }: { onNavigate: () => void }) {
  const { data, isLoading, isError, refetch } = useNotifications({ limit: 8 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // `read_at` is the field the API actually sends; the panel only needs the
  // yes/no. See NotificationsPanel for the bug this shape prevents.
  const notifications: PanelNotification[] = (data?.notifications ?? []).map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    createdAt: n.created_at,
    isRead: Boolean(n.read_at),
  }));

  return (
    <NotificationsPanel
      notifications={notifications}
      loading={isLoading}
      error={isError}
      onRetry={() => refetch()}
      onItemClick={(id) => markRead.mutate(id)}
      onMarkAllRead={() => markAllRead.mutate()}
      markingAll={markAllRead.isPending}
      seeAllHref="/business/notifications"
      onNavigate={onNavigate}
    />
  );
}
