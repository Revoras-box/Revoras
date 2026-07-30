"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Clock, ShieldCheck, ShieldOff } from "lucide-react";
import { Modal, Button, ErrorState } from "@/components/ui";
import { SlotGrid } from "@/components/user/booking/SlotGrid";
import { SlotShortfallModal } from "@/components/user/booking/SlotShortfallModal";
import { api } from "@/lib/api";
import { useAvailability } from "@/lib/hooks";
import { addMinutes, displayDuration, displayTime, emptySlotCopy, rangesOverlap } from "@/lib/slot-fit";
import type { AvailabilitySlot, RescheduleEligibility } from "@/lib/types";

/**
 * Moves an existing booking via PATCH /bookings/:id/reschedule — an IN-PLACE
 * update of the same row. This previously linked to the booking wizard with a
 * `reschedule=<id>` param that nothing ever read, so it silently created a
 * SECOND booking (and a second charge) while the original stayed live.
 *
 * The backend owns the rules (pending/confirmed only, paid reschedule protection,
 * the cutoff before the appointment, the moves already used, future only); its
 * errors are surfaced as-is rather than duplicated here.
 *
 * The time picker is the booking wizard's own `SlotGrid`, not a shorter list of
 * whatever happened to be free. A flat list of free times gave no way to tell a
 * fully booked afternoon from a salon that shuts at three, and it silently
 * dropped the times that are free but too short for this appointment — the
 * customer just never saw them. The grid shows the whole day with each
 * position's real state, and a too-short one opens a dialog that names what's in
 * the way. Trimming services is deliberately absent: a move keeps the booking it
 * was paid for.
 */
const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** "today at 4:30 PM" / "Sun 2 Aug at 4:30 PM" — the cutoff as a real moment. */
const displayDeadline = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const isToday = toIsoDate(d) === toIsoDate(new Date());
  return isToday
    ? `today at ${time}`
    : `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} at ${time}`;
};

