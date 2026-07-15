"use client";

import { cn } from "@/lib/utils";

export interface TopNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface TopNavProps {
  logo: React.ReactNode;
  items?: TopNavItem[];
  /** Right-aligned slot — search box, avatar menu, sign-in button. */
  actions?: React.ReactNode;
  linkComponent?: React.ElementType;
  className?: string;
}

/** Horizontal top bar — Customer's primary nav, and the condensed bar above Business/Admin's sidebar on mobile. */
export function TopNav({ logo, items = [], actions, linkComponent: LinkComp = "a", className }: TopNavProps) {
  return (
    <header className={cn("glass-nav sticky top-0 z-(--z-index-sticky) flex h-16 items-center gap-6 border-b border-border px-4 md:px-6", className)}>
      <div className="shrink-0">{logo}</div>
      {items.length ? (
        <nav className="hidden md:flex items-center gap-1">
          {items.map((item) => (
            <LinkComp
              key={item.href}
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-(--duration-fast) ease-(--ease-out)",
                item.active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {item.label}
            </LinkComp>
          ))}
        </nav>
      ) : null}
      <div className="ml-auto flex items-center gap-3">{actions}</div>
    </header>
  );
}
