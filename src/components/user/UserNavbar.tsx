"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/60 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] px-12 py-4 flex justify-between items-center">
      <div className="flex items-center gap-12">
        <Link href="/user" className="text-2xl font-bold tracking-tighter text-[#E5C487] font-headline">
          Revoras
        </Link>
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-headline tracking-tight transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-[#E5C487] border-b-2 border-[#E5C487] pb-1"
                  : "text-gray-400 font-medium hover:text-[#E5C487]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="material-symbols-outlined text-gray-400 hover:text-[#E5C487] transition-colors">
          notifications
        </button>
        <Link href="/user" className="w-10 h-10 rounded-full border border-[#4D463A]/30 overflow-hidden">
          <img
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYjVOrO2hH1sGl4BJ_sJr2ofkqM6dPe3pZLMzG96ghfl6sGDLJ9KgMkCn8h2FqSq3QD8YEC4bNYrniiUJcXxOei_do220J68Yaw1tCZBqfRa8FpfIDLSvGtbu5cIAaYFvtvzmgiCCeQizZcQsMzh0j9CRFMYocIVOdVWJ_tjxAqfcan-ooQ93M-mHk15NyGq-D9UIuMrVJ9Q9_sMorNQtwI7GoCkPvC6W_n0a0cuCmOdjJ44iLQorShflm2-PRCELP57dfft1hrZY"
            className="w-full h-full object-cover"
          />
        </Link>
        <Link
          href="/user/book"
          className="bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] px-6 py-2.5 rounded-xl font-headline font-bold text-sm tracking-tight active:scale-95 transition-transform"
        >
          Book Now
        </Link>
      </div>
    </nav>
  );
}