export default function RescheduleBookingModal({
  bookingId,
  studioId,
  businessMemberId,
  durationMinutes,
  professionalName,
  onClose,
  onRescheduled,
}: {
  bookingId: string;
  studioId: string;
  businessMemberId: string;
  durationMinutes: number;
  /** Named in the empty-day copy — "Ravi isn't working" beats "no slots". */
  professionalName?: string;
  onClose: () => void;
  onRescheduled: () => void;
}) {
  const dateOptions = useMemo(() => {
    const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
    return Array.from({ length: 10 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        iso: toIsoDate(d),
        label: i === 0 ? "Today" : i === 1 ? "Tmrw" : dayFmt.format(d),
        month: monthFmt.format(d),
        date: d.getDate(),
      };
    });
  }, []);

  const [date, setDate] = useState(dateOptions[0].iso);
  const [time, setTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  /** A free-but-too-short slot the customer tapped; drives the shortfall dialog. */
  const [tightSlot, setTightSlot] = useState<AvailabilitySlot | null>(null);

  // The booking's own length, which a move never changes. `total_duration` comes
  // back from Postgres as a string on some rows, so it is coerced rather than
  // trusted — an "NaN min" appointment would ask the server for a garbage grid.
  const bookingDuration = Math.max(Number(durationMinutes) || 0, 0);

  /**
   * Eligibility is re-checked when the modal opens rather than trusted from the
   * list payload it was launched from. That verdict was computed when the page
   * loaded, and the cutoff is a moving deadline — someone who left the tab open
   * would otherwise be shown a slot picker for a booking that can no longer move.
   */
  const [eligibility, setEligibility] = useState<RescheduleEligibility | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let cancelled = false;
    api.getRescheduleQuote(bookingId)
      .then((res) => { if (!cancelled && res.quote) setEligibility(res.quote); })
      // A failed check must not become a silent block: the server re-checks on
      // submit and is the real gate, so the picker stays usable.
      .catch(() => { /* fall through to the picker */ })
      .finally(() => { if (!cancelled) setChecking(false); });
    return () => { cancelled = true; };
  }, [bookingId]);

  const blocked = eligibility !== null && !eligibility.allowed;

  // Authoritative: the server applies the shop's hours, this professional's own
  // rota, their time off and their existing bookings. This used to be filtered
  // again client-side against the studio's hours, which also meant a studio the
  // customer couldn't load silently skipped the filter entirely.
  //
  // `bookingId` is passed so this booking doesn't block its own move: without it
  // the customer's current 2:00–2:30 came back as someone's appointment, hiding
  // 1:40 and 2:00 from them and making the day look busier than it is.
  const {
    grid,
    interval,
    reason,
    shift,
    movingFrom,
    loading,
    error,
    refetch,
  } = useAvailability(studioId, businessMemberId, date, bookingDuration || undefined, undefined, bookingId);

  // What the chosen start actually books, end included — a start time alone
  // doesn't tell someone with a 90-minute appointment where they'll finish.
  const newEnd = time ? addMinutes(time, bookingDuration) : null;
  /**
   * The new time runs into the window this booking currently holds.
   *
   * Legitimate, and the server allows it: the same update vacates the old slot.
   * But on screen it looks like a clash — a 12:00 pick sitting next to a 12:20
   * chip labelled "your time" — so it is named rather than left to be inferred.
   */
  const overlapsCurrent = Boolean(
    time && newEnd && movingFrom && rangesOverlap(time, newEnd, movingFrom.start, movingFrom.end)
  );

  // A slot that was free when the grid loaded can be taken by the time they
  // choose a date again; never carry a stale pick into the confirm button.
  useEffect(() => {
    if (time && !grid.some((slot) => slot.time === time && slot.available)) setTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid]);

  const handleSubmit = async () => {
    if (!time) return;
    setSubmitting(true);
    const res = await api.rescheduleBooking(bookingId, { date, startTime: time });
    setSubmitting(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Booking rescheduled.");
    onRescheduled();
    onClose();
  };

  return (
    <Modal
      open
      onOpenChange={(o) => !o && onClose()}
      // Wide enough for the day grid's columns; a narrower dialog wrapped it to
      // two per row and made a full shift read as an endless scroll.
      size="lg"
      title="Reschedule booking"
      description={
        blocked
          ? "This appointment can no longer be moved."
          : "Pick a new date and time. Your existing booking moves — you won't be charged again."
      }
      footer={
        blocked ? (
          <Button intent="ghost" onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button intent="ghost" onClick={onClose}>Keep current time</Button>
            <Button onClick={handleSubmit} loading={submitting} disabled={!time || checking}>
              Confirm new time
            </Button>
          </>
        )
      }
    >
      {/* Blocked is a dead end, so the slot picker is replaced rather than
          disabled — offering times that can't be taken is the worse failure. */}
      {blocked ? (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-container-low p-4">
          <ShieldOff size={18} className="mt-0.5 shrink-0 text-muted" />
          <p className="text-sm text-muted">{eligibility?.message}</p>
        </div>
      ) : (
      <div className="flex flex-col gap-4">
        {/* What their protection covers and exactly when it lapses. */}
        {eligibility?.allowed && eligibility.protected && eligibility.deadline ? (
          <div className="flex items-start gap-2.5 rounded-xl bg-primary/5 p-3">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-primary" />
            <p className="text-xs text-on-surface">
              You&apos;re covered until <span className="font-semibold">{displayDeadline(eligibility.deadline)}</span>.
              {eligibility.reschedulesRemaining === 1
                ? " This is the last move included."
                : ` ${eligibility.reschedulesRemaining} moves included.`}
            </p>
          </div>
        ) : null}

        <div className="flex gap-2 overflow-x-auto pb-1">
          {dateOptions.map((d) => {
            const on = d.iso === date;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => { setDate(d.iso); setTime(null); }}
                className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-2 transition-colors duration-fast ${
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className={`text-[10px] ${on ? "text-primary-foreground/80" : "text-muted"}`}>{d.label}</span>
                <span className="text-lg font-bold">{d.date}</span>
                <span className={`text-[10px] ${on ? "text-primary-foreground/80" : "text-muted"}`}>{d.month}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="h-40 animate-pulse rounded-xl bg-surface-container-high" />
        ) : error ? (
          <ErrorState description={error} onRetry={refetch} />
        ) : grid.length === 0 ? (
          // A day the professional doesn't work at all has no grid to show, only
          // an explanation. A day that's merely full still renders below, so the
          // customer can see who's taken and what's just too tight for them.
          (() => {
            const { title, hint } = emptySlotCopy(reason, { who: professionalName, mode: "move" });
            return (
              <div className="rounded-xl border border-border p-5 text-center">
                <CalendarClock size={20} className="mx-auto text-muted" />
                <p className="mt-2 text-sm font-medium text-on-surface">{title}</p>
                <p className="text-xs text-muted">{hint}</p>
              </div>
            );
          })()
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {shift ? (
                <p className="text-xs text-muted">
                  {professionalName || "Working"} {shift.start}–{shift.end} on this date
                  {shift.source === "member" ? " (personal schedule)" : ""}
                </p>
              ) : <span />}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-medium text-on-surface">
                <Clock size={11} className="text-primary" /> This booking needs {displayDuration(bookingDuration)}
              </span>
            </div>

            {/* The grid can be a whole working day long; the dialog's own height
                is fixed, so it scrolls here rather than pushing the confirm
                button off-screen. */}
            <div className="-mx-1 max-h-[46vh] overflow-y-auto px-1">
              <SlotGrid
                grid={grid}
                selected={time}
                requiredDuration={bookingDuration}
                interval={interval}
                mode="move"
                onSelect={setTime}
                onTooShort={setTightSlot}
              />
            </div>

            {time && newEnd ? (
              <div className="rounded-xl bg-primary/5 p-3">
                <p className="text-sm font-medium text-on-surface">
                  Moving to {displayTime(time)} – {displayTime(newEnd)}
                </p>
                {overlapsCurrent && movingFrom ? (
                  <p className="mt-0.5 text-xs text-muted">
                    Runs into the slot you&apos;re leaving ({displayTime(movingFrom.start)} –{" "}
                    {displayTime(movingFrom.end)}) — that&apos;s fine, it frees up the moment this booking moves.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
      )}

      <SlotShortfallModal
        open={Boolean(tightSlot)}
        onOpenChange={(o) => !o && setTightSlot(null)}
        slot={tightSlot}
        requiredDuration={bookingDuration}
        fittingSlots={grid.filter((slot) => slot.available)}
        onPickTime={(t) => { setTime(t); setTightSlot(null); }}
      />
    </Modal>
  );
}
