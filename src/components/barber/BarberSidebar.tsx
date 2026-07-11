"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBarberAuth } from "@/lib/barber-auth";
import ThemeToggleButton from "@/components/ThemeToggleButton";

const navItems = [
  { href: "/barbers/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/barbers/schedule", label: "Appointments", icon: "calendar_today" },
  { href: "/barbers/barbers", label: "Barbers", icon: "content_cut" },
  { href: "/barbers/services", label: "Services", icon: "dry_cleaning" },
  { href: "/barbers/walk-in", label: "Walk-In", icon: "person_add" },
  { href: "/barbers/payments", label: "Revenue", icon: "payments" },
  { href: "/barbers/analytics", label: "Analytics", icon: "insights" },
];

export default function BarberSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { barber, logout } = useBarberAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/barbers/dashboard") return pathname === "/barbers/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden fixed top-4 left-4 z-[45] w-10 h-10 rounded-xl bg-card border border-border shadow-soft flex items-center justify-center text-foreground hover:bg-surface-container-high transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={`h-screen w-72 flex flex-col fixed left-0 top-0 z-[70] bg-card border-r border-border py-7 transition-transform duration-300 ease-out ${
          open ? "translate-x-0 shadow-floating" : "-translate-x-full"
        } lg:translate-x-0 lg:shadow-none`}
      >
        {/* Brand */}
        <div className="px-6 mb-8 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-headline font-black text-primary text-2xl tracking-tight truncate">
              {typeof barber?.salon_name === "string" ? barber.salon_name : "Revoras"}
            </h1>
            <p className="uppercase tracking-widest text-[10px] text-muted mt-1">
              Elite Management
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggleButton className="-mr-2" />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 flex flex-col gap-1 overflow-y-auto px-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3.5 mx-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-secondary-foreground hover:bg-surface-container-high hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-primary" />
                )}
                <span className={`material-symbols-outlined text-[22px] transition-opacity ${active ? "" : "opacity-75 group-hover:opacity-100"}`}>
                  {item.icon}
                </span>
                <span className={`text-sm tracking-wide ${active ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="px-6 mt-4 flex flex-col gap-5">
          <button
            onClick={() => { setOpen(false); router.push("/barbers/walk-in"); }}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-headline font-bold py-3 px-4 rounded-xl shadow-soft hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Appointment
          </button>

          <div className="pt-5 border-t border-border flex flex-col gap-1">
            <Link
              href="/barbers/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-secondary-foreground hover:text-primary hover:bg-surface-container-high transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="uppercase tracking-widest text-[11px] font-semibold">Settings</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-2 py-2 rounded-lg text-secondary-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span className="uppercase tracking-widest text-[11px] font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
