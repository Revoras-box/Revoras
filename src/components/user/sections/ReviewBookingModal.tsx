"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Modal, Button, Textarea } from "@/components/ui";
import { api } from "@/lib/api";

/**
 * Rate a completed booking. The backend derives the studio + professional from
 * the booking itself and enforces both rules this UI relies on: the booking
 * must be `completed`, and `reviews.booking_id` is UNIQUE (409 on a repeat).
 * Those errors are surfaced verbatim rather than pre-guessed here.
 */
const RATING_LABEL = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function ReviewBookingModal({
  bookingId,
  studioName,
  visitLabel,
  onClose,
  onReviewed,
}: {
  bookingId: string;
  studioName: string;
  /** Identifies which visit is being rated (e.g. "July 20 · with Svc Owner"). */
  visitLabel: string;
  onClose: () => void;
  onReviewed: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const shown = hover || rating;

  const handleSubmit = async () => {
    if (rating < 1) return;
    setSubmitting(true);
    const res = await api.createReview({ bookingId, rating, comment: comment.trim() || undefined });
    setSubmitting(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Thanks for the review.");
    onReviewed();
    onClose();
  };

  return (
    <Modal
      open
      onOpenChange={(o) => !o && onClose()}
      title="Rate your visit"
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>Not now</Button>
          <Button onClick={handleSubmit} loading={submitting} disabled={rating < 1}>
            Submit review
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <p className="font-headline text-sm font-semibold text-on-surface">{studioName}</p>
          <p className="text-xs text-muted">{visitLabel}</p>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-2xl bg-surface-container-low p-4">
          <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                aria-label={`${n} star${n === 1 ? "" : "s"}`}
                aria-pressed={rating === n}
                className="rounded-full p-1 transition-transform duration-fast hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Star
                  size={30}
                  className={n <= shown ? "fill-primary text-primary" : "text-on-surface/25"}
                />
              </button>
            ))}
          </div>
          <p className="h-4 text-xs font-medium text-muted">{shown ? RATING_LABEL[shown] : "Tap to rate"}</p>
        </div>

        <Textarea
          label="Anything to add? (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="How was the service?"
        />
      </div>
    </Modal>
  );
}
