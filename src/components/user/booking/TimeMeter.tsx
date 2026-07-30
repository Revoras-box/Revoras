"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { displayDuration } from "@/lib/slot-fit";

/**
 * The budget, drawn. A number ("60 of 30 min") states the problem; the bar
 * shows how far over the line the selection is and shrinks back under it as
 * services come off, which is what makes the fix feel obvious rather than
 * arithmetic.
 *
 * Shared by both slot dialogs: the booking wizard's, where the bar moves as
 * services are trimmed, and the reschedule one, where it's a fixed picture of
 * how much the appointment overruns the window.
 */
export function TimeMeter({
  used,
  budget,
  /** What the used length is called. "Selected" while choosing, "Your booking" while moving one. */
  usedLabel = "Selected",
}: {
  used: number;
  budget: number;
  usedLabel?: string;
}) {
  const scale = Math.max(used, budget, 1);
  const usedPct = Math.min((used / scale) * 100, 100);
  const budgetPct = Math.min((budget / scale) * 100, 100);
  const fits = used <= budget;
  const over = Math.max(used - budget, 0);

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
        <span className="font-medium text-on-surface">
          {usedLabel} {displayDuration(used)}
        </span>
        <span className={cn("font-medium tabular-nums", fits ? "text-secondary" : "text-error")}>
          {fits ? `${displayDuration(budget - used)} to spare` : `${displayDuration(over)} too long`}
        </span>
      </div>

      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-normal ease-out",
            fits ? "bg-secondary" : "bg-error"
          )}
          style={{ width: `${usedPct}%` }}
        />
        {/* The hard edge of the window — where the next appointment starts. */}
        <div
          className="absolute inset-y-0 w-0.5 bg-on-surface/70"
          style={{ left: `calc(${budgetPct}% - 1px)` }}
          aria-hidden
        />
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted">
        <Clock size={11} />
        {displayDuration(budget)} free at this time
      </div>
    </div>
  );
}
