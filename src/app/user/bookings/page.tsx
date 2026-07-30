"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarX2, Plus, RotateCcw, Sparkles } from "lucide-react";
import { Container, Button, Avatar, Skeleton, EmptyState } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import { categorize, bookingStartDate, type BookingCategory } from "@/lib/bookings";
import { NextAppointmentCard, countdownLabel } from "@/components/user/bookings/NextAppointmentCard";
import { BookingRow } from "@/components/user/bookings/BookingRow";
import CancelBookingModal from "@/components/user/sections/CancelBookingModal";
import RescheduleBookingModal from "@/components/user/sections/RescheduleBookingModal";
import ReviewBookingModal from "@/components/user/sections/ReviewBookingModal";
import { cn } from "@/lib/utils";
import type { BookingListItem } from "@/lib/types";

/**
 * Upcoming bookings are bucketed by how soon they are, not by exact date.
 *
 * Every row already carries its own date tile, so a "Mon, Jul 27" heading above
 * a row that says MON 27 JUL is the same fact twice. What a heading can add
 * that the tile can't is horizon — is this thing imminent or months out.
 */
function horizonBucket(d: Date, now: Date): { key: number; label: string } {
  const startOfDay = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000);
  if (days <= 0) return { key: 0, label: "Today" };
  if (days === 1) return { key: 1, label: "Tomorrow" };
  if (days <= 7) return { key: 2, label: "This week" };
  if (days <= 30) return { key: 3, label: "This month" };
  return { key: 4, label: "Later" };
}

/**
 * History is grouped by month, not by day.
 *
 * A day heading per past visit produces one heading per row — pure noise once
 * appointments are weeks apart. Upcoming stays day-grouped because those dates
 * are things you're actively planning around.
 */
const monthHeading = (d: Date) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

/* ------------------------------ filter control ---------------------------- */

