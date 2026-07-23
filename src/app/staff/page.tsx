"use client";

import Link from "next/link";
import { CalendarClock, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { TodaySchedulePreview } from "@/components/business/dashboard/TodaySchedulePreview";
import { useBusinessAuth } from "@/lib/business/auth";
import { useBookings } from "@/lib/business/hooks/useBookings";
import { ICON_SIZE } from "@/lib/design-tokens";

// Local calendar date, not UTC - a booking_date column has no timezone, and
// toISOString() would shift near midnight in timezones ahead of UTC.
const todayLocalDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export default function StaffDashboardPage() {
  const { user, activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const memberId = activeMembership?.memberId;
  const today = todayLocalDate();

  const { data, isLoading, isError, refetch } = useBookings(studioId, {
    businessMemberId: memberId,
    from: today,
    to: today,
  });

  const firstName = user?.name?.split(" ")[0];
  const bookings = data?.bookings || [];
  const nowHhmm = new Date().toTimeString().slice(0, 5);
  const next = [...bookings]
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .find((b) => b.start_time.slice(0, 5) >= nowHhmm);

  return (
    <div>
      <PageHeader
        eyebrow={activeMembership?.businessName}
        title={firstName ? `Welcome back, ${firstName}` : "My Day"}
        description="Your schedule for today."
        actions={
          <Link
            href="/staff/appointments"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            <ClipboardList size={ICON_SIZE.sm} /> View all appointments
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} description="Couldn't load your schedule." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <StatCard label="Today's appointments" value={bookings.length} icon={<ClipboardList size={ICON_SIZE.md} />} />
            <StatCard
              label="Next up"
              value={next ? next.start_time.slice(0, 5) : "—"}
              icon={<CalendarClock size={ICON_SIZE.md} />}
            />
          </div>

          <Section title="Today's schedule" description="Everything booked for you today, in order">
            <Card padding="sm">
              <TodaySchedulePreview bookings={bookings} />
            </Card>
          </Section>
        </>
      )}
    </div>
  );
}
