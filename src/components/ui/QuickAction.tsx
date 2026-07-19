"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface QuickActionProps {
  label: string;
  description?: string;
  icon: React.ReactNode;
  /** Renders a Next `<Link>`; omit to render a `<button>` and pass `onClick` instead. */
  href?: string;
  onClick?: () => void;
  className?: string;
}

const quickActionClasses =
  "group flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left " +
  "transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface-container-low " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/**
 * A shortcut tile — icon over label, sized for a dashboard grid. Unlike Button,
 * this carries its own surface and is laid out in a grid rather than inline in
 * a row of controls.
 */
export function QuickAction({ label, description, icon, href, onClick, className }: QuickActionProps) {
  const body = (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-on-surface">{label}</span>
        {description ? <span className="block text-xs text-muted mt-0.5">{description}</span> : null}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(quickActionClasses, className)}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(quickActionClasses, className)}>
      {body}
    </button>
  );
}
