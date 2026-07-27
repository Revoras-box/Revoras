"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronLeft, Check, Clock, CalendarClock, Tag, Lock, Zap, Star, ShieldCheck, Info, Loader2, Sparkles,
} from "lucide-react";
import { Container, Input, Textarea, Button, Avatar, ErrorState } from "@/components/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useBusiness } from "@/lib/hooks";
import { openRazorpayCheckout } from "@/lib/razorpay";
import type { BusinessDetail, Service } from "@/lib/types";

const parseIdList = (value: string | null): string[] =>
  value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

const to24HourTime = (raw: string): string | null => {
  const value = raw.trim();
  const strict24 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (strict24) {
    const hour = Number(strict24[1]);
    const min = Number(strict24[2]);
    if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
  }
  return null;
};

const displayTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const displayDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

interface Quote { discountAmount: number; total: number; offer: { label: string } | null }

/* ------------------------------ progress overlay -------------------------- */

/**
 * The stages mirror the ACTUAL call order in handlePay - the booking row is
 * created BEFORE Razorpay opens, so "creating" genuinely precedes "verifying".
 * Showing "payment verified" before "creating booking" would look tidier and
 * describe a flow this backend doesn't have.
 */
type Stage = "idle" | "creating" | "paying" | "verifying" | "done";

const STAGE_ORDER: Exclude<Stage, "idle">[] = ["creating", "paying", "verifying", "done"];
const STAGE_LABEL: Record<Exclude<Stage, "idle">, string> = {
  creating: "Reserving your slot",
  paying: "Secure payment",
  verifying: "Verifying payment",
  done: "Confirmed — taking you to your booking",
};

// Test mode skips the gateway entirely, so it must not narrate a payment
// window that never opens or a signature that is never checked.
const MOCK_STAGE_LABEL: Record<Exclude<Stage, "idle">, string> = {
  creating: "Reserving your slot",
  paying: "Recording test payment",
  verifying: "Confirming your booking",
  done: "Confirmed — taking you to your booking",
};

