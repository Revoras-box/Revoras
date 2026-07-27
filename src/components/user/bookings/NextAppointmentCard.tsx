"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, MapPin, CalendarPlus, Clock, Copy, Sparkles, CalendarClock } from "lucide-react";
import { Avatar, Button } from "@/components/ui";
import { bookingStartDate, directionsUrl, buildICS } from "@/lib/bookings";
import { displayTime, displayDuration } from "@/lib/slot-fit";
import type { BookingListItem } from "@/lib/types";

/**
 * The one appointment that matters right now, given the weight it deserves.
 *
 * Everything here is a question someone actually asks on the way out the door:
 * how long until it, where is it, what's the code at the counter. The list
 * below answers "what else have I booked" — this answers "what do I do next",
 * which is why it's a distinct surface and not just the first row.
 */

const dayLabel = (d: Date, now: Date): string => {
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (sameDay(d, now)) return "Today";
  if (sameDay(d, tomorrow)) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
};

/** "in 45m" / "in 2h 15m" / "in 3 days". Null once it has started. */
export const countdownLabel = (start: Date, now: Date): string | null => {
  const ms = start.getTime() - now.getTime();
  if (ms <= 0) return null;
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "starting now";
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `in ${hours}h${mins % 60 ? ` ${mins % 60}m` : ""}`;
  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
};

const endTimeOf = (start: Date, minutes: number) =>
  new Date(start.getTime() + minutes * 60000).toTimeString().slice(0, 5);

export function NextAppointmentCard({
  booking,
  now,
  onReschedule,
}: {
  booking: BookingListItem;
  now: Date;
  onReschedule: (b: BookingListItem) => void;
}) {
  const start = bookingStartDate(booking.booking_date, booking.start_time);
  const countdown = countdownLabel(start, now);
  const canReschedule = booking.status === "pending" || booking.status === "confirmed";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(booking.confirmation_code);
      toast.success("Confirmation code copied");
    } catch {
      // Clipboard is permission-gated and simply unavailable over plain http on
      // some setups; the code is on screen either way, so this is a nudge, not
      // an error worth alarming anyone about.
      toast.message(booking.confirmation_code, { description: "Copy this code manually" });
    }
  };

  const calendarHref = buildICS({
    id: booking.id,
    title: `${booking.studio_name}${booking.member_name ? ` — ${booking.member_name}` : ""}`,
    location: booking.studio_address || booking.studio_name,
    date: booking.booking_date,
    startTime: booking.start_time,
    durationMinutes: booking.total_duration,
  });

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      {/* Gradient band: the only place on this page that spends full brand
          colour, so the next appointment reads first at a glance. */}
      <div className="brand-gradient relative h-20">
        <span className="absolute left-5 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          <Sparkles size={12} /> Next appointment
        </span>
        {countdown ? (
          <span className="absolute right-5 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-on-surface tabular-nums shadow-soft">
            <Clock size={12} /> {countdown}
          </span>
        ) : null}
      </div>

      <div className="relative px-5 pb-5">
        <div className="-mt-9 mb-3 flex items-end gap-3">
          <span className="rounded-2xl bg-card p-1 shadow-soft">
            <Avatar
              name={booking.member_name || booking.studio_name}
              src={booking.member_image ?? booking.studio_image ?? undefined}
              size="lg"
            />
          </span>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2.5">
          <span className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">
            {dayLabel(start, now)}
          </span>
          <span className="font-headline text-2xl font-extrabold text-primary tabular-nums">
            {displayTime(booking.start_time)}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted">
          {displayTime(booking.start_time)} – {displayTime(endTimeOf(start, booking.total_duration))} ·{" "}
          {displayDuration(booking.total_duration)}
        </p>

        <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
          <span className="font-headline font-bold text-on-surface">{booking.studio_name}</span>
          {booking.member_name ? (
            <span className="text-xs text-muted">
              with {booking.member_name}
              {booking.member_designation ? ` · ${booking.member_designation}` : ""}
            </span>
          ) : null}
          {booking.studio_address ? (
            <span className="flex items-start gap-1.5 text-xs text-muted">
              <MapPin size={12} className="mt-0.5 shrink-0" />
              <span className="line-clamp-2">{booking.studio_address}</span>
            </span>
          ) : null}
        </div>

        {/* The code the salon asks for at the counter — the reason people open
            this page while standing in a doorway. */}
        <button
          type="button"
          onClick={copyCode}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-surface-container-low px-2.5 py-1.5 font-mono text-[11px] tracking-wide text-on-surface transition-colors duration-fast hover:bg-surface-container-high"
          aria-label={`Copy confirmation code ${booking.confirmation_code}`}
        >
          {booking.confirmation_code}
          <Copy size={11} className="text-muted" />
        </button>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button asChild size="sm" className="col-span-2">
            <Link href={`/user/bookings/${booking.id}`}>
              View booking <ArrowRight size={14} />
            </Link>
          </Button>
          <Button intent="outline" size="sm" asChild>
            <a href={directionsUrl({ address: booking.studio_address })} target="_blank" rel="noreferrer">
              <MapPin size={13} /> Directions
            </a>
          </Button>
          <Button intent="outline" size="sm" asChild>
            <a href={calendarHref} download={`revoras-${booking.confirmation_code}.ics`}>
              <CalendarPlus size={13} /> Calendar
            </a>
          </Button>
          {canReschedule ? (
            <Button intent="ghost" size="sm" className="col-span-2" onClick={() => onReschedule(booking)}>
              <CalendarClock size={13} /> Reschedule
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
