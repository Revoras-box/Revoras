"use client";

import { Check, Clock, X, CalendarClock } from "lucide-react";
import type { BookingTimelineEvent } from "@/lib/types";
import { STATUS_LABEL } from "@/lib/bookings";

/**
 * Phase 2.5 - renders a booking's status-event log (from GET /bookings/:id/
 * timeline) as a vertical timeline. A reschedule event (from == to) shows as a
 * neutral "rescheduled" node rather than a status change.
 */
function eventLabel(e: BookingTimelineEvent): string {
  if (e.from_status === e.to_status) return e.reason || "Rescheduled";
  if (e.from_status === null) return "Booked";
  return STATUS_LABEL[e.to_status];
}

function EventIcon({ e }: { e: BookingTimelineEvent }) {
  if (e.from_status === e.to_status) return <CalendarClock size={14} />;
  if (e.to_status === "cancelled" || e.to_status === "no_show") return <X size={14} />;
  if (e.to_status === "completed") return <Check size={14} />;
  return <Clock size={14} />;
}

export default function BookingTimeline({ events }: { events: BookingTimelineEvent[] }) {
  if (!events || events.length === 0) return null;

  return (
    <ol className="flex flex-col gap-0">
      {events.map((e, i) => {
        const terminal = e.to_status === "cancelled" || e.to_status === "no_show";
        const done = e.to_status === "completed";
        return (
          <li key={e.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  terminal ? "bg-error text-on-error" : done ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary"
                }`}
              >
                <EventIcon e={e} />
              </span>
              {i < events.length - 1 ? <span className="w-px flex-1 bg-border" /> : null}
            </div>
            <div className="pb-5">
              <p className="text-sm font-medium text-on-surface">{eventLabel(e)}</p>
              <p className="text-xs text-muted">
                {new Date(e.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                {e.actor_type === "business" ? " · by the studio" : e.actor_type === "system" ? " · automatic" : ""}
              </p>
              {e.reason && e.from_status !== e.to_status && e.from_status !== null ? (
                <p className="mt-0.5 text-xs text-muted">{e.reason}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
