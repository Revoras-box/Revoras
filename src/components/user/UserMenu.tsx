"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import {
  User,
  BookOpen,
  LogOut,
} from "lucide-react";

const menuItems = [
  { label: "My Profile", href: "/user/profile", icon: User },
  { label: "Booking History", href: "/user/bookings", icon: BookOpen },
];

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const name = user?.name || "";
  const email = user?.email || "";
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform active:scale-95 cursor-pointer select-none"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="User menu"
      >
        {initial}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-60 bg-card border-border rounded-xl shadow-lg shadow-black/10 dark:shadow-2xl dark:shadow-black/50 overflow-hidden z-50 animate-dropdown"
          role="menu"
          aria-orientation="vertical"
          style={{
            transition: "background-color 250ms cubic-bezier(0.22,1,0.36,1), border-color 250ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="px-4 py-4 border-b border-border">
            <p className="text-foreground font-semibold text-sm truncate font-body">
              {name || "User"}
            </p>
            <p className="text-secondary-foreground text-xs truncate mt-0.5 font-body">
              {email}
            </p>
          </div>

          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-foreground hover:text-foreground hover:bg-surface transition-colors duration-150 cursor-pointer font-body"
                role="menuitem"
              >
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-secondary-foreground hover:text-red-500 dark:hover:text-red-400 hover:bg-surface transition-colors duration-150 cursor-pointer font-body"
            role="menuitem"
          >
            <LogOut className="w-4 h-4 text-muted shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
