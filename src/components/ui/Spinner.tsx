import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin rounded-full border-2 border-current border-t-transparent", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-5 w-5",
      lg: "h-8 w-8",
    },
  },
  defaultVariants: { size: "md" },
});

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof spinnerVariants> {
  /** Screen-reader label. Defaults to "Loading" — pass "" only if a sibling already announces the state. */
  label?: string;
}

/** Indeterminate loading indicator. Inherits `color` from its parent (`text-current`). */
export function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span role="status" className={cn(spinnerVariants({ size, className }))} {...props}>
      <span className="sr-only">{label}</span>
    </span>
  );
}
