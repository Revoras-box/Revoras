"use client";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import type { BookingRow, BookingStatus } from "@/lib/business/types";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<BookingStatus, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "primary",
  checked_in: "primary",
  completed: "success",
  cancelled: "neutral",
  no_show: "danger",
};

/** "14:30:00" -> "14:30". Safe to slice: this is a wall-clock time column, not a timezone-bearing date. */
const hhmm = (time: string) => time.slice(0, 5);

/**
 * A compact read-only view of today's bookings, ordered by start time, with the
 * next upcoming slot highlighted. Reads `today.bookings` from the dashboard
 * payload — the API already returns it, so this costs no extra request.
 */
export function TodaySchedulePreview({ bookings }: { bookings: BookingRow[] }) {
  if (bookings.length === 0) {
    return <EmptyState title="Nothing booked today" description="Today's appointments will appear here as they come in." />;
  }

  const sorted = [...bookings].sort((a, b) => a.start_time.localeCompare(b.start_time));
  const nowHhmm = new Date().toTimeString().slice(0, 5);
  const nextIndex = sorted.findIndex((b) => hhmm(b.start_time) >= nowHhmm);

  return (
    <ol className="flex flex-col">
      {sorted.map((b, i) => (
        <li
          key={b.id}
          className={cn(
            "flex items-center gap-3 border-l-2 py-2.5 pl-3",
            i === nextIndex ? "border-primary" : "border-border"
          )}
        >
          <span className="w-11 shrink-0 text-xs font-medium text-muted tabular-nums">{hhmm(b.start_time)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-on-surface">{b.customer_name}</span>
            <span className="block truncate text-xs text-muted">{b.member_name}</span>
          </span>
          <Badge tone={STATUS_TONE[b.status]}>{b.status.replace("_", " ")}</Badge>
        </li>
      ))}
    </ol>
  );
}
