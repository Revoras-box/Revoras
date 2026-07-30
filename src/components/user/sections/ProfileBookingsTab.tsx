"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { BookingCard, Card, CardSkeleton, EmptyState, Button } from "@/components/ui";
import { useBookings } from "@/lib/hooks";
import { ICON_SIZE } from "@/lib/design-tokens";
import { ProfileSection } from "./ProfileSection";
import { formatBookingDateLabel, formatTimeLabel } from "./utils";

export default function ProfileBookingsTab() {
  const { data, loading } = useBookings({ category: "upcoming", limit: "3" });
  const bookings = data?.bookings ?? [];

  return (
    <ProfileSection
      title="Upcoming bookings"
      description="Your next appointments. Past ones live in your full booking history."
      actions={
        <Button asChild intent="outline" size="sm">
          <Link href="/user/bookings">View all bookings</Link>
        </Button>
      }
    >
      {loading ? (
        <CardSkeleton />
      ) : bookings.length === 0 ? (
        // Previously a bare line of text stranded in whitespace with no icon and
        // no way forward. An empty account page is the most common first view a
        // new customer gets, so it should point somewhere.
        <Card padding="none">
          <EmptyState
            icon={<CalendarDays size={ICON_SIZE.lg} />}
            title="No upcoming bookings"
            description="When you book an appointment, it will appear here with the time, place and confirmation code."
            action={
              <Button asChild size="sm">
                <Link href="/user/search">Find a studio</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((booking) => (
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
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
