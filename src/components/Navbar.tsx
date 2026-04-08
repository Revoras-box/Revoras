"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="fixed top-0 w-full z-1000 backdrop-blur-xl bg-black/60 border-b border-white/5">

      <div className="flex justify-between items-center w-full px-8 py-5 max-w-screen-2xl mx-auto">

        {/* Logo */}
        <Link
          href={brandHref}
          className="text-2xl font-bold text-[#C8A96E]"
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
                    ? "text-[#C8A96E]"
                    : "text-gray-500 hover:text-[#C8A96E]"
                  }`}
              >
                {link.label}

                {isActive && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#C8A96E]" />
                )}

              </Link>
            );
          })}

        </div>


        {/* Right */}
        <div className="flex items-center gap-6">

          <Link href="/login-barber" className="text-sm uppercase tracking-widest text-gray-500 hover:text-[#C8A96E] transition-colors">
            Join as Barber
          </Link>

          <Link href="/login" className="bg-[#C8A96E] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#b8946e] transition-colors">
            Login
          </Link>

        </div>

      </div>

    </nav>
  );
}