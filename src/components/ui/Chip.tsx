"use client";

import { forwardRef } from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ICON_SIZE } from "@/lib/design-tokens";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-(--duration-fast) ease-(--ease-out)",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary-container text-on-primary-container",
        false: "border-outline-variant bg-surface text-on-surface hover:bg-surface-container-low",
      },
    },
    defaultVariants: { selected: false },
  }
);

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
  /** Shows a trailing remove (×) affordance and fires this instead of the chip's own onClick. */
  onRemove?: () => void;
}

/**
 * Toggleable filter/category pill (used for service categories, filters).
 * For a booking's lifecycle status, use `Badge`, not `Chip` — a chip is
 * always an input (selectable/removable), a badge is always a display-only
 * label.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, icon, onRemove, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected ?? undefined}
      className={cn(chipVariants({ selected, className }))}
      {...props}
    >
      {icon}
      {children}
      {onRemove ? (
        <span
          role="button"
          aria-label="Remove"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="-mr-1 flex rounded-full p-0.5 hover:bg-surface-container-highest"
        >
          <X size={ICON_SIZE.sm} />
        </span>
      ) : null}
    </button>
  )
);
Chip.displayName = "Chip";
