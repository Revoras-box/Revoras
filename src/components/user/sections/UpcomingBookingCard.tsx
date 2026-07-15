"use client";

import { useRouter } from "next/navigation";
import { BookingCard, Button, CardSkeleton, EmptyState } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import { formatBookingDateLabel, formatTimeLabel } from "./utils";

export default function UpcomingBookingCard() {
  const router = useRouter();
  const { data, loading } = useBookings({ category: "upcoming", limit: "1" });
  const booking = data?.bookings?.[0];

  if (loading) return <CardSkeleton />;

  if (!booking) {
    return (
      <EmptyState
        title="No upcoming bookings"
        description="Ready for a fresh look?"
        action={
          <Button size="sm" onClick={() => router.push("/user/search")}>
            Find a studio
          </Button>
        }
      />
    );
  }

  return (
    <BookingCard
      businessName={booking.studio_name}
      businessImageUrl={booking.studio_image ?? undefined}
      professionalName={booking.member_designation ?? "Professional"}
      serviceNames={[`${booking.total_duration} min appointment`]}
      dateLabel={formatBookingDateLabel(booking.booking_date)}
      timeLabel={formatTimeLabel(booking.start_time)}
      status={booking.status}
      confirmationCode={booking.confirmation_code}
      onClick={() => router.push("/user/bookings")}
    />
  );
}
