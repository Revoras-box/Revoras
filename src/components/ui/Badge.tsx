import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium w-fit",
  {
    variants: {
      tone: {
        neutral: "bg-surface-container-high text-on-surface-variant",
        primary: "bg-primary-container text-on-primary-container",
        success: "bg-secondary-container text-on-secondary-container",
        warning: "bg-tertiary-container text-on-surface",
        danger: "bg-error-container text-on-error-container",
        /* Filled chips spend brand colour; `outline` spends none. For status
           that should read as premium//restrained rather than loud — it borrows
           the surface's own text + hairline instead of a container fill. */
        outline: "border border-outline-variant bg-transparent text-on-surface",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Renders a small status dot before the label — use for live/state badges (booking status, approval status). */
  dot?: boolean;
}

/**
 * Static label badge (categories, counts). For anything representing a
 * lifecycle state (booking/business/payment status) prefer the semantic
 * `tone` mapping documented in each domain component rather than picking
 * colors ad hoc per page.
 */
export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, className }))} {...props}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
