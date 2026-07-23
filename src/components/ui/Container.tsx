import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Gutters come from the `shell` utility in globals.css — the same one the
 * marketing nav, hero, sections and footer use — so a page built out of
 * `Container` lines up with the chrome wrapped around it. They previously
 * disagreed (`px-4 md:px-6` here against `px-5 md:px-8` there), which put the
 * nav's logo a few pixels off the left edge of the content beneath it.
 *
 * `max-w-*` after `shell` intentionally overrides the utility's own 90rem cap
 * for the narrower variants; the gutter ramp is what's being shared.
 */
const containerVariants = cva("shell", {
  variants: {
    width: {
      /** Customer content — reading/browsing width */
      md: "max-w-3xl",
      /** Business/Admin dashboards — wide data tables and multi-column layouts */
      lg: "max-w-6xl",
      /** Full-bleed sections that still want side gutters */
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "lg" },
});

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

/** Horizontal centering + responsive gutters — every page body wraps its content in exactly one of these. */
export function Container({ className, width, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ width, className }))} {...props} />;
}
