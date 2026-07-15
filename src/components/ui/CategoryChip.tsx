import { cn } from "@/lib/utils";
import { Chip, type ChipProps } from "./Chip";

export interface CategoryChipProps extends Omit<ChipProps, "icon"> {
  icon?: React.ReactNode;
}

/**
 * A `Chip` preset for the Discover category rail and service-category
 * filters — same component, just a named alias so pages reach for the
 * domain-obvious name instead of reimplementing `Chip` styling by hand.
 */
export function CategoryChip({ className, ...props }: CategoryChipProps) {
  return <Chip className={cn("shrink-0", className)} {...props} />;
}
