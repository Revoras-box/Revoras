"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { Modal, Button, ErrorState } from "@/components/ui";
import { api } from "@/lib/api";
import { useAvailability } from "@/lib/hooks";

/**
 * Moves an existing booking via PATCH /bookings/:id/reschedule — an IN-PLACE
 * update of the same row. This previously linked to the booking wizard with a
 * `reschedule=<id>` param that nothing ever read, so it silently created a
 * SECOND booking (and a second charge) while the original stayed live.
 *
 * The backend owns the rules (pending/confirmed only, no reschedule inside the
 * studio's no-cancel window, future only); its errors are surfaced as-is rather
 * than duplicated here.
 */
const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const displayTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export default function RescheduleBookingModal({
  bookingId,
  studioId,
  businessMemberId,
  durationMinutes,
  onClose,
  onRescheduled,
}: {
  bookingId: string;
  studioId: string;
  businessMemberId: string;
  durationMinutes: number;
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

  // Authoritative: the server applies the shop's hours, this professional's own
  // rota, their time off and their existing bookings. This used to be filtered
  // again client-side against the studio's hours, which also meant a studio the
  // customer couldn't load silently skipped the filter entirely.
  const { slots: times, loading, error, refetch } = useAvailability(
    studioId,
    businessMemberId,
    date,
    durationMinutes || undefined
  );

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
      title="Reschedule booking"
      description="Pick a new date and time. Your existing booking moves — you won't be charged again."
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>Keep current time</Button>
          <Button onClick={handleSubmit} loading={submitting} disabled={!time}>
            Confirm new time
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
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
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-high" />
        ) : error ? (
          <ErrorState description={error} onRetry={refetch} />
        ) : times.length === 0 ? (
          <div className="rounded-xl border border-border p-5 text-center">
            <CalendarClock size={20} className="mx-auto text-muted" />
            <p className="mt-2 text-sm font-medium text-on-surface">No slots available on this date</p>
            <p className="text-xs text-muted">Try another day.</p>
          </div>
        ) : (
          <div className="flex max-h-52 flex-wrap gap-2 overflow-y-auto">
            {times.map((t) => {
              const on = t === time;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-fast ${
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border text-on-surface hover:border-primary hover:text-primary"
                  }`}
                >
                  {displayTime(t)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
