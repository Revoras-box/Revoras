import Link from "next/link";

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Discover studios", href: "/user" },
      { label: "Search", href: "/user/search" },
      { label: "Offers", href: "/user/search?hasOffers=true" },
      { label: "Top rated", href: "/user/search?sortBy=rating" },
    ],
  },
  {
    heading: "For business",
    links: [
      { label: "List your business", href: "/host/signup" },
      { label: "Why Revoras", href: "/host/signup" },
      { label: "Business login", href: "/login-barber" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto max-w-screen-2xl px-5 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="font-headline text-2xl font-extrabold text-primary">Revoras</div>
            <p className="mt-3 max-w-xs text-sm text-secondary-foreground">
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
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Revoras. All rights reserved.</span>
          <span>Made for beauty &amp; wellness businesses across India.</span>
        </div>
      </div>
    </footer>
  );
}
