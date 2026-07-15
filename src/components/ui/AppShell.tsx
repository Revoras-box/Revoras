import { cn } from "@/lib/utils";

export interface AppShellProps {
  /** A configured `<Sidebar>` (Business/Admin) or `null` for a Customer page using `TopNav`/`BottomNav` instead. */
  sidebar?: React.ReactNode;
  /** A configured `<TopNav>`, shown above the content column — used with or without a sidebar. */
  topNav?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * The outermost frame for Business/Admin: sidebar + content column, with an
 * optional condensed top bar for mobile. Customer pages generally don't
 * need this — `TopNav`/`BottomNav` alone are enough for a browsing surface
 * without a persistent side rail.
 */
export function AppShell({ sidebar, topNav, children, className }: AppShellProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {sidebar}
      <div className="flex flex-1 flex-col overflow-hidden">
        {topNav}
        <main className={cn("flex-1 overflow-y-auto p-4 md:p-8", className)}>{children}</main>
      </div>
    </div>
  );
}
