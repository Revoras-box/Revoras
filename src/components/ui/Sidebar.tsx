"use client";

import { cn } from "@/lib/utils";

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
  /** Renders a Badge/count next to the label — e.g. pending-approvals count. */
  trailing?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  /** Rendered above the nav list — e.g. the business switcher. */
  header?: React.ReactNode;
  /** Rendered pinned to the bottom — e.g. the signed-in person's account menu. */
  footer?: React.ReactNode;
  /** Renders as a Next.js `<Link>` internally when provided; falls back to a plain `<a>` for the showcase/storybook context. */
  linkComponent?: React.ElementType;
  className?: string;
}

/**
 * Persistent left navigation for Business/Admin. Takes its items as data,
 * not JSX children with hardcoded routes — the same Sidebar renders both
 * the Business and Admin nav trees, they just pass different `items`.
 */
export function Sidebar({ items, header, footer, linkComponent: LinkComp = "a", className }: SidebarProps) {
  return (
    <aside className={cn("flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface-container-low px-3 py-4", className)}>
      {header ? <div className="mb-4 px-1">{header}</div> : null}
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <LinkComp
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-(--duration-fast) ease-(--ease-out)",
              item.active
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <span className="shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {item.trailing}
          </LinkComp>
        ))}
      </nav>
      {footer ? <div className="mt-2 border-t border-border pt-3">{footer}</div> : null}
    </aside>
  );
}
