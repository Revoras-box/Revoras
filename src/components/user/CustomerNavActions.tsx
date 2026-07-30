"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ArrowRight, Store } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNotifications, useUnreadNotificationCount, useMutation } from "@/lib/hooks";
import { api } from "@/lib/api";
import { Badge, Button, Popover, PopoverContent, PopoverTrigger } from "@/components/ui";
import { NotificationsPanel, type PanelNotification } from "@/components/notifications/NotificationsPanel";
import { ICON_SIZE } from "@/lib/design-tokens";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import UserMenu from "./UserMenu";

/**
 * The unread-count fetch lives in its own child so the hook only runs for
 * signed-in customers — rendering it unconditionally would fire an
 * authenticated notifications request for every logged-out visitor.
 *
 * Clicking used to navigate to /user/profile?tab=notifications. It now opens the
 * list in place; that tab is still the archive and is linked from the panel's
 * footer. The same reasoning applies as on the business bell — checking a
 * notification shouldn't cost you the page you were on, which for a customer is
 * often a half-finished booking.
 */
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data, refetch } = useUnreadNotificationCount();
  const unread = data?.count ?? 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
      >
        <Bell size={ICON_SIZE.md} />
        {unread > 0 ? (
          <Badge tone="danger" className="absolute -right-0.5 -top-0.5 min-w-4 justify-center px-1 text-[10px]">
            {unread > 9 ? "9+" : unread}
          </Badge>
        ) : null}
      </PopoverTrigger>

      <PopoverContent className="p-0">
        {/* Mounted only while open, so opening the panel is what fetches the
            list — the badge's own count query is the only thing running
            otherwise. Refreshing the count after a read keeps the badge honest
            without waiting for the next poll. */}
        <CustomerNotificationsPanel onChanged={refetch} onNavigate={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function CustomerNotificationsPanel({ onChanged, onNavigate }: { onChanged: () => void; onNavigate: () => void }) {
  const { data, loading, error, refetch } = useNotifications({ limit: 8 });
  const { mutate: markRead } = useMutation(api.markNotificationRead);
  const { mutate: markAllRead } = useMutation(api.markAllNotificationsRead);
  const [markingAll, setMarkingAll] = useState(false);

  const afterWrite = async () => {
    await refetch();
    onChanged();
  };

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
      loading={loading}
      error={Boolean(error)}
      onRetry={() => refetch()}
      onItemClick={async (id) => {
        await markRead(id);
        await afterWrite();
      }}
      onMarkAllRead={async () => {
        setMarkingAll(true);
        try {
          await markAllRead();
          await afterWrite();
        } finally {
          setMarkingAll(false);
        }
      }}
      markingAll={markingAll}
      seeAllHref="/user/profile?tab=notifications"
      onNavigate={onNavigate}
    />
  );
}

/**
 * The right-hand side of the customer navbar, shared by the marketing navbar
 * and the in-app navbar so the two match. It's the ONLY part that differs by
 * auth state: signed-in customers get notifications, their account menu and
 * "Book Now"; visitors get the "For Business" entry point and log in / sign up.
 */
export default function CustomerNavActions() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <ThemeToggleButton />
      {isAuthenticated ? (
        <>
          <NotificationBell />
          <UserMenu />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/user/book">Book Now</Link>
          </Button>
        </>
      ) : (
        <>
          <Link
            href="/host/signup"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:text-on-surface sm:inline-flex"
          >
            <Store size={15} />
            For Business
          </Link>
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high sm:inline-flex"
          >
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">
              Sign up
              <ArrowRight size={15} />
            </Link>
          </Button>
        </>
      )}
    </>
  );
}
