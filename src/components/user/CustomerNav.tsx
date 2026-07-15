"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Search as SearchIcon, CalendarClock, UserRound } from "lucide-react";
import { TopNav, BottomNav, Badge, Button } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import { useUnreadNotificationCount } from "@/lib/hooks";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import UserMenu from "./UserMenu";

const NAV_LINKS = [
  { href: "/user", label: "Discover" },
  { href: "/user/search", label: "Search" },
  { href: "/user/bookings", label: "Bookings" },
];

const TAB_ITEMS = [
  { href: "/user", label: "Discover", icon: <Compass size={ICON_SIZE.md} /> },
  { href: "/user/search", label: "Search", icon: <SearchIcon size={ICON_SIZE.md} /> },
  { href: "/user/bookings", label: "Bookings", icon: <CalendarClock size={ICON_SIZE.md} /> },
  { href: "/user/profile", label: "Profile", icon: <UserRound size={ICON_SIZE.md} /> },
];

export default function CustomerNav() {
  const pathname = usePathname();
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.count ?? 0;

  const isActive = (href: string) => (href === "/user" ? pathname === "/user" : pathname.startsWith(href));

  return (
    <>
      <TopNav
        logo={
          <Link href="/user" className="text-xl font-bold tracking-tighter text-primary font-headline">
            Revoras
          </Link>
        }
        items={NAV_LINKS.map((link) => ({ ...link, active: isActive(link.href) }))}
        linkComponent={Link}
        actions={
          <>
            <ThemeToggleButton />
            <Link
              href="/user/profile?tab=notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
            >
              <Bell size={ICON_SIZE.md} />
              {unreadCount > 0 ? (
                <Badge tone="danger" className="absolute -right-0.5 -top-0.5 min-w-4 justify-center px-1 text-[10px]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              ) : null}
            </Link>
            <UserMenu />
            <Button asChild size="sm" className="hidden md:inline-flex">
              <Link href="/user/book">Book Now</Link>
            </Button>
          </>
        }
      />
      <BottomNav
        items={TAB_ITEMS.map((item) => ({ ...item, active: isActive(item.href) }))}
        linkComponent={Link}
      />
    </>
  );
}
