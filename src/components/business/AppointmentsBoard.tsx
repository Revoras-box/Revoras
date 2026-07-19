"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useUpdateBookingStatus } from "@/lib/business/hooks/useBookings";
import type { BookingRow } from "@/lib/business/types";
import { formatINR } from "@/lib/format";

/**
 * Board view of the appointment pipeline. Only the four *open* statuses get a
 * column — `cancelled` and `no_show` are terminal, so a card that lands there
 * leaves the board rather than sitting in a column nobody works out of.
 */
const COLUMNS = [
  { status: "pending", label: "Pending", hint: "Awaiting your confirmation" },
  { status: "confirmed", label: "Confirmed", hint: "Booked and upcoming" },
  { status: "checked_in", label: "Checked in", hint: "Customer has arrived" },
  { status: "completed", label: "Completed", hint: "Service delivered" },
] as const;

type ColumnStatus = (typeof COLUMNS)[number]["status"];

const COLUMN_TONE: Record<ColumnStatus, "warning" | "primary" | "success"> = {
  pending: "warning",
  confirmed: "primary",
  checked_in: "primary",
  completed: "success",
};

export function AppointmentsBoard({
  studioId,
  bookings,
  loading,
  canManage,
  onSelect,
}: {
  studioId: string | undefined;
  bookings: BookingRow[];
  loading: boolean;
  canManage: boolean;
  onSelect: (b: BookingRow) => void;
}) {
  const updateStatus = useUpdateBookingStatus(studioId);
  const [dragging, setDragging] = useState<BookingRow | null>(null);
  // Cards mid-flight get hidden from their old column so the board doesn't flicker
  // back before the refetch lands.
  const [pendingMove, setPendingMove] = useState<{ id: string; to: ColumnStatus } | null>(null);

  const byColumn = useMemo(() => {
    const map = new Map<ColumnStatus, BookingRow[]>(COLUMNS.map((c) => [c.status, []]));
    for (const b of bookings) {
      const effective = pendingMove?.id === b.id ? pendingMove.to : (b.status as ColumnStatus);
      const bucket = map.get(effective);
      if (bucket) bucket.push(b);
    }
    for (const list of map.values()) {
      list.sort((a, b) => `${a.booking_date}${a.start_time}`.localeCompare(`${b.booking_date}${b.start_time}`));
    }
    return map;
  }, [bookings, pendingMove]);

  /** The state machine is the authority — a column only accepts what the server would accept. */
  const canDropIn = (booking: BookingRow | null, status: ColumnStatus) =>
    !!booking && booking.status !== status && (booking.allowedNextStatuses ?? []).includes(status);

  const handleDrop = (status: ColumnStatus) => {
    const booking = dragging;
    setDragging(null);
    if (!canDropIn(booking, status) || !booking) return;

    setPendingMove({ id: booking.id, to: status });
    updateStatus.mutate(
      { bookingId: booking.id, status },
      {
        onSuccess: () => toast.success(`${booking.customer_name} marked as ${status.replace("_", " ")}`),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update status"),
        onSettled: () => setPendingMove(null),
      }
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((c) => (
          <Skeleton key={c.status} className="h-64 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        title="No appointments to show"
        description="Try adjusting your filters, or check back once bookings start coming in."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {COLUMNS.map((col) => {
        const cards = byColumn.get(col.status) || [];
        const isTarget = canDropIn(dragging, col.status);

        return (
          <section
            key={col.status}
            onDragOver={(e) => {
              // Preventing default is what marks a surface as droppable, so only
              // do it for legal moves — illegal columns keep the "no drop" cursor.
              if (isTarget) e.preventDefault();
            }}
            onDrop={() => handleDrop(col.status)}
            className={cn(
              "flex flex-col rounded-2xl border border-border bg-surface-container-low/40 p-3 min-h-64",
              "transition-colors duration-(--duration-fast) ease-(--ease-out)",
              isTarget && "border-primary bg-primary-container/20",
              dragging && !isTarget && dragging.status !== col.status && "opacity-50"
            )}
            aria-label={`${col.label} appointments`}
          >
            <header className="flex items-center justify-between gap-2 px-1 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-on-surface">{col.label}</h3>
                  <Badge tone={COLUMN_TONE[col.status]}>{cards.length}</Badge>
                </div>
                <p className="text-xs text-muted truncate mt-0.5">{col.hint}</p>
              </div>
            </header>

            <div className="flex flex-col gap-2">
              {cards.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-muted">
                  {isTarget ? "Drop here" : "Nothing here"}
                </p>
              ) : (
                cards.map((b) => (
                  <article
                    key={b.id}
                    draggable={canManage && (b.allowedNextStatuses ?? []).length > 0}
                    onDragStart={() => setDragging(b)}
                    onDragEnd={() => setDragging(null)}
                    onClick={() => onSelect(b)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(b);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "rounded-xl border border-border bg-surface p-3 text-left cursor-pointer",
                      "transition-shadow duration-(--duration-fast) ease-(--ease-out)",
                      "hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      dragging?.id === b.id && "opacity-40",
                      pendingMove?.id === b.id && "opacity-60 pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar name={b.customer_name} src={b.customer_image} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-on-surface truncate text-sm">{b.customer_name}</div>
                        <div className="text-xs text-muted truncate">{b.member_name}</div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted">
                        {new Date(b.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        {" · "}
                        {b.start_time.slice(0, 5)}
                      </span>
                      <span className="font-medium text-on-surface">{formatINR(b.total_amount)}</span>
                    </div>
                    {b.payment_status !== "paid" ? (
                      <Badge tone="neutral" className="mt-2">{b.payment_status}</Badge>
                    ) : null}
                  </article>
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
