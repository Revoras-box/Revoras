"use client";

import { cn } from "@/lib/utils";

export interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  active?: boolean;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  linkComponent?: React.ElementType;
  className?: string;
}

/**
 * Customer-only mobile tab bar (see Navigation model — Business/Admin use
 * `Sidebar` even on mobile, via a drawer). Hidden at `md` and above, where
 * `TopNav` takes over.
 */
export function BottomNav({ items, linkComponent: LinkComp = "a", className }: BottomNavProps) {
  return (
    <nav
      className={cn(
        "glass-nav fixed inset-x-0 bottom-0 z-(--z-index-sticky) flex items-stretch justify-around border-t border-border pb-[env(safe-area-inset-bottom)] md:hidden",
        className
      )}
    >
      {items.map((item) => (
        <LinkComp
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-(--duration-fast) ease-(--ease-out)",
            item.active ? "text-primary" : "text-muted"
          )}
        >
          {item.active && item.activeIcon ? item.activeIcon : item.icon}
          {item.label}
        </LinkComp>
      ))}
    </nav>
  );
}
