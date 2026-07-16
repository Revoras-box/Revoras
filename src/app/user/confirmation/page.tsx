"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarPlus, MapPin, Share2, Phone, ArrowRight, Clock, ShieldCheck, CreditCard, Car,
  LifeBuoy, Sparkles, Check,
} from "lucide-react";
import { Container, Avatar, Button, ErrorState } from "@/components/ui";
import { api } from "@/lib/api";
import { useBooking, useBusiness } from "@/lib/hooks";
import { buildICS, directionsUrl, bookingStartDate } from "@/lib/bookings";
import type { CancellationQuote } from "@/lib/types";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const displayTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};


/* --------------------------------- confetti ------------------------------- */

const CONFETTI_COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-secondary)"];

function Confetti() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Gated here rather than in CSS: the global reduce block zeroes
    // animation-duration, which would leave the pieces frozen on screen.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 4200);
    return () => clearTimeout(t);
  }, []);

  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: `${(i * 2.78 + (i % 5) * 3) % 100}%`,
        delay: `${(i % 9) * 140}ms`,
        duration: `${2600 + (i % 6) * 320}ms`,
        drift: `${((i % 7) - 3) * 26}px`,
        spin: `${360 + (i % 4) * 240}deg`,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: i % 3 === 0 ? 10 : 7,
        round: i % 4 === 0,
      })),
    []
  );

  if (!show) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-(--z-index-sticky) overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            opacity: 0.85,
            animation: `confetti-fall ${p.duration} cubic-bezier(0.2, 0.6, 0.35, 1) ${p.delay} forwards`,
            // consumed by the confetti-fall keyframe
            ["--drift" as string]: p.drift,
            ["--spin" as string]: p.spin,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------- info section ----------------------------- */

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 shrink-0 text-muted">{icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-on-surface">{label}</div>
        <div className="text-xs text-muted">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

function ConfirmationPageContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking")?.trim() ?? "";

  const { data, loading, error } = useBooking(bookingId);
  const booking = data?.booking;

  // The studio's own record carries amenities/policies that the booking row
  // doesn't. Only discoverable studios resolve here, so every field it feeds
  // is rendered conditionally and the page stands without it.
  const { data: businessData } = useBusiness(booking?.studio_id ?? "");
  const business = businessData?.business;

  // The real cancellation terms for THIS booking, straight from the engine that
  // would charge the fee - not a guess at a deadline.
  const [quote, setQuote] = useState<CancellationQuote | null>(null);
  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    api.getCancellationQuote(bookingId)
      .then((res) => { if (!cancelled && res.quote) setQuote(res.quote); })
      .catch(() => { /* fall back to the studio's published policy text */ });
    return () => { cancelled = true; };
  }, [bookingId]);

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
        <div className="h-72 animate-pulse rounded-3xl bg-surface-container-high" />
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

  const start = bookingStartDate(booking.booking_date, booking.start_time);
  const weekday = start.toLocaleDateString("en-US", { weekday: "long" });
  const dateLine = start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const serviceNames = booking.services.map((s) => s.name).join(", ") || "Your appointment";
  const total = Number(booking.total_amount);
  const discount = Number(booking.discount_amount ?? 0);

  const icsHref = buildICS({
    id: booking.id,
    title: `${serviceNames} at ${booking.studio_name}`,
    location: booking.studio_address,
    date: booking.booking_date,
    startTime: booking.start_time,
    durationMinutes: booking.total_duration,
  });

  const handleShare = async () => {
    const text = `${serviceNames} at ${booking.studio_name} — ${weekday}, ${dateLine} at ${displayTime(booking.start_time)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Revoras booking", text });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Booking details copied to clipboard.");
    } catch {
      /* user dismissed the share sheet - nothing to report */
    }
  };

  const parking = (business?.amenities ?? []).find((a) => /park|valet/i.test(a));

  // Free-cancellation deadline, computed from the policy the backend returned.
  const freeUntil = quote ? new Date(start.getTime() - quote.policy.freeBeforeHours * 3600_000) : null;
  const freeUntilLabel =
    freeUntil && freeUntil.getTime() > Date.now()
      ? freeUntil.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) +
        ", " + displayTime(`${freeUntil.getHours()}:${String(freeUntil.getMinutes()).padStart(2, "0")}`)
      : null;

  const paid = booking.payment_status === "paid";

  return (
    <>
      <Confetti />
      <Container width="md" className="flex flex-col gap-6 py-10">
        {/* Celebration */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="animate-success-pop text-5xl" role="img" aria-label="Celebration">🎉</div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            You&apos;re booked!
          </h1>
          <p className="text-sm text-muted">
            Confirmation <span className="font-mono text-on-surface">{booking.confirmation_code}</span>
          </p>
        </div>

        {/* The appointment, stated big */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
          {booking.studio_image ? (
            // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
            <img src={booking.studio_image} alt={booking.studio_name} className="h-36 w-full object-cover" />
          ) : (
            <div className="brand-gradient h-24 w-full" />
          )}

          <div className="p-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="font-headline text-3xl font-extrabold text-on-surface">{weekday}</div>
              <div className="text-sm text-muted">{dateLine}</div>
              <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-headline text-xl font-bold text-primary">
                <Clock size={16} /> {displayTime(booking.start_time)}
              </div>
              <div className="mt-3 font-headline text-lg font-bold text-on-surface">{serviceNames}</div>
              <div className="text-xs text-muted">{booking.total_duration} min</div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 border-t border-border pt-5">
              <div className="flex items-center gap-3">
                <Avatar name={booking.member_name} src={booking.member_image ?? undefined} size="md" />
                <div className="text-left">
                  <div className="text-[11px] uppercase tracking-wide text-muted">With</div>
                  <div className="text-sm font-medium text-on-surface">{booking.member_name}</div>
                  {booking.member_designation ? (
                    <div className="text-xs text-muted">{booking.member_designation}</div>
                  ) : null}
                </div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="min-w-0 text-left">
                <div className="text-[11px] uppercase tracking-wide text-muted">At</div>
                <Link
                  href={`/user/business/${encodeURIComponent(booking.studio_id)}`}
                  className="truncate text-sm font-medium text-on-surface transition-colors duration-fast hover:text-primary"
                >
                  {booking.studio_name}
                </Link>
                <div className="truncate text-xs text-muted">{booking.studio_address}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button intent="outline" asChild>
            <a href={directionsUrl({ lat: booking.lat, lng: booking.lng, address: booking.studio_address })} target="_blank" rel="noreferrer">
              <MapPin size={16} /> Directions
            </a>
          </Button>
          <Button intent="outline" asChild>
            <a href={icsHref} download={`booking-${booking.confirmation_code}.ics`}>
              <CalendarPlus size={16} /> Calendar
            </a>
          </Button>
          <Button intent="outline" onClick={handleShare}>
            <Share2 size={16} /> Share
          </Button>
          {booking.studio_phone ? (
            <Button intent="outline" asChild>
              <a href={`tel:${booking.studio_phone}`}><Phone size={16} /> Contact</a>
            </Button>
          ) : (
            <Button intent="outline" asChild>
              <Link href={`/user/bookings/${encodeURIComponent(booking.id)}`}><ArrowRight size={16} /> Details</Link>
            </Button>
          )}
        </div>

        {/* Information */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Sparkles size={13} className="text-accent" /> Good to know
          </div>
          <div className="divide-y divide-border">
            <InfoRow icon={<Clock size={16} />} label="Arrival">
              Arrive a few minutes before {displayTime(booking.start_time)} so your appointment can start on time.
            </InfoRow>

            {parking ? (
              <InfoRow icon={<Car size={16} />} label="Parking">{parking} is available at this studio.</InfoRow>
            ) : null}

            <InfoRow icon={<ShieldCheck size={16} />} label="Cancellation">
              {freeUntilLabel
                ? `Free until ${freeUntilLabel}. After that, a ${quote?.policy.feePercentAfter}% fee applies.`
                : quote?.message ||
                  business?.policies?.cancellation ||
                  "Cancellation terms for this booking are shown on the booking details page."}
            </InfoRow>

            <InfoRow icon={<CreditCard size={16} />} label="Payment">
              {paid ? `Paid ${inr(total)} online` : `${inr(total)} due — payment not completed yet`}
              {discount > 0 ? ` · ${inr(discount)} saved with an offer` : ""}
            </InfoRow>

            <InfoRow icon={<LifeBuoy size={16} />} label="Support">
              {booking.studio_phone
                ? <>Questions about this appointment? Call the studio on <a className="text-primary hover:underline" href={`tel:${booking.studio_phone}`}>{booking.studio_phone}</a>.</>
                : "Questions about this appointment? Manage or cancel it from your booking details."}
            </InfoRow>
          </div>
        </div>

        {/* Onward */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href={`/user/bookings/${encodeURIComponent(booking.id)}`}>View booking <ArrowRight size={16} /></Link>
          </Button>
          <Button intent="outline" size="lg" asChild>
            <Link href={`/user/business/${encodeURIComponent(booking.studio_id)}`}>Book another</Link>
          </Button>
          <Button intent="ghost" size="lg" asChild>
            <Link href="/user"><Check size={16} /> Done</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<Container className="py-16 text-sm text-muted">Loading confirmation…</Container>}>
      <ConfirmationPageContent />
    </Suspense>
  );
}
