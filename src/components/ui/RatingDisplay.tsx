import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingDisplayProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
  /** Wording for the no-reviews case. "New" suits a card; a detail header may want "No reviews yet". */
  unratedLabel?: string;
}

/**
 * Read-only star rating — business/professional cards and detail headers all
 * use this same rendering.
 *
 * A business with no reviews is rendered as "New", not as a score. It used to
 * print `value.toFixed(1)` unconditionally beside a filled gold star, so every
 * newly listed studio advertised itself as **0.0 (0)** — visually identical to
 * a business that had been rated and rated terribly. Zero is not a low rating
 * here, it is the absence of one, and the two must not look the same: the
 * studios most hurt by the old rendering were the ones with no reviews *yet*,
 * which is every business on the day it joins.
 *
 * `count` is the authority rather than `value`, because a real 0.0 average
 * cannot occur while ratings start at 1 star — but a count of 0 is unambiguous.
 */
export function RatingDisplay({ value, count, size = "sm", className, unratedLabel = "New" }: RatingDisplayProps) {
  const iconSize = size === "sm" ? 13 : 16;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const unrated = count === 0;

  if (unrated) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-muted", textSize, className)}>
        <Star size={iconSize} className="text-muted" />
        <span className="font-medium">{unratedLabel}</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-on-surface", textSize, className)}>
      <Star size={iconSize} className="fill-primary text-primary" />
      <span className="font-medium tabular-nums">{value.toFixed(1)}</span>
      {typeof count === "number" ? <span className="text-muted">({count})</span> : null}
    </span>
  );
}
