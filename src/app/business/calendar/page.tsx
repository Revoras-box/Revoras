"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScheduleGrid, type ScheduleDropPayload, type ScheduleEvent, type ScheduleResource } from "@/components/ui/ScheduleGrid";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBusinessAuth } from "@/lib/business/auth";
import { useBookings, useRescheduleBooking } from "@/lib/business/hooks/useBookings";
import { useMembers } from "@/lib/business/hooks/useMembers";
import { useTimeOff } from "@/lib/business/hooks/useSettings";
import { hasPermission, PERMISSIONS } from "@/lib/business/permissions";
import { BookingDetailDrawer } from "@/components/business/BookingDetailDrawer";
import type { BookingRow } from "@/lib/business/types";

type ViewMode = "day" | "week" | "month";

const toDateStr = (d: Date) => d.toISOString().split("T")[0];
const startOfWeek = (d: Date) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay());
  return copy;
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const STATUS_TONE: Record<string, "primary" | "success" | "warning" | "neutral"> = {
  pending: "warning",
  confirmed: "primary",
  completed: "success",
  cancelled: "neutral",
  no_show: "neutral",
};

export default function CalendarPage() {
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const canManage = hasPermission(activeMembership?.permissions || [], PERMISSIONS.BOOKINGS_MANAGE);

  const [view, setView] = useState<ViewMode>("day");
  const [anchor, setAnchor] = useState(() => new Date());
  const [selected, setSelected] = useState<BookingRow | null>(null);

  const members = useMembers(studioId);
  const bookable = useMemo(() => (members.data || []).filter((m) => m.provides_services), [members.data]);

  const { from, to } = useMemo(() => {
    if (view === "day") return { from: toDateStr(anchor), to: toDateStr(anchor) };
    if (view === "week") {
      const start = startOfWeek(anchor);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { from: toDateStr(start), to: toDateStr(end) };
    }
    return { from: toDateStr(startOfMonth(anchor)), to: toDateStr(endOfMonth(anchor)) };
  }, [view, anchor]);

  const bookings = useBookings(studioId, { from, to, limit: 100 });
  const timeOff = useTimeOff(studioId, { from, to });
  const reschedule = useRescheduleBooking(studioId);

  const minutesToTime = (mins: number) =>
    `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

  const handleEventDrop = ({ eventId, resourceId, startMinutes }: ScheduleDropPayload) => {
    const booking = (bookings.data?.bookings || []).find((b) => b.id === eventId);
    if (!booking) return;

    const startTime = minutesToTime(startMinutes);
    // A no-op drop (same slot, same professional) shouldn't cost a round trip.
    if (startTime === booking.start_time.slice(0, 5) && resourceId === booking.business_member_id) return;

    reschedule.mutate(
      {
        bookingId: eventId,
        bookingDate: booking.booking_date.slice(0, 10),
        startTime,
        businessMemberId: resourceId,
      },
      {
        onSuccess: () => toast.success(`${booking.customer_name} moved to ${startTime}`),
        // The grid renders straight off query data, so a failed move simply
        // re-renders in its original slot once the cache settles.
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't reschedule"),
      }
    );
  };

  const shiftAnchor = (delta: number) => {
    const next = new Date(anchor);
    if (view === "day") next.setDate(next.getDate() + delta);
    else if (view === "week") next.setDate(next.getDate() + delta * 7);
    else next.setMonth(next.getMonth() + delta);
    setAnchor(next);
  };

  const heading =
    view === "day"
      ? anchor.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : view === "week"
        ? `${startOfWeek(anchor).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${new Date(startOfWeek(anchor).setDate(startOfWeek(anchor).getDate() + 6)).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
        : anchor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Your team's schedule at a glance."
        actions={
          <div className="flex items-center gap-2">
            <Button intent="ghost" size="icon" onClick={() => shiftAnchor(-1)} aria-label="Previous">
              <ChevronLeft size={18} />
            </Button>
            <Button intent="outline" size="sm" onClick={() => setAnchor(new Date())}>
              Today
            </Button>
            <Button intent="ghost" size="icon" onClick={() => shiftAnchor(1)} aria-label="Next">
              <ChevronRight size={18} />
            </Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="font-headline text-lg font-semibold text-on-surface">{heading}</h2>
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as ViewMode)}
          items={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        >
          {null}
        </Tabs>
      </div>

      {bookings.isError ? (
        <ErrorState onRetry={() => bookings.refetch()} description="Couldn't load the calendar." />
      ) : bookings.isLoading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : view === "day" ? (
        <DayView
          resources={bookable}
          bookings={bookings.data?.bookings || []}
          timeOff={timeOff.data || []}
          onSelect={setSelected}
          onEventDrop={canManage ? handleEventDrop : undefined}
        />
      ) : view === "week" ? (
        <WeekView
          from={from}
          bookings={bookings.data?.bookings || []}
          onSelect={setSelected}
          onDayClick={(date) => {
            setAnchor(new Date(date));
            setView("day");
          }}
        />
      ) : (
        <MonthView
          anchor={anchor}
          bookings={bookings.data?.bookings || []}
          onDayClick={(date) => {
            setAnchor(new Date(date));
            setView("day");
          }}
        />
      )}

      <BookingDetailDrawer
        studioId={studioId}
        booking={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
        canManage={canManage}
      />
    </div>
  );
}

function DayView({
  resources,
  bookings,
  timeOff,
  onSelect,
  onEventDrop,
}: {
  resources: { id: string; name: string }[];
  bookings: BookingRow[];
  timeOff: { business_member_id: string; start_time: string | null; end_time: string | null; is_full_day: boolean }[];
  onSelect: (b: BookingRow) => void;
  onEventDrop?: (payload: ScheduleDropPayload) => void;
}) {
  if (resources.length === 0) {
    return <EmptyState title="No professionals yet" description="Add team members from the Professionals page to see their schedule here." />;
  }

  const scheduleResources: ScheduleResource[] = resources.map((r) => ({ id: r.id, label: r.name }));

  const bookingEvents: ScheduleEvent[] = bookings
    .filter((b) => b.status !== "cancelled")
    .map((b) => ({
      id: b.id,
      resourceId: b.business_member_id,
      label: `${b.customer_name} · ${b.start_time.slice(0, 5)}`,
      startMinutes: timeToMinutes(b.start_time.slice(0, 5)),
      endMinutes: timeToMinutes(b.end_time.slice(0, 5)),
      tone: STATUS_TONE[b.status],
      onClick: () => onSelect(b),
      // Matches the drawer's rule: only a still-open booking can be moved.
      draggable: b.status === "pending" || b.status === "confirmed",
    }));

  const timeOffEvents: ScheduleEvent[] = timeOff
    .filter((t) => !t.is_full_day && t.start_time && t.end_time)
    .map((t, i) => ({
      id: `timeoff-${i}`,
      resourceId: t.business_member_id,
      label: "Time off",
      startMinutes: timeToMinutes(t.start_time!.slice(0, 5)),
      endMinutes: timeToMinutes(t.end_time!.slice(0, 5)),
      tone: "neutral",
    }));

  return (
    <ScheduleGrid
      resources={scheduleResources}
      events={[...bookingEvents, ...timeOffEvents]}
      onEventDrop={onEventDrop}
    />
  );
}

function WeekView({
  from,
  bookings,
  onSelect,
  onDayClick,
}: {
  from: string;
  bookings: BookingRow[];
  onSelect: (b: BookingRow) => void;
  onDayClick: (date: string) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    return toDateStr(d);
  });

  const byDay = new Map<string, BookingRow[]>();
  for (const b of bookings) {
    const key = toDateStr(new Date(b.booking_date));
    byDay.set(key, [...(byDay.get(key) || []), b]);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
      {days.map((day) => {
        const dayBookings = (byDay.get(day) || []).filter((b) => b.status !== "cancelled");
        return (
          <Card key={day} padding="sm" className="flex flex-col gap-2 min-h-40">
            <button onClick={() => onDayClick(day)} className="text-left text-sm font-semibold text-on-surface hover:text-primary">
              {new Date(day).toLocaleDateString("en-IN", { weekday: "short", day: "numeric" })}
            </button>
            {dayBookings.length === 0 ? (
              <span className="text-xs text-muted">No appointments</span>
            ) : (
              <div className="flex flex-col gap-1.5">
                {dayBookings.slice(0, 5).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onSelect(b)}
                    className="text-left rounded-lg bg-surface-container-low px-2 py-1.5 text-xs hover:bg-surface-container transition-colors"
                  >
                    <span className="font-medium text-on-surface">{b.start_time.slice(0, 5)}</span>{" "}
                    <span className="text-muted">{b.customer_name}</span>
                  </button>
                ))}
                {dayBookings.length > 5 ? <span className="text-xs text-muted">+{dayBookings.length - 5} more</span> : null}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function MonthView({
  anchor,
  bookings,
  onDayClick,
}: {
  anchor: Date;
  bookings: BookingRow[];
  onDayClick: (date: string) => void;
}) {
  const first = startOfMonth(anchor);
  const last = endOfMonth(anchor);
  const gridStart = startOfWeek(first);
  const totalCells = Math.ceil((last.getDate() + first.getDay()) / 7) * 7;

  const byDay = new Map<string, number>();
  for (const b of bookings) {
    if (b.status === "cancelled") continue;
    const key = toDateStr(new Date(b.booking_date));
    byDay.set(key, (byDay.get(key) || 0) + 1);
  }

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className="grid grid-cols-7 bg-surface-container-low text-xs font-semibold uppercase tracking-wide text-muted">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-3 py-2 border-b border-border">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day) => {
          const key = toDateStr(day);
          const isCurrentMonth = day.getMonth() === anchor.getMonth();
          const count = byDay.get(key) || 0;
          return (
            <button
              key={key}
              onClick={() => onDayClick(key)}
              className={cn(
                "flex flex-col items-start gap-1 border-b border-r border-border p-2 min-h-24 text-left hover:bg-surface-container-low transition-colors",
                !isCurrentMonth && "opacity-40"
              )}
            >
              <span className="text-sm text-on-surface">{day.getDate()}</span>
              {count > 0 ? <Badge tone="primary">{count} booked</Badge> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
