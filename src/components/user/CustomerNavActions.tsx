"use client";

import Link from "next/link";
import { Bell, ArrowRight, Store } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useUnreadNotificationCount } from "@/lib/hooks";
import { Badge, Button } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import UserMenu from "./UserMenu";

/**
 * The unread-count fetch lives in its own child so the hook only runs for
 * signed-in customers — rendering it unconditionally would fire an
 * authenticated notifications request for every logged-out visitor.
 */
function NotificationBell() {
  const { data } = useUnreadNotificationCount();
  const unread = data?.count ?? 0;
  return (
    <Link
      href="/user/profile?tab=notifications"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
      aria-label={unread > 0 ? `Notifications (${unread} unread)` : "Notifications"}
    >
      <Bell size={ICON_SIZE.md} />
      {unread > 0 ? (
        <Badge tone="danger" className="absolute -right-0.5 -top-0.5 min-w-4 justify-center px-1 text-[10px]">
          {unread > 9 ? "9+" : unread}
        </Badge>
      ) : null}
    </Link>
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
