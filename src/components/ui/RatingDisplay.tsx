import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingDisplayProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

/** Read-only star rating with review count — business/professional cards and detail headers all use this same rendering. */
export function RatingDisplay({ value, count, size = "sm", className }: RatingDisplayProps) {
  const iconSize = size === "sm" ? 13 : 16;
  return (
    <span className={cn("inline-flex items-center gap-1 text-on-surface", size === "sm" ? "text-xs" : "text-sm", className)}>
      <Star size={iconSize} className="fill-primary text-primary" />
      <span className="font-medium tabular-nums">{value.toFixed(1)}</span>
      {typeof count === "number" ? <span className="text-muted">({count})</span> : null}
    </span>
  );
}
