"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Store, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { customerNavLinks } from "@/lib/customer-nav";
import CustomerNavActions from "@/components/user/CustomerNavActions";

interface NavbarProps {
  brandText?: string;
  brandHref?: string;
  /**
   * The in-app customer surface (`CustomerNav`) renders this same bar but owns
   * mobile navigation through a bottom tab bar, so it hides this hamburger to
   * avoid two competing mobile menus. Marketing pages leave it on (default).
   */
  showMobileMenu?: boolean;
}

/**
 * The public / marketing navbar. It deliberately renders the SAME primary links
 * (via `customerNavLinks`) and the SAME right-hand actions (via
 * `CustomerNavActions`) as the in-app `CustomerNav`, so a customer who lands
 * here logged out and then signs in doesn't see the navigation change out from
 * under them — only the auth-dependent actions swap (log in / sign up ⇄
 * notifications / account / Book Now). The business/owner surface keeps its own
 * distinct dashboard nav; this parity is a customer-experience concern only.
 */
export default function Navbar({ brandText = "Revoras", brandHref = "/", showMobileMenu = true }: NavbarProps) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = customerNavLinks(isAuthenticated);
  const isActive = (href: string) => pathname === href.split("?")[0];

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
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  active ? "text-on-surface" : "text-secondary-foreground hover:text-on-surface"
                }`}
              >
                {link.label}
                {active && <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-primary" />}
              </Link>
            );
          })}
        </div>

        {/* Right actions — shared with the in-app navbar, auth-aware. */}
        <div className="flex items-center gap-2 md:gap-3">
          <CustomerNavActions />

          {/* Mobile toggle */}
          {showMobileMenu && (
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container-high md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile panel */}
      {showMobileMenu && open && (
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
            {isAuthenticated ? (
              <Link
                href="/user/book"
                onClick={() => setOpen(false)}
                className="rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Book Now
              </Link>
            ) : (
              <>
                <Link
                  href="/host/signup"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-center text-sm font-medium text-secondary-foreground transition-colors hover:bg-surface-container-high"
                >
                  <Store size={15} />
                  For Business
                </Link>
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
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground"
                >
                  Sign up
                  <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