const TABS: { value: BookingCategory; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "today", label: "Today" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function FilterTabs({
  tabs,
  active,
  counts,
  onChange,
}: {
  tabs: { value: BookingCategory; label: string }[];
  active: BookingCategory;
  counts: Record<BookingCategory, number>;
  onChange: (v: BookingCategory) => void;
}) {
  return (
    // One track with segments inside, rather than four loose pills: the group
    // reads as a single control, and the selected segment is unmistakable.
    <div
      role="tablist"
      aria-label="Booking status"
      className="flex gap-1 overflow-x-auto rounded-full border border-border bg-surface-container-low p-1"
    >
      {tabs.map((t) => {
        const on = t.value === active;
        const count = counts[t.value];
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-fast",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              on
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            )}
          >
            {t.label}
            {count > 0 ? (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  on ? "bg-primary-foreground/20 text-primary-foreground" : "bg-surface-container-highest text-muted"
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------- book again ------------------------------- */

/**
 * Studios this person has actually been to, most recent first. Rebooking a
 * place you liked is the single most common reason to return to this page, and
 * it was previously a three-step round trip through search.
 */
function BookAgainRail({ bookings }: { bookings: BookingListItem[] }) {
  const studios = useMemo(() => {
    const seen = new Map<string, BookingListItem>();
    for (const b of bookings) if (!seen.has(b.studio_id)) seen.set(b.studio_id, b);
    return [...seen.values()].slice(0, 3);
  }, [bookings]);

  if (studios.length === 0) return null;

  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
        <RotateCcw size={12} className="text-primary" /> Book again
      </h2>
      <ul className="flex flex-col gap-1">
        {studios.map((s) => (
          <li key={s.studio_id}>
            <Link
              href={`/user/book?studioId=${encodeURIComponent(s.studio_id)}&barberId=${encodeURIComponent(s.business_member_id)}`}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-fast hover:bg-surface-container-low"
            >
              <Avatar name={s.studio_name} src={s.studio_image ?? undefined} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-on-surface">{s.studio_name}</span>
                {s.member_name ? <span className="block truncate text-xs text-muted">with {s.member_name}</span> : null}
              </span>
              <Plus size={15} className="shrink-0 text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function BookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingCategory>("upcoming");
  const [cancelFor, setCancelFor] = useState<BookingListItem | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<BookingListItem | null>(null);
  const [reviewFor, setReviewFor] = useState<BookingListItem | null>(null);

  // Drives every countdown on the page without re-fetching.
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
    // History reads newest-first — the last visit is the one you're looking for.
    const recentFirst = (a: BookingListItem, b: BookingListItem) =>
      (b.booking_date + b.start_time).localeCompare(a.booking_date + a.start_time);
    g.completed.sort(recentFirst);
    g.cancelled.sort(recentFirst);
    g.no_show.sort(recentFirst);
    return g;
  }, [all]);

  const counts = useMemo(
    () => ({
      today: grouped.today.length,
      upcoming: grouped.upcoming.length,
      completed: grouped.completed.length,
      cancelled: grouped.cancelled.length,
      no_show: grouped.no_show.length,
    }),
    [grouped]
  );

  // A no-show is neither cancelled nor completed. Rather than hide those rows
  // behind a tab that isn't in the design, surface it only when the user
  // actually has one — no data is ever unreachable.
  const tabs = useMemo(
    () => (counts.no_show > 0 ? [...TABS, { value: "no_show" as BookingCategory, label: "No-show" }] : TABS),
    [counts.no_show]
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

  const pastBookings = useMemo(
    () => [...grouped.completed, ...grouped.cancelled, ...grouped.no_show],
    [grouped]
  );

  const list = grouped[activeTab];
  const isUpcomingLens = activeTab === "upcoming" || activeTab === "today";

  const sections = useMemo(() => {
    const map = new Map<string, { heading: string; items: BookingListItem[] }>();
    for (const b of list) {
      const start = bookingStartDate(b.booking_date, b.start_time);
      const bucket = isUpcomingLens ? horizonBucket(start, now) : null;
      const key = bucket ? `h${bucket.key}` : `${start.getFullYear()}-${start.getMonth()}`;
      const heading = bucket ? bucket.label : monthHeading(start);
      if (!map.has(key)) map.set(key, { heading, items: [] });
      map.get(key)!.items.push(b);
    }
    return [...map.values()];
  }, [list, isUpcomingLens, now]);

  const afterAction = () => refetch();

  const emptyCopy: Record<BookingCategory, { title: string; description: string }> = {
    upcoming: { title: "No upcoming appointments", description: "Book a studio and it'll show up here with directions, your code and a countdown." },
    today: { title: "Nothing booked for today", description: "Your day is clear. Fancy a last-minute slot?" },
    completed: { title: "No past visits yet", description: "Once you've been, your visits live here — ready to review or rebook." },
    cancelled: { title: "No cancelled bookings", description: "Nothing cancelled. Keep it that way." },
    no_show: { title: "No missed appointments", description: "Nothing missed." },
  };

  return (
    <Container width="lg" className="flex flex-col gap-6 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface sm:text-4xl">
            Your bookings
          </h1>
          <p className="mt-1 text-sm text-muted">Everything you&apos;ve booked, past and upcoming.</p>
        </div>
        <Button asChild>
          <Link href="/user/search"><Plus size={16} /> Book an appointment</Link>
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* Rail first in the DOM so the next appointment leads on a phone,
            where it's the whole reason the page gets opened. */}
        <aside className="order-first flex flex-col gap-4 lg:order-last lg:sticky lg:top-24">
          {loading ? (
            <Skeleton className="h-80 rounded-3xl" />
          ) : nextUp ? (
            <NextAppointmentCard booking={nextUp} now={now} onReschedule={setRescheduleFor} />
          ) : (
            <section className="rounded-3xl border border-dashed border-border bg-card p-6 text-center">
              <Sparkles size={20} className="mx-auto text-primary" />
              <p className="mt-2 font-headline text-sm font-bold text-on-surface">Nothing coming up</p>
              <p className="mt-0.5 text-xs text-muted">Your next appointment will appear here, with a live countdown.</p>
              <Button size="sm" className="mt-3" asChild>
                <Link href="/user/search">Find a studio</Link>
              </Button>
            </section>
          )}
          {!loading ? <BookAgainRail bookings={pastBookings} /> : null}
        </aside>

        <div className="flex min-w-0 flex-col gap-4">
          <FilterTabs tabs={tabs} active={activeTab} counts={counts} onChange={setActiveTab} />

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card">
              <EmptyState
                icon={<CalendarX2 size={26} />}
                title={emptyCopy[activeTab].title}
                description={emptyCopy[activeTab].description}
                action={
                  isUpcomingLens ? <Button onClick={() => router.push("/user/search")}>Find a studio</Button> : undefined
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {sections.map((section) => (
                <section key={section.heading} className="flex flex-col gap-3">
                  <h2 className="sticky top-16 z-(--z-index-dropdown) -mx-1 flex items-center gap-3 bg-surface/85 px-1 py-2 text-xs font-bold uppercase tracking-wide text-muted backdrop-blur-sm">
                    {section.heading}
                    <span className="h-px flex-1 bg-border" aria-hidden />
                    <span className="tabular-nums font-semibold">{section.items.length}</span>
                  </h2>
                  {section.items.map((b) => (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      countdown={
                        isUpcomingLens ? countdownLabel(bookingStartDate(b.booking_date, b.start_time), now) : null
                      }
                      onCancel={setCancelFor}
                      onReschedule={setRescheduleFor}
                      onReview={setReviewFor}
                    />
                  ))}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {cancelFor ? (
        <CancelBookingModal bookingId={cancelFor.id} onClose={() => setCancelFor(null)} onCancelled={afterAction} />
      ) : null}
      {rescheduleFor ? (
        <RescheduleBookingModal
          bookingId={rescheduleFor.id}
          studioId={rescheduleFor.studio_id}
          businessMemberId={rescheduleFor.business_member_id}
          durationMinutes={rescheduleFor.total_duration}
          professionalName={rescheduleFor.member_name}
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
