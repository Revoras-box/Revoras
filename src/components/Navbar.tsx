"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import ThemeToggleButton from "@/components/ThemeToggleButton";

interface NavbarProps {
  brandText?: string;
  brandHref?: string;
  navLinks?: Array<{ href: string; label: string }>;
}

const DEFAULT_LINKS = [
  { href: "/user", label: "Explore" },
  { href: "/user/search?hasOffers=true", label: "Offers" },
  { href: "/host/signup", label: "For Business" },
];

export default function Navbar({
  brandText = "Revoras",
  brandHref = "/",
  navLinks = DEFAULT_LINKS,
}: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-1000 w-full border-b border-border glass-nav">
      <div className="shell max-w-shell flex items-center justify-between gap-6 py-3.5">
        {/* Logo */}
        <Link href={brandHref} className="shrink-0 font-headline text-2xl font-extrabold tracking-tight text-primary dark:text-white">
          {brandText}
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  isActive ? "text-on-surface" : "text-secondary-foreground hover:text-on-surface"
                }`}
              >
                {link.label}
                {isActive && <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggleButton />
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-high sm:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="hidden items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Sign up
            <ArrowRight size={15} />
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        // `shell` and not a bare `px-5`, so the panel's links start on the same
        // left edge as the logo directly above them.
        <div className="shell max-w-shell border-t border-border bg-surface py-4 md:hidden animate-dropdown">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2.5 text-center text-sm font-semibold text-on-surface ring-1 ring-border transition-colors hover:bg-surface-container-high"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
