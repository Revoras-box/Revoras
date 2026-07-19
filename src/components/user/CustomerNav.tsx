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
  { href: "/user/search?hasOffers=true", label: "Offers" },
  { href: "/user/bookings", label: "Bookings" },
];

const TAB_ITEMS = [
  { href: "/user", label: "Discover", icon: <Compass size={ICON_SIZE.md} /> },
  { href: "/user/search", label: "Search", icon: <SearchIcon size={ICON_SIZE.md} /> },
  { href: "/user/bookings", label: "Bookings", icon: <CalendarClock size={ICON_SIZE.md} /> },
  { href: "/user/profile", label: "Profile", icon: <UserRound size={ICON_SIZE.md} /> },
];

/**
 * Focused funnel routes own the bottom of the screen. Each renders its own
 * fixed action bar (Continue / Pay), and the tab bar sits at the same
 * `bottom-0` with a far higher z-index (--z-sticky 1100 vs the bar's 40) - so
 * on a phone the tab bar rendered ON TOP of the primary CTA and swallowed the
 * tap. A checkout also shouldn't offer tab navigation competing with "Pay".
 * Matched exactly (or as a path segment) so "/user/bookings" - which is NOT a
 * funnel - doesn't match the "/user/book" prefix.
 */
const FUNNEL_ROUTES = ["/user/book", "/user/checkout"];

export default function CustomerNav() {
  const pathname = usePathname();
  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.count ?? 0;

  const isActive = (href: string) => (href === "/user" ? pathname === "/user" : pathname.startsWith(href));
  const inFunnel = FUNNEL_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  return (
    <>
      <TopNav
        logo={
          // Jade wordmark in light (warm cream surface carries it); white in
          // dark, where the nav is near-black chrome and the accent budget is
          // spent on actions rather than the logo.
          <Link href="/user" className="text-xl font-bold tracking-tighter text-primary dark:text-white font-headline">
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
      {inFunnel ? null : (
        <BottomNav
          items={TAB_ITEMS.map((item) => ({ ...item, active: isActive(item.href) }))}
          linkComponent={Link}
        />
      )}
    </>
  );
}
