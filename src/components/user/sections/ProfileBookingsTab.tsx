"use client";

import Link from "next/link";
import { BookingCard, CardSkeleton, EmptyState, Button } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import { formatBookingDateLabel, formatTimeLabel } from "./utils";

export default function ProfileBookingsTab() {
  const { data, loading } = useBookings({ category: "upcoming", limit: "3" });
  const bookings = data?.bookings ?? [];

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        <CardSkeleton />
      ) : bookings.length === 0 ? (
        <EmptyState title="No upcoming bookings" />
      ) : (
        bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            businessName={booking.studio_name}
            businessImageUrl={booking.studio_image ?? undefined}
            professionalName={booking.member_designation ?? "Professional"}
            serviceNames={[`${booking.total_duration} min appointment`]}
            dateLabel={formatBookingDateLabel(booking.booking_date)}
            timeLabel={formatTimeLabel(booking.start_time)}
            status={booking.status}
            confirmationCode={booking.confirmation_code}
          />
        ))
      )}
      <Link href="/user/bookings">
        <Button intent="outline">View all bookings</Button>
      </Link>
    </div>
  );
}
