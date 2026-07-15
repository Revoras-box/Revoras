"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CircleCheck, Ban } from "lucide-react";
import { Modal, Button, Textarea } from "@/components/ui";
import { api } from "@/lib/api";
import type { CancellationQuote } from "@/lib/types";

/**
 * Phase 2.5 - policy-aware cancellation. Fetches the cancellation quote first
 * so the customer sees the exact outcome (Free / X% fee / Not cancellable)
 * BEFORE confirming - the same figure the backend records. When the policy
 * blocks cancellation, there's no confirm button at all.
 */
const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function CancelBookingModal({
  bookingId,
  onClose,
  onCancelled,
}: {
  bookingId: string;
  onClose: () => void;
  onCancelled: () => void;
}) {
  const [quote, setQuote] = useState<CancellationQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getCancellationQuote(bookingId)
      .then((res) => {
        if (!cancelled && res.quote) setQuote(res.quote);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const handleConfirm = async () => {
    setSubmitting(true);
    const res = await api.cancelBooking(bookingId, reason || undefined);
    setSubmitting(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Booking cancelled");
    onCancelled();
    onClose();
  };

  const blocked = quote && !quote.cancellable;

  return (
    <Modal
      open
      onOpenChange={(o) => !o && onClose()}
      title="Cancel booking"
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Keep booking
          </Button>
          {quote && quote.cancellable ? (
            <Button intent="danger" onClick={handleConfirm} loading={submitting}>
              {quote.tier === "fee" ? `Cancel & pay ${inr(quote.feeAmount)} fee` : "Cancel booking"}
            </Button>
          ) : null}
        </>
      }
    >
      {loading ? (
        <div className="h-24 animate-pulse rounded-lg bg-surface-container-high" />
      ) : quote ? (
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-start gap-3 rounded-lg p-3 ${
              blocked ? "bg-error-container" : quote.tier === "free" ? "bg-secondary-container" : "bg-tertiary-container"
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {blocked ? <Ban size={18} className="text-on-error-container" /> : quote.tier === "free" ? <CircleCheck size={18} className="text-on-secondary-container" /> : <AlertTriangle size={18} className="text-on-surface" />}
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">
                {blocked ? "This booking can't be cancelled" : quote.tier === "free" ? "Free cancellation" : `${quote.feePercent}% cancellation fee`}
              </p>
              <p className="mt-0.5 text-sm text-muted">{quote.message}</p>
            </div>
          </div>

          {quote.cancellable && quote.tier === "fee" ? (
            <div className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between text-muted">
                <span>Cancellation fee</span>
                <span className="tabular-nums text-on-surface">{inr(quote.feeAmount)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-muted">
                <span>Refund</span>
                <span className="tabular-nums text-on-surface">{inr(quote.refundAmount)}</span>
              </div>
            </div>
          ) : null}

          {quote.cancellable ? (
            <Textarea
              label="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let the studio know why you're cancelling"
              rows={2}
            />
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">Couldn&apos;t load cancellation details. Please try again.</p>
      )}
    </Modal>
  );
}
