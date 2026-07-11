"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "@/components/ThemeToggleButton";

interface NavbarProps {
  brandText?: string;
  brandHref?: string;
  navLinks?: Array<{ href: string; label: string }>;
}

export default function Navbar({
  brandText = "Revoras",
  brandHref = "/",
  navLinks =
  [
    { href: "/services", label: "Services" },
    { href: "/barbers", label: "Barbers" },
    { href: "/locations", label: "Locations" },
    { href: "/experience", label: "Experience" },
  ]
}: NavbarProps) {

  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 w-full z-1000 backdrop-blur-xl bg-background/60 border-b border-border">

      <div className="flex justify-between items-center w-full px-8 py-5 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link
          href={brandHref}
          className="text-2xl font-bold text-primary"
        >
          {brandText}
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-10 items-center">

          {navLinks.map((link) => {

            const isActive = pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm uppercase tracking-widest transition relative
                ${isActive
                    ? "text-primary"
                    : "text-secondary-foreground hover:text-primary"
                  }`}
              >
                {link.label}

                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary" />
                )}

              </Link>
            );
          })}

        </div>


        {/* Right */}
        <div className="flex items-center gap-6">

          <ThemeToggleButton className="-mr-1" />

          <Link href="/login-barber" className="text-sm uppercase tracking-widest text-secondary-foreground hover:text-primary transition-colors">
            Join as Barber
          </Link>

          <Link href="/login" className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/80 transition-colors">
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}