"use client";

import Link from "next/link";
import {
  ArrowRight, MapPin, CalendarClock, Clock, Tag, Star, RotateCcw, MoreHorizontal, CalendarPlus, XCircle, AlertCircle,
} from "lucide-react";
import {
  Badge, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATUS_TONE, bookingStartDate, directionsUrl, buildICS } from "@/lib/bookings";
import { displayTime, displayDuration } from "@/lib/slot-fit";
import type { BookingListItem } from "@/lib/types";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/**
 * One booking in the list.
 *
 * Two rules hold the design together:
 *  - The date tile is the row's anchor, so the eye scans one column of dates
 *    down the page instead of hunting a date buried in a meta line.
 *  - Exactly ONE filled button per row. Which action earns it depends on state
 *    (a finished visit wants a review, a dead one wants a rebook); everything
 *    else is outline, and the rare/destructive moves live in the overflow menu.
 *    A row of five equal-weight buttons is a row with no answer in it.
 */

const monthShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
const weekdayShort = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" });

function DateTile({ date, dimmed }: { date: Date; dimmed: boolean }) {
  return (
    <div
      className={cn(
        "flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl border text-center transition-colors duration-fast",
        dimmed ? "border-border bg-surface-container-low text-muted" : "border-primary/25 bg-primary/8 text-on-surface"
      )}
    >
      <span className={cn("text-[10px] font-semibold uppercase tracking-wide", dimmed ? "text-muted" : "text-primary")}>
        {weekdayShort(date)}
      </span>
      <span className="font-headline text-xl font-extrabold leading-none tabular-nums">{date.getDate()}</span>
      <span className="text-[10px] uppercase tracking-wide text-muted">{monthShort(date)}</span>
    </div>
  );
}

export function BookingRow({
  booking: b,
  countdown,
  onCancel,
  onReschedule,
  onReview,
}: {
  booking: BookingListItem;
  /** "in 2h 15m" for imminent bookings; null when it doesn't apply. */
  countdown: string | null;
  onCancel: (b: BookingListItem) => void;
  onReschedule: (b: BookingListItem) => void;
  onReview: (b: BookingListItem) => void;
}) {
  const start = bookingStartDate(b.booking_date, b.start_time);
  const discount = Number(b.discount_amount ?? 0);
  // The state machine decides what may happen next — the UI never re-derives it.
  const allowed = b.allowedNextStatuses ?? [];
  const canCancel = allowed.includes("cancelled");
  const isActive = b.status === "pending" || b.status === "confirmed" || b.status === "checked_in";
  const canReschedule = b.status === "pending" || b.status === "confirmed";
  const isDone = b.status === "completed";
  const isDead = b.status === "cancelled" || b.status === "no_show";
  const awaitingPayment = isActive && (b.payment_status === "unpaid" || b.payment_status === "pending");
  const rebookHref = `/user/book?studioId=${encodeURIComponent(b.studio_id)}&barberId=${encodeURIComponent(b.business_member_id)}`;

  const calendarHref = buildICS({
    id: b.id,
    title: `${b.studio_name}${b.member_name ? ` — ${b.member_name}` : ""}`,
    location: b.studio_address || b.studio_name,
    date: b.booking_date,
    startTime: b.start_time,
    durationMinutes: b.total_duration,
  });

  return (
    <article
      className={cn(
        "group relative flex gap-3 rounded-2xl border border-border bg-card p-4 transition-all duration-normal sm:gap-4",
        "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-elevated",
        isDead && "opacity-75 hover:opacity-100"
      )}
    >
      <DateTile date={start} dimmed={!isActive} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* Stretched link: the whole row is the target, while the buttons
                below stay individually clickable (they sit above it). */}
            <Link
              href={`/user/bookings/${b.id}`}
              className="font-headline text-base font-bold text-on-surface transition-colors duration-fast after:absolute after:inset-0 after:content-[''] hover:text-primary"
            >
              {b.studio_name}
            </Link>
            <p className="truncate text-xs text-muted">
              {b.member_name ? `with ${b.member_name}` : null}
              {b.member_name && b.member_designation ? ` · ${b.member_designation}` : b.member_designation}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge tone={STATUS_TONE[b.status]} dot>{STATUS_LABEL[b.status]}</Badge>
            <span className="font-headline text-sm font-bold text-on-surface tabular-nums">{inr(Number(b.total_amount))}</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-on-surface">
            <Clock size={12} className="text-primary" /> {displayTime(b.start_time)}
          </span>
          <span>{displayDuration(b.total_duration)}</span>
          {countdown ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
              {countdown}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container/50 px-2 py-0.5 font-medium text-secondary">
              <Tag size={11} /> {inr(discount)} off
            </span>
          ) : null}
          {awaitingPayment ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning-container/60 px-2 py-0.5 font-medium text-on-warning-container">
              <AlertCircle size={11} /> Payment pending
            </span>
          ) : null}
        </div>

        {/* z-10 keeps these above the stretched link's ::after overlay. */}
        <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
          {isActive ? (
            <>
              <Button size="sm" asChild>
                <Link href={`/user/bookings/${b.id}`}>Details <ArrowRight size={13} /></Link>
              </Button>
              {canReschedule ? (
                <Button intent="outline" size="sm" onClick={() => onReschedule(b)}>
                  <CalendarClock size={13} /> Reschedule
                </Button>
              ) : null}
            </>
          ) : null}

          {isDone ? (
            <>
              <Button size="sm" onClick={() => onReview(b)}><Star size={13} /> Leave review</Button>
              <Button intent="outline" size="sm" asChild>
                <Link href={rebookHref}><RotateCcw size={13} /> Book again</Link>
              </Button>
            </>
          ) : null}

          {isDead ? (
            <Button size="sm" asChild>
              <Link href={rebookHref}><RotateCcw size={13} /> Book again</Link>
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button intent="ghost" size="sm" aria-label={`More actions for ${b.studio_name}`}>
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link href={`/user/bookings/${b.id}`}><ArrowRight size={14} /> View details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={directionsUrl({ address: b.studio_address })} target="_blank" rel="noreferrer">
                  <MapPin size={14} /> Directions
                </a>
              </DropdownMenuItem>
              {isActive ? (
                <DropdownMenuItem asChild>
                  <a href={calendarHref} download={`revoras-${b.confirmation_code}.ics`}>
                    <CalendarPlus size={14} /> Add to calendar
                  </a>
                </DropdownMenuItem>
              ) : null}
              {!isDead && !isDone ? (
                <DropdownMenuItem asChild>
                  <Link href={rebookHref}><RotateCcw size={14} /> Book again</Link>
                </DropdownMenuItem>
              ) : null}
              {canCancel ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-error hover:bg-error-container/40 focus:bg-error-container/40" onSelect={() => onCancel(b)}>
                    <XCircle size={14} /> Cancel booking
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
