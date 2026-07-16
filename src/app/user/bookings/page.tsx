"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock, MapPin, ArrowRight, Clock, Tag, Star, RotateCcw, Sparkles, CalendarX2,
} from "lucide-react";
import { Container, Badge, Button, Avatar, Skeleton, EmptyState } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import { STATUS_LABEL, STATUS_TONE, categorize, bookingStartDate, directionsUrl, type BookingCategory } from "@/lib/bookings";
import CancelBookingModal from "@/components/user/sections/CancelBookingModal";
import RescheduleBookingModal from "@/components/user/sections/RescheduleBookingModal";
import ReviewBookingModal from "@/components/user/sections/ReviewBookingModal";
import type { BookingListItem } from "@/lib/types";

const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const displayTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

/** "TODAY" / "TOMORROW" / "Fri, 24 Jul" — compared as local calendar days. */
function dayHeading(d: Date): string {
  const now = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (sameDay(d, now)) return "Today";
  if (sameDay(d, tomorrow)) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** "2h 15m remaining" / "in 45m" / "starts now". Null once it's started. */
function remainingLabel(start: Date, now: Date): string | null {
  const ms = start.getTime() - now.getTime();
  if (ms <= 0) return null;
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "starting now";
  if (mins < 60) return `in ${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h < 24) return `${h}h${m ? ` ${m}m` : ""} remaining`;
  const days = Math.floor(h / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

/* ------------------------------- next up hero ----------------------------- */

function NextAppointment({ b, now }: { b: BookingListItem; now: Date }) {
  const start = bookingStartDate(b.booking_date, b.start_time);
  const remaining = remainingLabel(start, now);
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
      <div className="brand-gradient h-1.5 w-full" />
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar name={b.member_name || b.studio_name} src={b.member_image ?? b.studio_image ?? undefined} size="lg" />
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
              <Sparkles size={12} /> Next appointment
            </div>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
              <span className="font-headline text-2xl font-extrabold text-on-surface">{dayHeading(start)}</span>
              <span className="font-headline text-2xl font-extrabold text-primary tabular-nums">{displayTime(b.start_time)}</span>
            </div>
            <p className="truncate text-sm text-muted">
              {b.studio_name}
              {b.member_name ? ` · with ${b.member_name}` : ""}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {remaining ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Clock size={13} /> {remaining}
            </span>
          ) : null}
          <Button asChild size="sm">
            <Link href={`/user/bookings/${b.id}`}>View <ArrowRight size={14} /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- booking card ----------------------------- */

function BookingCard({
  b, onCancel, onReschedule, onReview,
}: {
  b: BookingListItem;
  onCancel: (b: BookingListItem) => void;
  onReschedule: (b: BookingListItem) => void;
  onReview: (b: BookingListItem) => void;
}) {
  const start = bookingStartDate(b.booking_date, b.start_time);
  const discount = Number(b.discount_amount ?? 0);
  // The state machine decides what may happen next — the UI never re-derives it.
  const allowed = b.allowedNextStatuses ?? [];
  const canCancel = allowed.includes("cancelled");
  const canReschedule = b.status === "pending" || b.status === "confirmed";
  const isDone = b.status === "completed";
  const isDead = b.status === "cancelled" || b.status === "no_show";
  const rebookHref = `/user/book?studioId=${encodeURIComponent(b.studio_id)}&barberId=${encodeURIComponent(b.business_member_id)}`;

  return (
    <div className="flex gap-3">
      {/* Timeline rail */}
      <div className="flex w-14 shrink-0 flex-col items-center pt-4 sm:w-16">
        <span className="font-headline text-sm font-bold text-on-surface tabular-nums">{displayTime(b.start_time).split(" ")[0]}</span>
        <span className="text-[10px] font-medium text-muted">{displayTime(b.start_time).split(" ")[1]}</span>
        <span className="mt-2 h-full w-px flex-1 bg-border" aria-hidden />
      </div>

      <div className="mb-4 min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-normal hover:shadow-elevated">
        <div className="flex gap-4 p-4">
          {/* Studio photo */}
          <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:block">
            {b.studio_image ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
              <img src={b.studio_image} alt={b.studio_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/12 via-surface-container to-accent/12">
                <span aria-hidden className="font-headline text-2xl font-extrabold text-on-surface/20">
                  {b.studio_name.trim().charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/user/bookings/${b.id}`}
                  className="truncate font-headline text-base font-bold text-on-surface transition-colors duration-fast hover:text-primary"
                >
                  {b.studio_name}
                </Link>
                <p className="truncate text-xs text-muted">
                  {b.member_name ? `with ${b.member_name}` : null}
                  {b.member_name && b.member_designation ? ` · ${b.member_designation}` : b.member_designation}
                </p>
              </div>
              <Badge tone={STATUS_TONE[b.status]} dot>{STATUS_LABEL[b.status]}</Badge>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <CalendarClock size={12} /> {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {b.total_duration} min</span>
              <span className="font-semibold text-on-surface tabular-nums">{inr(Number(b.total_amount))}</span>
              {discount > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container/50 px-2 py-0.5 font-medium text-secondary">
                  <Tag size={11} /> {inr(discount)} off
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {canReschedule ? (
                <>
                  <Button intent="outline" size="sm" asChild>
                    <a href={directionsUrl({ address: b.studio_address })} target="_blank" rel="noreferrer">
                      <MapPin size={13} /> Directions
                    </a>
                  </Button>
                  <Button intent="outline" size="sm" onClick={() => onReschedule(b)}>
                    <CalendarClock size={13} /> Reschedule
                  </Button>
                </>
              ) : null}
              {isDone ? (
                <>
                  <Button intent="outline" size="sm" asChild>
                    <Link href={rebookHref}><RotateCcw size={13} /> Book again</Link>
                  </Button>
                  <Button size="sm" onClick={() => onReview(b)}><Star size={13} /> Leave review</Button>
                </>
              ) : null}
              {isDead ? (
                <Button intent="outline" size="sm" asChild>
                  <Link href={rebookHref}><RotateCcw size={13} /> Book again</Link>
                </Button>
              ) : null}
              {canCancel ? (
                <Button intent="ghost" size="sm" className="text-error" onClick={() => onCancel(b)}>Cancel</Button>
              ) : null}
              <Button intent="ghost" size="sm" asChild>
                <Link href={`/user/bookings/${b.id}`}>Details <ArrowRight size={13} /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

const PILLS: { value: BookingCategory; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "today", label: "Today" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingCategory>("upcoming");
  const [cancelFor, setCancelFor] = useState<BookingListItem | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<BookingListItem | null>(null);
  const [reviewFor, setReviewFor] = useState<BookingListItem | null>(null);

  // Drives the "remaining" countdown without re-fetching.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const { data, loading, refetch } = useBookings({});
  const all = useMemo(() => (data?.bookings ?? []) as BookingListItem[], [data]);

  const grouped = useMemo(() => {
    const g: Record<BookingCategory, BookingListItem[]> = { today: [], upcoming: [], completed: [], cancelled: [], no_show: [] };
    for (const b of all) g[categorize(b)].push(b);
    g.today.sort((a, b) => a.start_time.localeCompare(b.start_time));
    g.upcoming.sort((a, b) => (a.booking_date + a.start_time).localeCompare(b.booking_date + b.start_time));
    return g;
  }, [all]);

  // A no-show is neither cancelled nor completed. Rather than hide those rows
  // behind a tab that isn't in the design, surface the pill only when the user
  // actually has one — no data is ever unreachable.
  const pills = useMemo(
    () => (grouped.no_show.length > 0 ? [...PILLS, { value: "no_show" as BookingCategory, label: "No-show" }] : PILLS),
    [grouped.no_show.length]
  );

  // The soonest still-active appointment, today or later.
  const nextUp = useMemo(() => {
    const active = [...grouped.today, ...grouped.upcoming].filter((b) =>
      ["pending", "confirmed", "checked_in"].includes(b.status)
    );
    return active
      .map((b) => ({ b, start: bookingStartDate(b.booking_date, b.start_time) }))
      .filter(({ start }) => start.getTime() > now.getTime())
      .sort((x, y) => x.start.getTime() - y.start.getTime())[0]?.b;
  }, [grouped, now]);

  const afterAction = () => refetch();

  const list = grouped[activeTab];

  // Group the active list by day so it reads as a timeline, not a table.
  const days = useMemo(() => {
    const map = new Map<string, { heading: string; items: BookingListItem[] }>();
    for (const b of list) {
      const start = bookingStartDate(b.booking_date, b.start_time);
      const key = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`;
      if (!map.has(key)) map.set(key, { heading: dayHeading(start), items: [] });
      map.get(key)!.items.push(b);
    }
    return [...map.values()];
  }, [list]);

  return (
    <Container width="lg" className="flex flex-col gap-6 py-8">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">Your bookings</h1>
        <p className="mt-0.5 text-sm text-muted">Everything you&apos;ve booked, past and upcoming.</p>
      </div>

      {loading ? <Skeleton className="h-24 rounded-3xl" /> : nextUp ? <NextAppointment b={nextUp} now={now} /> : null}

      {/* Large pills */}
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Booking status">
        {pills.map((p) => {
          const on = p.value === activeTab;
          const count = grouped[p.value].length;
          return (
            <button
              key={p.value}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActiveTab(p.value)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-fast ${
                on ? "bg-primary text-primary-foreground" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              {p.label}
              {count > 0 ? (
                <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${on ? "bg-primary-foreground/20" : "bg-surface"}`}>
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">{[1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 size={28} />}
          title={`No ${PILLS.find((p) => p.value === activeTab)?.label.toLowerCase() ?? activeTab} bookings`}
          description={
            activeTab === "upcoming" || activeTab === "today"
              ? "When you book an appointment, it'll appear here."
              : "Nothing here yet."
          }
          action={
            activeTab === "upcoming" || activeTab === "today" ? (
              <Button onClick={() => router.push("/user/search")}>Find a studio</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="flex flex-col">
          {days.map((d) => (
            <section key={d.heading}>
              <h2 className="sticky top-16 z-(--z-index-dropdown) -mx-1 bg-surface/90 px-1 py-2 text-xs font-bold uppercase tracking-wide text-muted backdrop-blur-sm">
                {d.heading}
              </h2>
              {d.items.map((b) => (
                <BookingCard key={b.id} b={b} onCancel={setCancelFor} onReschedule={setRescheduleFor} onReview={setReviewFor} />
              ))}
            </section>
          ))}
        </div>
      )}

      {cancelFor ? (
        <CancelBookingModal bookingId={cancelFor.id} onClose={() => setCancelFor(null)} onCancelled={afterAction} />
      ) : null}
      {rescheduleFor ? (
        <RescheduleBookingModal
          bookingId={rescheduleFor.id}
          studioId={rescheduleFor.studio_id}
          businessMemberId={rescheduleFor.business_member_id}
          durationMinutes={rescheduleFor.total_duration}
          onClose={() => setRescheduleFor(null)}
          onRescheduled={afterAction}
        />
      ) : null}
      {reviewFor ? (
        <ReviewBookingModal
          bookingId={reviewFor.id}
          studioName={reviewFor.studio_name}
          // The list payload carries no services array, so the visit is
          // identified by when it happened and who it was with — not by a
          // service name this row doesn't actually have.
          visitLabel={`${bookingStartDate(reviewFor.booking_date, reviewFor.start_time).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}${reviewFor.member_name ? ` · with ${reviewFor.member_name}` : ""}`}
          onClose={() => setReviewFor(null)}
          onReviewed={afterAction}
        />
      ) : null}
    </Container>
  );
}
