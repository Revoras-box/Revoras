"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sidebar, type SidebarItem } from "@/components/ui/Sidebar";
import { AppShell } from "@/components/ui/AppShell";
import { Drawer } from "@/components/ui/Drawer";
import { useBusinessAuth } from "@/lib/business/auth";
import { STAFF_NAV_ITEMS } from "./staffNav";
import { BusinessSwitcher } from "./BusinessSwitcher";
import { UserMenu } from "./UserMenu";
import { NotificationsBell } from "./NotificationsBell";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { ICON_SIZE } from "@/lib/design-tokens";

export function StaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { memberships } = useBusinessAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarItems: SidebarItem[] = STAFF_NAV_ITEMS.map((item) => ({
    label: item.label,
    href: item.href,
    icon: <item.icon size={ICON_SIZE.sm} />,
    active: item.href === "/staff" ? pathname === "/staff" : pathname.startsWith(item.href),
  }));

  // Only worth showing if this member actually works at more than one studio.
  const header = memberships.length > 1 ? <BusinessSwitcher /> : undefined;

  const sidebar = (
    <>
      <Sidebar
        items={sidebarItems}
        header={header}
        linkComponent={Link}
        className="hidden md:flex md:w-60 lg:w-60"
      />
      <div className="md:hidden">
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} title="Navigation" side="left">
          <div onClick={(e) => (e.target as HTMLElement).closest("a") && setMobileOpen(false)}>
            <Sidebar
              items={sidebarItems}
              header={header}
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
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggleButton />
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
