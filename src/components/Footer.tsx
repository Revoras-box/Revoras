import Link from "next/link";

/**
 * The single footer for every page — marketing, auth, and the customer app
 * alike. Previously there were three (Footer, UserFooter, FooterExperience)
 * with drifting links and a hardcoded "© 2024" in one of them.
 */
const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Discover studios", href: "/user" },
      { label: "Search", href: "/user/search" },
      { label: "Offers", href: "/user/search?hasOffers=true" },
      { label: "Top rated", href: "/user/search?sortBy=rating" },
      { label: "My bookings", href: "/user/bookings" },
    ],
  },
  {
    heading: "For business",
    links: [
      { label: "List your business", href: "/host/signup" },
      { label: "Business login", href: "/login-barber" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="shell max-w-shell py-14 md:py-16">
        {/* Named spans rather than `md:grid-cols-[1.4fr_1fr_1fr_1fr]`: arbitrary
            track lists can silently no-op under this project's Tailwind v4
            setup, and four columns at 768px squeezed the link lists to the
            point of wrapping anyway. Two columns on small screens, then the
            brand block takes a double span once there's room. */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-5">
          <div className="col-span-2">
            <div className="font-headline text-2xl font-extrabold text-primary">Revoras</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-secondary-foreground">
              Beauty &amp; wellness, booked beautifully. Discover trusted salons, barbers, spas and pros near you.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{col.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-secondary-foreground transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center text-xs text-muted sm:flex-row sm:text-left">
          <span>© {new Date().getFullYear()} Revoras. All rights reserved.</span>
          <span>Made for beauty &amp; wellness businesses across India.</span>
        </div>
      </div>
    </footer>
  );
}
