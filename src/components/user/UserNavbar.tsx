"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const navLinks = [
  { href: "/user", label: "Experience" },
  { href: "/user/discover", label: "Discover" },
  { href: "/user/bookings", label: "Bookings" },
];

export default function UserNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/user") return pathname === "/user";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-md shadow-elevated px-12 py-4 flex justify-between items-center">
      <div className="flex items-center gap-12">
        <Link href="/user" className="text-2xl font-bold tracking-tighter text-primary font-headline">
          Revoras
        </Link>
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-headline tracking-tight transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted font-medium hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <ThemeToggleButton className="-mr-1" />
        <button className="material-symbols-outlined text-muted hover:text-primary transition-colors">
          notifications
        </button>
        <UserMenu />
        <Link
          href="/user/book"
          className="bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground px-6 py-2.5 rounded-xl font-headline font-bold text-sm tracking-tight active:scale-95 transition-transform"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
