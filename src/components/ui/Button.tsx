"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-label font-medium " +
    "transition-colors duration-(--duration-fast) ease-(--ease-out) " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  {
    variants: {
      intent: {
        primary: "bg-primary text-on-primary hover:brightness-105 active:brightness-95",
        secondary:
          "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
        outline: "border border-outline-variant text-on-surface bg-transparent hover:bg-surface-container-low",
        ghost: "bg-transparent text-on-surface hover:bg-surface-container-low",
        danger: "bg-error text-on-error hover:brightness-105 active:brightness-95",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the passed child element (e.g. a Next.js `<Link>`) instead of a `<button>`. */
  asChild?: boolean;
  /** Shows a spinner in place of the leading icon and disables interaction. */
  loading?: boolean;
}

/**
 * The one button in the system — every CTA, form submit, and icon-only
 * action button composes from this via `intent`/`size`, never a bespoke
 * one-off `<button className="...">` in a page.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, asChild, loading, disabled, children, ...props }, ref) => {
    if (asChild) {
      // Slot requires exactly one element child - no extra spinner/null siblings.
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ intent, size, className }))}
          {...props}
        >
          {children}
        </Slot>
      );
    }
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ intent, size, className }))}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Spinner size="sm" className="text-current" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
