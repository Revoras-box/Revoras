"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Sidebar, type SidebarItem } from "@/components/ui/Sidebar";
import { AppShell } from "@/components/ui/AppShell";
import { Input } from "@/components/ui/Input";
import { Drawer } from "@/components/ui/Drawer";
import { useBusinessAuth } from "@/lib/business/auth";
import { BUSINESS_NAV_ITEMS } from "./nav";
import { BusinessSwitcher } from "./BusinessSwitcher";
import { UserMenu } from "./UserMenu";
import { NotificationsBell } from "./NotificationsBell";
import { ICON_SIZE } from "@/lib/design-tokens";

export function BusinessShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeMembership } = useBusinessAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  const permissions = activeMembership?.permissions || [];
  const visibleItems = BUSINESS_NAV_ITEMS.filter((item) => !item.require || permissions.includes(item.require));

  const sidebarItems: SidebarItem[] = visibleItems.map((item) => ({
    label: item.label,
    href: item.href,
    icon: <item.icon size={ICON_SIZE.sm} />,
    active: item.href === "/business" ? pathname === "/business" : pathname.startsWith(item.href),
  }));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/business/customers?search=${encodeURIComponent(search.trim())}`);
  };

  const sidebar = (
    <>
      {/* Desktop / tablet rail - collapses to icons only at tablet width, matching the shell's tablet-optimized, desktop-first brief. */}
      <Sidebar
        items={sidebarItems}
        header={<BusinessSwitcher />}
        linkComponent={Link}
        className="hidden md:flex md:w-60 lg:w-60"
      />
      {/* Mobile drawer - built on the shared Drawer primitive (Radix Dialog) for focus trap/Escape/ARIA rather than a hand-rolled overlay. */}
      <div className="md:hidden">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} title="Navigation" side="left">
          <div onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}>
            <Sidebar
              items={sidebarItems}
              header={<BusinessSwitcher />}
              linkComponent={Link}
              className="w-full border-none px-0"
            />
          </div>
        </Drawer>
      </div>
    </>
  );

  const topNav = (
    <header className="flex h-16 items-center gap-3 border-b border-border px-4 md:px-6">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface md:hidden"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? <X size={ICON_SIZE.md} /> : <Menu size={ICON_SIZE.md} />}
      </button>
      <form onSubmit={handleSearchSubmit} className="hidden md:block w-full max-w-sm">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          leadingIcon={<Search size={ICON_SIZE.sm} />}
          aria-label="Search customers"
        />
      </form>
      <div className="ml-auto flex items-center gap-2">
        <NotificationsBell />
        <UserMenu />
      </div>
    </header>
  );

  return (
    <AppShell sidebar={sidebar} topNav={topNav}>
      {children}
    </AppShell>
  );
}
