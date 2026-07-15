"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Divider } from "@/components/ui/Divider";
import { useRescheduleBooking, useUpdateBookingStatus } from "@/lib/business/hooks/useBookings";
import { useMembers } from "@/lib/business/hooks/useMembers";
import type { BookingRow } from "@/lib/business/types";
import { formatINR } from "@/lib/format";

const STATUS_TONE: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "primary",
  checked_in: "primary",
  completed: "success",
  cancelled: "neutral",
  no_show: "danger",
};

// Phase 2.5 - button presentation per target status. Which buttons actually
// render is decided by the booking's allowedNextStatuses (the state machine),
// so a business only ever sees moves that will succeed.
const ACTION_CONFIG: Record<string, { label: string; intent: "secondary" | "outline" | "danger" }> = {
  confirmed: { label: "Confirm", intent: "secondary" },
  checked_in: { label: "Check in", intent: "secondary" },
  completed: { label: "Mark completed", intent: "secondary" },
  no_show: { label: "No-show", intent: "outline" },
  cancelled: { label: "Cancel", intent: "danger" },
};

export function BookingDetailDrawer({
  studioId,
  booking,
  open,
  onOpenChange,
  canManage,
}: {
  studioId: string | undefined;
  booking: BookingRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage: boolean;
}) {
  const members = useMembers(studioId);
  const reschedule = useRescheduleBooking(studioId);
  const updateStatus = useUpdateBookingStatus(studioId);
  const [form, setForm] = useState({ bookingDate: "", startTime: "", businessMemberId: "" });
  const [confirmCancel, setConfirmCancel] = useState(false);

  useEffect(() => {
    if (booking) {
      setForm({
        bookingDate: booking.booking_date.slice(0, 10),
        startTime: booking.start_time.slice(0, 5),
        businessMemberId: booking.business_member_id,
      });
    }
  }, [booking]);

  if (!booking) return null;

  const nextStatuses = booking.allowedNextStatuses ?? [];
  const isTerminal = nextStatuses.length === 0;
  // Reschedule only makes sense while the booking is still open (not checked in).
  const canReschedule = booking.status === "pending" || booking.status === "confirmed";

  const handleReschedule = () => {
    reschedule.mutate(
      { bookingId: booking.id, bookingDate: form.bookingDate, startTime: form.startTime, businessMemberId: form.businessMemberId },
      {
        onSuccess: () => toast.success("Appointment updated"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update appointment"),
      }
    );
  };

  const handleStatus = (status: string) => {
    updateStatus.mutate(
      { bookingId: booking.id, status },
      {
        onSuccess: () => toast.success(`Marked as ${status.replace("_", " ")}`),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update status"),
      }
    );
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} title={booking.customer_name} description={`Confirmation ${booking.confirmation_code}`}>
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Badge tone={STATUS_TONE[booking.status]}>{booking.status.replace("_", " ")}</Badge>
            <Badge tone={booking.payment_status === "paid" ? "success" : "neutral"}>{booking.payment_status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted">Date</div>
              <div className="text-on-surface font-medium">{new Date(booking.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Time</div>
              <div className="text-on-surface font-medium">{booking.start_time.slice(0, 5)} – {booking.end_time.slice(0, 5)}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Professional</div>
              <div className="text-on-surface font-medium">{booking.member_name}</div>
            </div>
            <div>
              <div className="text-xs text-muted">Amount</div>
              <div className="text-on-surface font-medium">{formatINR(booking.total_amount)}</div>
            </div>
          </div>

          {booking.customer_phone ? (
            <div className="text-sm">
              <span className="text-xs text-muted block">Customer phone</span>
              {booking.customer_phone}
            </div>
          ) : null}

          {booking.notes ? (
            <div className="text-sm">
              <span className="text-xs text-muted block">Notes</span>
              {booking.notes}
            </div>
          ) : null}

          {canManage && canReschedule ? (
            <>
              <Divider />
              <div>
                <div className="text-sm font-semibold text-on-surface mb-3">Reschedule / reassign</div>
                <div className="flex flex-col gap-3">
                  <Input
                    type="date"
                    label="Date"
                    value={form.bookingDate}
                    onChange={(e) => setForm((f) => ({ ...f, bookingDate: e.target.value }))}
                  />
                  <Input
                    type="time"
                    label="Time"
                    value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  />
                  <Select
                    label="Professional"
                    value={form.businessMemberId}
                    onValueChange={(v) => setForm((f) => ({ ...f, businessMemberId: v }))}
                    options={(members.data || []).filter((m) => m.provides_services).map((m) => ({ value: m.id, label: m.name }))}
                  />
                  <Button onClick={handleReschedule} loading={reschedule.isPending}>
                    Save changes
                  </Button>
                </div>
              </div>
            </>
          ) : null}

          {canManage && !isTerminal ? (
            <>
              <Divider />
              {/* Only the state machine's legal next moves render as buttons. */}
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((s) => {
                  const cfg = ACTION_CONFIG[s];
                  if (!cfg) return null;
                  return (
                    <Button
                      key={s}
                      size="sm"
                      intent={cfg.intent}
                      loading={updateStatus.isPending}
                      onClick={() => (s === "cancelled" ? setConfirmCancel(true) : handleStatus(s))}
                    >
                      {cfg.label}
                    </Button>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </Drawer>

      <ConfirmDialog
        open={confirmCancel}
        onOpenChange={setConfirmCancel}
        title="Cancel this appointment?"
        description="The customer will need to be notified separately. This can't be undone."
        confirmLabel="Cancel appointment"
        destructive
        loading={updateStatus.isPending}
        onConfirm={() => {
          handleStatus("cancelled");
          setConfirmCancel(false);
        }}
      />
    </>
  );
}
