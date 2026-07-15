"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarPlus, MapPin, Phone, QrCode } from "lucide-react";
import { Container, Card, Badge, Button, Avatar, ErrorState, Section } from "@/components/ui";
import { useBooking, useBookingTimeline } from "@/lib/hooks";
import { STATUS_LABEL, STATUS_TONE, buildICS, directionsUrl } from "@/lib/bookings";
import { formatBookingDateLabel, formatTimeLabel } from "@/components/user/sections/utils";
import BookingTimeline from "@/components/user/sections/BookingTimeline";
import CancelBookingModal from "@/components/user/sections/CancelBookingModal";

const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [version, setVersion] = useState(0);
  const [showCancel, setShowCancel] = useState(false);

  const { data, loading, error, refetch } = useBooking(id);
  const { data: timelineData } = useBookingTimeline(id, version);
  const booking = data?.booking;

  if (loading) {
    return (
      <Container className="py-8">
        <div className="h-96 animate-pulse rounded-2xl bg-surface-container-high" />
      </Container>
    );
  }
  if (error || !booking) {
    return (
      <Container className="py-8">
        <ErrorState description={error || "This booking could not be found."} onRetry={refetch} />
      </Container>
    );
  }

  const serviceNames = booking.services.map((s) => s.name).join(", ") || "Your appointment";
  const original = booking.original_amount != null ? Number(booking.original_amount) : null;
  const discount = booking.discount_amount != null ? Number(booking.discount_amount) : 0;
  const total = Number(booking.total_amount);
  const canReschedule = booking.status === "pending" || booking.status === "confirmed";
  const canCancel = (booking.allowedNextStatuses ?? []).includes("cancelled");

  const icsHref = buildICS({
    id: booking.id,
    title: `${serviceNames} at ${booking.studio_name}`,
    location: booking.studio_address,
    date: booking.booking_date,
    startTime: booking.start_time,
    durationMinutes: booking.total_duration,
  });

  const afterAction = () => {
    setVersion((v) => v + 1);
    refetch();
  };

  return (
    <Container className="flex flex-col gap-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">{serviceNames}</h1>
          <p className="mt-1 text-sm text-muted">
            Reservation <span className="font-mono text-on-surface">{booking.confirmation_code}</span>
          </p>
        </div>
        <Badge tone={STATUS_TONE[booking.status]} dot>
          {STATUS_LABEL[booking.status]}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-6 md:col-span-2">
          <Card padding="lg" className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">When</p>
                <p className="mt-1 font-medium text-on-surface">{formatBookingDateLabel(booking.booking_date)}</p>
                <p className="text-sm text-muted">{formatTimeLabel(booking.start_time)} · {booking.total_duration} min</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Where</p>
                <p className="mt-1 font-medium text-on-surface">{booking.studio_name}</p>
                <p className="text-sm text-muted">{booking.studio_address}</p>
              </div>
            </div>

            {booking.member_designation || booking.member_image ? (
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <Avatar name={booking.member_designation ?? "Professional"} src={booking.member_image ?? undefined} size="md" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">Your professional</p>
                  <p className="font-medium text-on-surface">{booking.member_designation ?? "Professional"}</p>
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              <a href={icsHref} download={`booking-${booking.confirmation_code}.ics`}>
                <Button intent="outline" size="sm"><CalendarPlus size={15} /> Add to calendar</Button>
              </a>
              <a href={directionsUrl({ lat: booking.lat, lng: booking.lng, address: booking.studio_address })} target="_blank" rel="noreferrer">
                <Button intent="outline" size="sm"><MapPin size={15} /> Directions</Button>
              </a>
              {booking.studio_phone ? (
                <a href={`tel:${booking.studio_phone}`}>
                  <Button intent="outline" size="sm"><Phone size={15} /> Contact studio</Button>
                </a>
              ) : null}
            </div>
          </Card>

          {/* Services + payment */}
          <Card padding="lg" className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-wide text-muted">Services</p>
            {booking.services.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-on-surface">{s.name}</span>
                <span className="tabular-nums text-muted">{inr(Number(s.price))}</span>
              </div>
            ))}
            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-3 text-sm">
              {discount > 0 && original != null ? (
                <>
                  <div className="flex justify-between text-muted"><span>Subtotal</span><span className="tabular-nums">{inr(original)}</span></div>
                  <div className="flex justify-between text-on-surface"><span>Offer discount</span><span className="tabular-nums">−{inr(discount)}</span></div>
                </>
              ) : null}
              {booking.cancellation_fee != null && Number(booking.cancellation_fee) > 0 ? (
                <div className="flex justify-between text-error"><span>Cancellation fee</span><span className="tabular-nums">{inr(Number(booking.cancellation_fee))}</span></div>
              ) : null}
              <div className="flex justify-between font-semibold text-on-surface">
                <span>{booking.payment_status === "paid" ? "Paid" : "Total"}</span>
                <span className="tabular-nums text-primary">{inr(total)}</span>
              </div>
            </div>
          </Card>

          {booking.notes ? (
            <Card padding="lg">
              <p className="text-xs uppercase tracking-wide text-muted">Notes</p>
              <p className="mt-1 text-sm text-on-surface">{booking.notes}</p>
            </Card>
          ) : null}
        </div>

        {/* Timeline + QR + actions */}
        <div className="flex flex-col gap-6">
          <Card padding="lg">
            <p className="mb-3 text-xs uppercase tracking-wide text-muted">Timeline</p>
            <BookingTimeline events={timelineData?.timeline ?? []} />
          </Card>

          <Card padding="lg" className="flex flex-col items-center gap-2">
            <div className="rounded-xl bg-white p-3 shadow-soft">
              {/* eslint-disable-next-line @next/next/no-img-element -- external QR generator */}
              <img
                alt="Booking QR code"
                className="h-32 w-32"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(booking.confirmation_code)}`}
              />
            </div>
            <p className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted"><QrCode size={12} /> Show at check-in</p>
          </Card>

          {canReschedule || canCancel ? (
            <div className="flex flex-col gap-2">
              {canReschedule ? (
                <Link href={`/user/book?studioId=${booking.studio_id}&barberId=${booking.business_member_id}&services=${booking.services.map((s) => s.id).join(",")}&reschedule=${booking.id}`}>
                  <Button intent="outline" className="w-full">Reschedule</Button>
                </Link>
              ) : null}
              {canCancel ? (
                <Button intent="ghost" className="w-full text-error" onClick={() => setShowCancel(true)}>
                  Cancel booking
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <Button intent="ghost" onClick={() => router.push("/user/bookings")}>← All bookings</Button>
      </div>

      {showCancel ? <CancelBookingModal bookingId={booking.id} onClose={() => setShowCancel(false)} onCancelled={afterAction} /> : null}
    </Container>
  );
}
