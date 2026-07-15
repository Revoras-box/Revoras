"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Admin } from "@/lib/types";
import ThemeToggleButton from "@/components/ThemeToggleButton";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: readonly NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/studios", label: "Studios", icon: "store" },
  { href: "/admin/verifications", label: "Verifications", icon: "verified" },
  { href: "/admin/curation", label: "Curation", icon: "auto_awesome" },
  { href: "/admin/users", label: "Users", icon: "people" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");
    
    if (!token || !adminData) {
      if (pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      setIsLoading(false);
      return;
    }

    try {
      setAdmin(JSON.parse(adminData) as Admin);
    } catch {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      router.push("/admin/login");
    }
    setIsLoading(false);
  }, [pathname, router]);

  const handleLogout = (): void => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  // Show login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border fixed h-full">
        <div className="p-6 border-b border-border flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-primary font-headline">SnapCut Admin</h1>
            <p className="text-xs text-secondary-foreground mt-1">Management Portal</p>
          </div>
          <ThemeToggleButton className="-mr-2 shrink-0" />
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:bg-card hover:text-foreground"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{admin.name}</p>
              <p className="text-xs text-secondary-foreground truncate">{admin.role === "super_admin" ? "Super Admin" : "Admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
