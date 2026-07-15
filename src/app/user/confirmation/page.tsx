"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CalendarPlus, MapPin } from "lucide-react";
import { Container, Card, Avatar, Badge, Button, ErrorState } from "@/components/ui";
import { useBooking } from "@/lib/hooks";
import { formatBookingDateLabel, formatTimeLabel } from "@/components/user/sections/utils";
import { buildICS, directionsUrl } from "@/lib/bookings";

function statusTone(status: string): "success" | "warning" | "danger" | "neutral" {
  if (status === "cancelled" || status === "no_show") return "danger";
  if (status === "pending") return "warning";
  if (status === "confirmed") return "success";
  return "neutral";
}

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking")?.trim() ?? "";

  const { data, loading, error } = useBooking(bookingId);
  const booking = data?.booking;

  if (!bookingId) {
    return (
      <Container className="py-16">
        <ErrorState title="Booking reference missing" description="Open this page from your bookings list to view a real confirmation." />
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-surface-container-high" />
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container className="py-16">
        <ErrorState description={error || "This booking could not be found."} />
      </Container>
    );
  }

  const serviceNames = booking.services.map((s) => s.name).join(", ") || "Your appointment";
  const qrPayload = JSON.stringify({
    bookingId: booking.id,
    confirmationCode: booking.confirmation_code,
    studio: booking.studio_name,
    date: booking.booking_date,
    time: booking.start_time,
  });
  const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload)}`;

  return (
    <Container className="flex flex-col items-center gap-10 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 size={64} className="text-secondary" />
        <h1 className="font-headline text-3xl font-bold text-on-surface md:text-4xl">Booking confirmed</h1>
        <p className="text-sm text-muted">
          Reservation ID: <span className="font-mono text-on-surface">{booking.confirmation_code}</span>
        </p>
      </div>

      <Card padding="lg" className="grid w-full max-w-4xl gap-8 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">{serviceNames}</h2>
              {booking.member_designation ? <p className="mt-1 text-sm text-muted">with {booking.member_designation}</p> : null}
            </div>
            <Badge tone={statusTone(booking.status)} dot>
              {booking.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Date & time</p>
              <p className="mt-1 font-medium text-on-surface">{formatBookingDateLabel(booking.booking_date)}</p>
              <p className="text-sm text-muted">{formatTimeLabel(booking.start_time)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Location</p>
              <p className="mt-1 font-medium text-on-surface">{booking.studio_name}</p>
              <p className="text-sm text-muted">{booking.studio_address}</p>
            </div>
          </div>

          {booking.member_designation || booking.member_image ? (
            <div className="flex items-center gap-4 border-t border-border pt-6">
              <Avatar name={booking.member_designation ?? "Professional"} src={booking.member_image ?? undefined} size="lg" />
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Your professional</p>
                <p className="font-medium text-on-surface">{booking.member_designation ?? "Professional"}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-center gap-2 border-t border-border pt-6 md:col-span-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="rounded-2xl bg-white p-4 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element -- external QR generator */}
            <img alt="Booking QR code" className="h-40 w-40" src={qrCodeSrc} />
          </div>
          <p className="text-xs uppercase tracking-wide text-muted">Scan at concierge</p>
        </div>
      </Card>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href={`/user/bookings/${encodeURIComponent(booking.id)}`}>
          <Button>View booking</Button>
        </Link>
        <a
          href={buildICS({
            id: booking.id,
            title: `${serviceNames} at ${booking.studio_name}`,
            location: booking.studio_address,
            date: booking.booking_date,
            startTime: booking.start_time,
            durationMinutes: booking.total_duration,
          })}
          download={`booking-${booking.confirmation_code}.ics`}
        >
          <Button intent="outline"><CalendarPlus size={16} /> Add to calendar</Button>
        </a>
        <a href={directionsUrl({ lat: booking.lat, lng: booking.lng, address: booking.studio_address })} target="_blank" rel="noreferrer">
          <Button intent="outline"><MapPin size={16} /> Directions</Button>
        </a>
        <Link href="/user">
          <Button intent="ghost">Back to home</Button>
        </Link>
      </div>
    </Container>
  );
}

function ConfirmationPageLoading() {
  return <Container className="py-16 text-sm text-muted">Loading confirmation...</Container>;
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationPageLoading />}>
      <ConfirmationPageContent />
    </Suspense>
  );
}