function ProgressOverlay({ stage, mock }: { stage: Stage; mock: boolean }) {
  if (stage === "idle") return null;
  const activeIndex = STAGE_ORDER.indexOf(stage);
  const labels = mock ? MOCK_STAGE_LABEL : STAGE_LABEL;
  return (
    // Modal tier: above the sticky action bar, below --z-toast so a payment
    // error still surfaces over it. Razorpay's own widget stacks far higher.
    <div className="fixed inset-0 z-(--z-index-modal) flex items-center justify-center bg-surface/80 backdrop-blur-sm">
      <div className="w-[min(22rem,90vw)] rounded-3xl border border-border bg-card p-6 shadow-elevated">
        <div className="mb-5 flex items-center gap-2 font-headline text-sm font-bold text-on-surface">
          <Sparkles size={15} className="text-accent" /> Confirming your appointment
        </div>
        <ol className="flex flex-col gap-3">
          {STAGE_ORDER.map((s, i) => {
            const done = i < activeIndex;
            const current = i === activeIndex;
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-normal ${
                    done ? "bg-primary text-primary-foreground"
                      : current ? "bg-primary/15 text-primary ring-2 ring-primary"
                      : "bg-surface-container-high text-muted"
                  }`}
                >
                  {done ? <Check size={14} /> : current ? <Loader2 size={13} className="animate-spin" /> : i + 1}
                </span>
                <span className={`text-sm ${current || done ? "font-medium text-on-surface" : "text-muted"}`}>
                  {labels[s]}
                </span>
              </li>
            );
          })}
        </ol>
        {stage === "paying" && !mock ? (
          <p className="mt-5 border-t border-border pt-4 text-xs text-muted">
            Complete the payment in the secure Razorpay window. Your slot is held while you pay.
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------- summary --------------------------------- */

function SummaryRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="inline-flex items-center gap-1.5 text-muted">{icon} {label}</span>
      <span className="truncate text-right font-medium text-on-surface">{value}</span>
    </div>
  );
}

function OrderSummary({
  business, professionalName, services, duration, subtotal, quote, date, time,
}: {
  business: BusinessDetail;
  professionalName?: string;
  services: Service[];
  duration: number;
  subtotal: number;
  quote: Quote | null;
  date: string;
  time: string;
}) {
  const total = quote ? quote.total : subtotal;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar name={business.name} src={business.image_url ?? undefined} size="md" />
        <div className="min-w-0">
          <div className="truncate font-headline text-sm font-bold text-on-surface">{business.name}</div>
          <div className="truncate text-xs text-muted">{[business.city, business.state].filter(Boolean).join(", ")}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-3">
        {professionalName ? <SummaryRow icon={<Star size={12} />} label="Professional" value={professionalName} /> : null}
        <SummaryRow icon={<CalendarClock size={12} />} label="Date" value={displayDate(date)} />
        <SummaryRow icon={<Clock size={12} />} label="Time" value={`${displayTime(time)} · ${duration} min`} />
      </div>

      <ul className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
        {services.map((s) => (
          <li key={s.id} className="flex justify-between gap-2">
            <span className="truncate text-on-surface">{s.name}</span>
            <span className="shrink-0 tabular-nums text-muted">{inr(Number(s.price))}</span>
          </li>
        ))}
      </ul>

      {quote && quote.discountAmount > 0 ? (
        <div className="flex flex-col gap-1 rounded-xl bg-secondary-container/40 p-3 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="tabular-nums">{inr(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between font-medium text-secondary">
            <span className="inline-flex items-center gap-1"><Tag size={13} /> {quote.offer?.label ?? "Offer applied"}</span>
            <span className="tabular-nums">−{inr(quote.discountAmount)}</span>
          </div>
        </div>
      ) : null}

      <div className="flex items-end justify-between border-t border-border pt-3">
        <span className="font-medium text-on-surface">Total</span>
        <span className="font-headline text-2xl font-extrabold text-primary tabular-nums">{inr(total)}</span>
      </div>
    </div>
  );
}

/* ------------------------------ trust indicators -------------------------- */

/**
 * Every line here is a claim the backend can actually back:
 * signature-verified Razorpay, confirmIfPending on payment, the studio's own
 * published policy text, and its real review count. The structured
 * cancellation policy (freeBeforeHours) only reaches the client through a
 * cancellation quote, which needs a booking that doesn't exist yet - so no
 * "free until <time>" deadline is shown here. The confirmation page, where a
 * booking does exist, shows the real one.
 */
function TrustIndicators({ business, mockPayment }: { business: BusinessDetail; mockPayment: boolean }) {
  const reviewCount = business.review_count ?? 0;
  const rating = Number(business.rating ?? 0);
  const cancellation = business.policies?.cancellation;

  const items: { icon: React.ReactNode; text: string }[] = mockPayment
    ? [
        { icon: <Zap size={13} className="text-primary" />, text: "Your slot is confirmed and held the moment you tap Confirm" },
        { icon: <Info size={13} className="text-primary" />, text: "No card is charged in test mode — pay the studio directly" },
      ]
    : [
        { icon: <Lock size={13} className="text-primary" />, text: "Secure payment — card details never touch our servers" },
        { icon: <Zap size={13} className="text-primary" />, text: "Booking confirms instantly once payment succeeds" },
      ];
  // Labelled, because a studio's policy field is free text and is often as
  // terse as "24h" - which says nothing on its own as a bare bullet.
  if (cancellation) items.push({ icon: <ShieldCheck size={13} className="text-primary" />, text: `Cancellation policy: ${cancellation}` });
  if (reviewCount > 0 && rating > 0) {
    items.push({
      icon: <Star size={13} className="fill-primary text-primary" />,
      text: `Rated ${rating.toFixed(1)} by ${reviewCount} guest${reviewCount === 1 ? "" : "s"} at this studio`,
    });
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <li key={it.text} className="flex items-start gap-2 text-xs text-muted">
          <span className="mt-0.5 shrink-0">{it.icon}</span>
          <span className="line-clamp-2">{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------- page ---------------------------------- */

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const studioId = searchParams.get("studioId")?.trim() ?? "";
  const businessMemberId = searchParams.get("barberId")?.trim() ?? "";
  const bookingDate = searchParams.get("date")?.trim() ?? "";
  const bookingTime = to24HourTime(searchParams.get("time")?.trim() ?? "");
  const selectedServiceIds = useMemo(() => parseIdList(searchParams.get("services")), [searchParams]);
  const noteFromBooking = searchParams.get("notes")?.trim() ?? "";

  const profilePhone = typeof user?.phone === "string" ? user.phone : "";
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState(noteFromBooking);
  const [stage, setStage] = useState<Stage>("idle");

  // Which payment path this server offers. "mock" is a temporary stand-in that
  // confirms the booking on click without moving money; the page says so
  // plainly rather than showing a padlock and implying a charge. Starts null so
  // nothing claims either path until the server has answered.
  const [paymentMode, setPaymentMode] = useState<"mock" | "razorpay" | null>(null);
  const isMockPayment = paymentMode === "mock";

  useEffect(() => {
    let cancelled = false;
    api.getPaymentConfig()
      .then((res) => { if (!cancelled) setPaymentMode(res.mode === "mock" ? "mock" : "razorpay"); })
      .catch(() => { if (!cancelled) setPaymentMode("razorpay"); });
    return () => { cancelled = true; };
  }, []);

  // Contact defaults come from the signed-in account rather than an empty form.
  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
    if (profilePhone && !mobile) setMobile(profilePhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name, profilePhone]);

  const { data, loading, error, refetch } = useBusiness(studioId);
  const business = data?.business;
  const selectedServices = useMemo(
    () => business?.services.filter((s) => selectedServiceIds.includes(s.id)) ?? [],
    [business, selectedServiceIds]
  );
  const selectedProfessional = business?.professionals.find((p) => p.id === businessMemberId);
  const subtotal = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Phase 2.4 - preview the applicable offer + discounted total, computed by the
  // same offer engine that applies at booking, so "you pay" matches the charge.
  const [quote, setQuote] = useState<Quote | null>(null);
  const serviceKey = selectedServiceIds.join(",");
  useEffect(() => {
    if (!studioId || selectedServiceIds.length === 0) { setQuote(null); return; }
    let cancelled = false;
    api.quoteBooking(studioId, selectedServiceIds)
      .then((res) => {
        if (!cancelled && res.quote) {
          setQuote({ discountAmount: res.quote.discountAmount, total: res.quote.total, offer: res.quote.offer });
        }
      })
      .catch(() => { /* fall back to the undiscounted subtotal */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studioId, serviceKey]);

  const payable = quote ? quote.total : subtotal;
  const busy = stage !== "idle";

  const invalidContext = !studioId || !businessMemberId || !bookingDate || !bookingTime || selectedServiceIds.length === 0;
  const backToBookHref = useMemo(() => {
    const params = new URLSearchParams();
    if (studioId) params.set("studioId", studioId);
    if (businessMemberId) params.set("barberId", businessMemberId);
    if (selectedServiceIds.length > 0) params.set("services", selectedServiceIds.join(","));
    const query = params.toString();
    return query ? `/user/book?${query}` : "/user/book";
  }, [studioId, businessMemberId, selectedServiceIds]);

  const handlePay = async () => {
    if (invalidContext || !bookingTime) {
      toast.error("Missing booking details. Please return and select your slot again.");
      return;
    }
    if (selectedServices.length === 0 || !selectedProfessional) {
      toast.error("Unable to load booking details. Please go back and retry.");
      return;
    }

    setStage("creating");
    try {
      // The booking carries no contact columns of its own, so a mobile that
      // differs from the account's is passed to the studio as a note - the
      // only field that exists for it.
      const noteParts = [notes.trim()];
      if (mobile.trim() && mobile.trim() !== profilePhone) noteParts.push(`Contact: ${mobile.trim()}`);

      const result = await api.createBooking({
        studioId,
        businessMemberId,
        serviceIds: selectedServiceIds,
        date: bookingDate,
        startTime: bookingTime,
        notes: noteParts.filter(Boolean).join(" | ") || undefined,
      });

      if (result.error || !result.booking) {
        toast.error(result.error || "Failed to create booking.");
        setStage("idle");
        return;
      }

      const bookingId = result.booking.id;
      setStage("paying");

      // Temporary path: no gateway, no order, no signature - the server marks
      // the payment paid and flips the booking to confirmed in one call. The
      // booking row is already created above, so the slot is held either way
      // and shows as booked to everyone else from that moment.
      if (isMockPayment) {
        const confirmed = await api.confirmMockPayment(bookingId);
        if (confirmed.error || !confirmed.paid) {
          toast.error(confirmed.error || "Unable to confirm this booking.");
          setStage("idle");
          return;
        }
        setStage("done");
        toast.success("Booking confirmed");
        router.push(`/user/confirmation?booking=${encodeURIComponent(bookingId)}`);
        return;
      }

      const order = await api.createPaymentOrder(bookingId);
      if (order.error || !order.orderId || !order.keyId || !order.amount) {
        toast.error(order.error || "Unable to start payment for this booking.");
        setStage("idle");
        return;
      }

      const opened = await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Revoras",
        description: selectedServices.map((s) => s.name).join(", "),
        order_id: order.orderId,
        prefill: { name: fullName.trim() || undefined, contact: mobile.trim() || undefined },
        theme: { color: "#C9A45C" },
        handler: async (response) => {
          setStage("verifying");
          try {
            const verification = await api.verifyPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verification.error || !verification.verified) {
              toast.error(verification.error || "Payment could not be verified.");
              setStage("idle");
              return;
            }
            setStage("done");
            router.push(`/user/confirmation?booking=${encodeURIComponent(bookingId)}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
            setStage("idle");
          }
        },
        modal: {
          ondismiss: () => {
            setStage("idle");
            toast.error("Payment was cancelled. Your slot is held as pending — complete payment to confirm it.");
          },
        },
      });

      if (!opened) {
        toast.error("Unable to load the payment widget. Please try again.");
        setStage("idle");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to complete checkout.");
      setStage("idle");
    }
  };

  if (invalidContext) {
    return (
      <Container className="py-16">
        <ErrorState
          title="Checkout details are incomplete"
          description="Please return to booking and select studio, professional, services, date and time."
          onRetry={() => router.push(backToBookHref)}
          retryLabel="Back to booking"
        />
      </Container>
    );
  }
  if (loading) {
    return (
      <Container width="lg" className="py-8">
        <div className="h-96 animate-pulse rounded-3xl bg-surface-container-high" />
      </Container>
    );
  }
  if (error || !business) {
    return (
      <Container width="lg" className="py-8">
        <ErrorState description={error || "Unable to load this studio."} onRetry={refetch} />
      </Container>
    );
  }

  const cashAccepted = (business.payment_methods ?? []).some((m) => /cash/i.test(m));
  const cancellation = business.policies?.cancellation;

  const sectionCard = "rounded-2xl border border-border bg-card p-5";
  const sectionTitle = "mb-3 font-headline text-sm font-bold text-on-surface";

  return (
    <>
      <Container width="lg" className="flex flex-col gap-6 py-6 pb-28 lg:pb-8">
        <div>
          <Link
            href={backToBookHref}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors duration-fast hover:text-on-surface"
          >
            <ChevronLeft size={16} /> Back
          </Link>
          <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">Checkout</h1>
          <p className="mt-0.5 text-sm text-muted">
            {isMockPayment
              ? "Review your appointment and confirm it — payment happens at the studio for now."
              : "Review your appointment and pay to confirm it."}
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left column */}
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <section className={sectionCard}>
              <h2 className={sectionTitle}>Customer details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
                <Input label="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 00000 00000" />
              </div>
              {user?.email ? (
                <p className="mt-3 text-xs text-muted">
                  Your confirmation goes to <span className="text-on-surface">{user.email}</span>
                </p>
              ) : null}
            </section>

            <section className={sectionCard}>
              <h2 className={sectionTitle}>Payment method</h2>
              {/* One card because the backend has exactly one payment path.
                  UPI/card/netbanking/wallet are chosen inside Razorpay's own
                  window - listing them here as selectable would be a second,
                  fake picker in front of the real one. In test mode there is no
                  gateway at all, so the card says exactly that instead of
                  promising a secure charge that never happens. */}
              <div className="flex items-start gap-3 rounded-2xl border border-primary bg-primary/5 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check size={12} />
                </span>
                <div className="min-w-0">
                  <div className="font-headline text-sm font-semibold text-on-surface">
                    {isMockPayment ? "Instant confirmation (test mode)" : "Pay securely online"}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {isMockPayment
                      ? "Online payments aren't live on this server yet. Confirming books the slot now — no money is charged."
                      : "UPI, card, netbanking or wallet — choose in the secure payment window."}
                  </p>
                </div>
              </div>
              {isMockPayment ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning-container/40 p-3 text-xs text-on-warning-container">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <span>
                    Test mode — your appointment is booked and held, but nothing is paid. Settle the amount at the
                    studio.
                  </span>
                </div>
              ) : null}
              {cashAccepted ? (
                <div className="mt-3 flex items-start gap-2 rounded-xl bg-surface-container-low p-3 text-xs text-muted">
                  <Info size={14} className="mt-0.5 shrink-0 text-accent" />
                  <span>
                    This studio also accepts cash at the salon. Paying online now is what confirms your slot instantly.
                  </span>
                </div>
              ) : null}
            </section>

            <section className={sectionCard}>
              <h2 className={sectionTitle}>Notes for the studio (optional)</h2>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={250}
                rows={3}
                placeholder="Anything the professional should know?"
              />
            </section>

            <section className={sectionCard}>
              <h2 className={sectionTitle}>Offers</h2>
              {quote && quote.discountAmount > 0 ? (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary-container/40 p-3">
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-secondary">
                    <Tag size={14} className="shrink-0" />
                    <span className="truncate">{quote.offer?.label ?? "Offer applied"}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-secondary tabular-nums">−{inr(quote.discountAmount)}</span>
                </div>
              ) : (
                <p className="text-xs text-muted">
                  No offer applies to this service selection. The best available offer is applied automatically — there&apos;s no code to enter.
                </p>
              )}
            </section>

            <section className={sectionCard}>
              <h2 className={sectionTitle}>Cancellation</h2>
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  {cancellation ? (
                    <>
                      <div className="text-xs font-medium text-on-surface">This studio&apos;s policy</div>
                      <p className="text-xs text-muted">{cancellation}</p>
                    </>
                  ) : (
                    <p className="text-xs text-muted">
                      This studio hasn&apos;t published a cancellation policy. Your exact cancellation terms are shown on your booking once it&apos;s confirmed.
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-muted">
                    Your exact free-cancellation deadline is shown on your booking once it&apos;s confirmed.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right sticky rail */}
          <aside className="w-full lg:w-96 lg:shrink-0">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-elevated lg:sticky lg:top-24">
              <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                <Sparkles size={13} className="text-accent" /> Appointment summary
              </div>
              <OrderSummary
                business={business}
                professionalName={selectedProfessional?.name}
                services={selectedServices}
                duration={totalDuration}
                subtotal={subtotal}
                quote={quote}
                date={bookingDate}
                time={bookingTime ?? ""}
              />
              <Button
                className="mt-4 hidden w-full lg:inline-flex"
                size="lg"
                loading={busy}
                disabled={busy || paymentMode === null}
                onClick={handlePay}
              >
                {isMockPayment ? <Check size={15} /> : <Lock size={15} />}
                {isMockPayment ? `Confirm booking · ${inr(payable)}` : `Pay ${inr(payable)}`}
              </Button>
              <div className="mt-4 border-t border-border pt-4">
                <TrustIndicators business={business} mockPayment={isMockPayment} />
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile pay bar */}
      <div className="fixed inset-x-0 bottom-0 z-(--z-index-sticky) flex items-center justify-between gap-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div>
          <div className="text-xs text-muted">Total</div>
          <div className="font-headline text-lg font-extrabold text-on-surface tabular-nums">{inr(payable)}</div>
        </div>
        <Button size="lg" loading={busy} disabled={busy || paymentMode === null} onClick={handlePay}>
          {isMockPayment ? <Check size={15} /> : <Lock size={15} />}
          {isMockPayment ? "Confirm booking" : `Pay ${inr(payable)}`}
        </Button>
      </div>

      <ProgressOverlay stage={stage} mock={isMockPayment} />
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Container width="lg" className="py-8 text-sm text-muted">Loading checkout…</Container>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
