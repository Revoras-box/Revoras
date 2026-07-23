/**
 * The single definition of the customer-facing primary navigation. Both the
 * public marketing navbar (`components/Navbar.tsx`) and the in-app customer nav
 * (`components/user/CustomerNav.tsx`) render from this list, so a logged-out
 * visitor and a logged-in customer see the same words in the same order — the
 * navbar never appears to "change" when they sign in.
 *
 * The first three destinations are public (browsing `/user` doesn't require
 * auth); "Bookings" is account-specific, so it only appears once signed in.
 */
export interface CustomerNavLink {
  href: string;
  label: string;
}

export function customerNavLinks(isAuthenticated: boolean): CustomerNavLink[] {
  const links: CustomerNavLink[] = [
    { href: "/", label: "Home" },
    { href: "/user", label: "Discover" },
    { href: "/user/search?sortBy=recommended", label: "Recommended" },
  ];
  if (isAuthenticated) links.push({ href: "/user/bookings", label: "Bookings" });
  return links;
}
