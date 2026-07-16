"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBooking, useMutation } from "@/lib/hooks";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface BookingReviewDetails {
  booking?: {
    studio_id?: number;
    barber_id?: string;
    barber_name?: string;
    barber_image?: string;
    studio_name?: string;
    booking_date: string;
    services?: Array<{ name: string }>;
  };
}

interface CreateReviewPayload {
  bookingId: string | null;
  studioId: number | undefined;
  barberId: string | null;
  rating: number;
  title?: string;
  comment?: string;
}

interface CreateReviewResponse {
  message?: string;
  error?: string;
}

const quickTags = [
  "Excellent technique",
  "Great conversation",
  "Attention to detail",
  "Professional",
  "Relaxing atmosphere",
  "On time",
  "Clean studio",
  "Will return",
];

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking");

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const { data: bookingData, loading } = useBooking(bookingId || "");
  const typedBookingData = bookingData as BookingReviewDetails | null;
  const booking = typedBookingData?.booking;

  // studioId/barberId are deliberately not sent: the backend derives the studio
  // and professional from the booking itself and strips these, so passing them
  // only invited the `studioId ?? 0` fallback below to look meaningful.
  const { mutate: submitReview, loading: submitting } = useMutation<CreateReviewResponse, [CreateReviewPayload]>(
    (data) => api.createReview({
      bookingId: data.bookingId ?? "",
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    }) as Promise<CreateReviewResponse & { error?: string }>
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    const reviewData = {
      bookingId: bookingId || null,
      studioId: booking?.studio_id,
      barberId: booking?.barber_id || null,
      rating,
      title: title || selectedTags.slice(0, 2).join(", ") || undefined,
      comment: review || selectedTags.join(". ") || undefined,
    };

    const result = await submitReview(reviewData);
    if (result.success) {
      toast.success("Review submitted successfully!");
      setSubmitted(true);
    } else {
      toast.error(result.error || "Failed to submit review");
    }
  };

  if (submitted) {
    return (
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8 border border-primary/30">
            <span className="material-symbols-outlined text-primary text-6xl icon-filled">
              favorite
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter text-primary mb-4">
            Thank You!
          </h1>
          <p className="text-muted text-lg mb-8 max-w-md">
            Your feedback helps {booking?.barber_name || "our barbers"} and our community of artisans continue to deliver exceptional experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/user/bookings"
              className="px-8 py-4 bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Bookings
            </Link>
            <Link
              href="/user/book"
              className="px-8 py-4 bg-card border border-border/30 text-foreground font-bold rounded-xl flex items-center justify-center gap-2 hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined">calendar_add_on</span>
              Book Again
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 flex flex-col px-6 pt-20 pb-20 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <p className="font-label text-[10px] uppercase tracking-widest text-primary/60 mb-2">Share Your Experience</p>
        <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-4">Leave a Review</h1>
        <p className="text-muted">Your feedback helps others discover exceptional service</p>
      </div>

      {loading ? (
        <div className="bg-surface rounded-3xl p-8 mb-10 border border-border/20 animate-pulse h-28"></div>
      ) : booking ? (
        <div className="bg-surface rounded-3xl p-8 mb-10 border border-border/20">
          <div className="flex items-center gap-6">
            {booking.barber_image && (
              <img
                src={booking.barber_image}
                alt={booking.barber_name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-headline text-2xl font-bold text-foreground mb-1">
                {booking.services?.map((s) => s.name).join(", ") || "Your Appointment"}
              </h3>
              {booking.barber_name && (
                <p className="text-muted">
                  with <span className="text-primary font-semibold">{booking.barber_name}</span>
                </p>
              )}
              <p className="text-sm text-secondary-foreground mt-1">
                {booking.studio_name} • {new Date(booking.booking_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl p-8 mb-10 border border-border/20 text-center">
          <p className="text-muted">Share your general feedback about Revoras</p>
        </div>
      )}

      <div className="bg-surface rounded-3xl p-10 mb-8 border border-border/20">
        <div className="text-center mb-10">
          <h2 className="font-headline text-2xl font-bold mb-3">How was your experience?</h2>
          <p className="text-muted text-sm">Tap a star to rate</p>
        </div>

        <div className="flex justify-center gap-4 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-125 active:scale-95"
            >
              <span
                className={`material-symbols-outlined text-5xl transition-colors icon-filled ${
                  star <= (hoverRating || rating) ? "text-primary" : "text-secondary-foreground"
                }`}
              >
                star
              </span>
            </button>
          ))}
        </div>

        <p className="text-center text-lg font-semibold mb-10">
          {rating === 1 && <span className="text-red-400">Poor</span>}
          {rating === 2 && <span className="text-orange-400">Fair</span>}
          {rating === 3 && <span className="text-yellow-400">Good</span>}
          {rating === 4 && <span className="text-lime-400">Very Good</span>}
          {rating === 5 && <span className="text-primary">Exceptional</span>}
          {rating === 0 && <span className="text-secondary-foreground">Select a rating</span>}
        </p>

        <div className="mb-10">
          <p className="font-label text-[10px] uppercase tracking-widest text-secondary-foreground mb-4 text-center">
            Quick Feedback (Optional)
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-foreground hover:bg-surface"
                }`}
              >
                {selectedTags.includes(tag) && (
                  <span className="material-symbols-outlined text-sm mr-1 align-middle">check</span>
                )}
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block font-label text-[10px] uppercase tracking-widest text-secondary-foreground mb-3">
            Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            maxLength={100}
            className="w-full bg-surface border border-border/30 rounded-xl p-4 text-foreground placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-secondary-foreground mb-3">
            Share More Details (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            placeholder="Tell others about your experience..."
            rows={4}
            className="w-full bg-surface border border-border/30 rounded-2xl p-5 text-foreground placeholder-gray-500 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
          <p className="text-right text-xs text-secondary-foreground mt-2">{review.length}/500</p>
        </div>
      </div>

      <div className="bg-surface rounded-3xl p-8 mb-10 border border-border/20">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-secondary-foreground mb-4 block">add_photo_alternate</span>
          <p className="font-semibold text-foreground mb-2">Add Photos</p>
          <p className="text-sm text-muted mb-4">Show off your fresh look</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-foreground rounded-xl cursor-pointer hover:bg-surface transition-colors">
            <span className="material-symbols-outlined">upload</span>
            Choose Files
            <input type="file" accept="image/*" multiple className="hidden" />
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
          rating > 0 && !submitting
            ? "bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground hover:shadow-[0_10px_30px_rgba(229,196,135,0.3)] active:scale-[0.98]"
            : "bg-surface-container-high text-secondary-foreground cursor-not-allowed"
        }`}
      >
        {submitting ? (
          <>
            <span className="animate-spin material-symbols-outlined">progress_activity</span>
            Submitting...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">send</span>
            Submit Review
          </>
        )}
      </button>

      <Link
        href="/user/bookings"
        className="text-center text-secondary-foreground text-sm mt-6 hover:text-foreground transition-colors block"
      >
        Maybe later
      </Link>
    </main>
  );
}

function ReviewPageLoading() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-fixed-dim"></div>
      <p className="text-muted mt-4">Loading...</p>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewPageLoading />}>
      <ReviewPageContent />
    </Suspense>
  );
}
