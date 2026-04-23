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

  const { mutate: submitReview, loading: submitting } = useMutation<CreateReviewResponse, [CreateReviewPayload]>(
    (data) => api.createReview({
      bookingId: data.bookingId ?? "",
      studioId: data.studioId ?? 0,
      barberId: data.barberId ?? undefined,
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
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#E5C487]/10 mb-8 border border-[#E5C487]/30">
            <span className="material-symbols-outlined text-[#E5C487] text-6xl icon-filled">
              favorite
            </span>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter text-[#E5C487] mb-4">
            Thank You!
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-md">
            Your feedback helps {booking?.barber_name || "our barbers"} and our community of artisans continue to deliver exceptional experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/user/bookings"
              className="px-8 py-4 bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Bookings
            </Link>
            <Link
              href="/user/book"
              className="px-8 py-4 bg-[#1e1e1e] border border-[#4D463A]/30 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:border-[#E5C487]/40 transition-colors"
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
        <p className="font-label text-[10px] uppercase tracking-widest text-[#E5C487]/60 mb-2">Share Your Experience</p>
        <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-4">Leave a Review</h1>
        <p className="text-gray-400">Your feedback helps others discover exceptional service</p>
      </div>

      {loading ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-8 mb-10 border border-[#4D463A]/20 animate-pulse h-28"></div>
      ) : booking ? (
        <div className="bg-[#1a1a1a] rounded-3xl p-8 mb-10 border border-[#4D463A]/20">
          <div className="flex items-center gap-6">
            {booking.barber_image && (
              <img
                src={booking.barber_image}
                alt={booking.barber_name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-headline text-2xl font-bold text-white mb-1">
                {booking.services?.map((s) => s.name).join(", ") || "Your Appointment"}
              </h3>
              {booking.barber_name && (
                <p className="text-gray-400">
                  with <span className="text-[#E5C487] font-semibold">{booking.barber_name}</span>
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {booking.studio_name} • {new Date(booking.booking_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-3xl p-8 mb-10 border border-[#4D463A]/20 text-center">
          <p className="text-gray-400">Share your general feedback about Revoras</p>
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-3xl p-10 mb-8 border border-[#4D463A]/20">
        <div className="text-center mb-10">
          <h2 className="font-headline text-2xl font-bold mb-3">How was your experience?</h2>
          <p className="text-gray-400 text-sm">Tap a star to rate</p>
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
                  star <= (hoverRating || rating) ? "text-[#E5C487]" : "text-gray-600"
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
          {rating === 5 && <span className="text-[#E5C487]">Exceptional</span>}
          {rating === 0 && <span className="text-gray-500">Select a rating</span>}
        </p>

        <div className="mb-10">
          <p className="font-label text-[10px] uppercase tracking-widest text-gray-500 mb-4 text-center">
            Quick Feedback (Optional)
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-[#E5C487] text-[#402d00]"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
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
          <label className="block font-label text-[10px] uppercase tracking-widest text-gray-500 mb-3">
            Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience in a few words"
            maxLength={100}
            className="w-full bg-[#2a2a2a] border border-[#4D463A]/30 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C487]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block font-label text-[10px] uppercase tracking-widest text-gray-500 mb-3">
            Share More Details (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            placeholder="Tell others about your experience..."
            rows={4}
            className="w-full bg-[#2a2a2a] border border-[#4D463A]/30 rounded-2xl p-5 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#E5C487]/50 transition-colors"
          />
          <p className="text-right text-xs text-gray-500 mt-2">{review.length}/500</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl p-8 mb-10 border border-[#4D463A]/20">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-gray-500 mb-4 block">add_photo_alternate</span>
          <p className="font-semibold text-white mb-2">Add Photos</p>
          <p className="text-sm text-gray-400 mb-4">Show off your fresh look</p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#2a2a2a] text-white rounded-xl cursor-pointer hover:bg-[#3a3a3a] transition-colors">
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
            ? "bg-gradient-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] hover:shadow-[0_10px_30px_rgba(229,196,135,0.3)] active:scale-[0.98]"
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
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
        className="text-center text-gray-500 text-sm mt-6 hover:text-gray-300 transition-colors block"
      >
        Maybe later
      </Link>
    </main>
  );
}

function ReviewPageLoading() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 max-w-7xl mx-auto min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E5C487]"></div>
      <p className="text-gray-400 mt-4">Loading...</p>
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
