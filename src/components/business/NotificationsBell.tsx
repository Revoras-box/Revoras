"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useUnreadNotificationCount } from "@/lib/business/hooks/useNotifications";
import { ICON_SIZE } from "@/lib/design-tokens";

export function NotificationsBell() {
  const { data: count } = useUnreadNotificationCount();

  return (
    <Link
      href="/business/notifications"
      className="relative flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={count ? `Notifications, ${count} unread` : "Notifications"}
    >
      <Bell size={ICON_SIZE.md} />
      {count ? (
        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-on-error">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
