"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, CalendarClock, UserRound, Tag, LogIn } from "lucide-react";
import { BottomNav } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";

/**
 * The in-app customer top bar IS the marketing navbar — the same `Navbar`
 * component the homepage renders — so the two are pixel-identical instead of a
 * hand-copied look-alike that kept drifting (logo size, link styling, container
 * width). Its hamburger is suppressed here because mobile navigation on the
 * in-app surface is the `BottomNav` tab bar below, not a dropdown.
 *
 * Focused funnel routes own the bottom of the screen. Each renders its own
 * fixed action bar (Continue / Pay), and the tab bar sits at the same
 * `bottom-0` with a far higher z-index (--z-sticky 1100 vs the bar's 40) - so
 * on a phone the tab bar rendered ON TOP of the primary CTA and swallowed the
 * tap. A checkout also shouldn't offer tab navigation competing with "Pay".
 * Matched exactly (or as a path segment) so "/user/bookings" - which is NOT a
 * funnel - doesn't match the "/user/book" prefix.
 */
const FUNNEL_ROUTES = ["/user/book", "/user/checkout"];

// Bottom tabs mirror the top nav's first two destinations, then diverge by auth
// state: a signed-in customer gets Bookings + Profile (account things), a
// visitor gets Offers + Log in — so the tab bar is never a dead end that
// bounces them to a login wall.
const AUTHED_TABS = [
  { href: "/user", label: "Home", icon: <Home size={ICON_SIZE.md} /> },
  { href: "/user/search", label: "Discover", icon: <Compass size={ICON_SIZE.md} /> },
  { href: "/user/bookings", label: "Bookings", icon: <CalendarClock size={ICON_SIZE.md} /> },
  { href: "/user/profile", label: "Profile", icon: <UserRound size={ICON_SIZE.md} /> },
];

const GUEST_TABS = [
  { href: "/user", label: "Home", icon: <Home size={ICON_SIZE.md} /> },
  { href: "/user/search", label: "Discover", icon: <Compass size={ICON_SIZE.md} /> },
  { href: "/user/search?hasOffers=true", label: "Offers", icon: <Tag size={ICON_SIZE.md} /> },
  { href: "/login", label: "Log in", icon: <LogIn size={ICON_SIZE.md} /> },
];

export default function CustomerNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // `/` and `/user` are prefixes of many routes (every path starts with "/",
  // and "/user/search" starts with "/user"), so they must match exactly or they
  // light up everywhere. Deeper routes match themselves or a sub-path segment.
  const isActive = (href: string) => {
    const path = href.split("?")[0];
    if (path === "/" || path === "/user") return pathname === path;
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  const inFunnel = FUNNEL_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

  const tabItems = isAuthenticated ? AUTHED_TABS : GUEST_TABS;

  return (
    <>
      <Navbar brandHref="/user" showMobileMenu={false} />
      {inFunnel ? null : (
        <BottomNav
          items={tabItems.map((item) => ({ ...item, active: isActive(item.href) }))}
          linkComponent={Link}
        />
      )}
    </>
  );
}
