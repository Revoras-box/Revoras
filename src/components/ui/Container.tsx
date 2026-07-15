import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-4 md:px-6", {
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
