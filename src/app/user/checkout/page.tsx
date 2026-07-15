"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Container, Card, Input, RadioGroup, Button, Avatar, ErrorState } from "@/components/ui";
import { api } from "@/lib/api";
import { useBusiness } from "@/lib/hooks";
import { openRazorpayCheckout } from "@/lib/razorpay";

const PAYMENT_OPTIONS = [
  { value: "upi", label: "UPI", description: "Google Pay, PhonePe, Paytm" },
  { value: "card", label: "Card", description: "Visa, Mastercard, Amex" },
  { value: "wallet", label: "Wallet", description: "Digital wallets" },
];

const parseIdList = (value: string | null): string[] =>
  value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

const to24HourTime = (raw: string): string | null => {
  const value = raw.trim();
  const strict24 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (strict24) {
    const hour = Number(strict24[1]);
    const min = Number(strict24[2]);
    if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }
  return null;
};

const formatDisplayTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
};

const formatDisplayDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studioId = searchParams.get("studioId")?.trim() ?? "";
  const businessMemberId = searchParams.get("barberId")?.trim() ?? "";
  const bookingDate = searchParams.get("date")?.trim() ?? "";
  const bookingTime = to24HourTime(searchParams.get("time")?.trim() ?? "");
  const selectedServiceIds = useMemo(() => parseIdList(searchParams.get("services")), [searchParams]);
  const noteFromBooking = searchParams.get("notes")?.trim() ?? "";

  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, refetch } = useBusiness(studioId);
  const business = data?.business;
  const selectedServices = business?.services.filter((s) => selectedServiceIds.includes(s.id)) ?? [];
  const selectedProfessional = business?.professionals.find((p) => p.id === businessMemberId);
  const subtotal = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  // Phase 2.4 - preview the applicable offer + discounted total. Computed by the
  // same offer engine that will actually apply at booking, so the "you pay" here
  // matches what Razorpay charges. Keyed off the service set so it re-quotes if
  // the selection changes.
  const [quote, setQuote] = useState<{ discountAmount: number; total: number; offer: { label: string } | null } | null>(null);
  const serviceKey = selectedServiceIds.join(",");
  useEffect(() => {
    if (!studioId || selectedServiceIds.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    api
      .quoteBooking(studioId, selectedServiceIds)
      .then((res) => {
        if (!cancelled && res.quote) setQuote({ discountAmount: res.quote.discountAmount, total: res.quote.total, offer: res.quote.offer });
      })
      .catch(() => {
        /* fall back to showing the undiscounted subtotal */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studioId, serviceKey]);

  const payable = quote ? quote.total : subtotal;
  const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const invalidContext = !studioId || !businessMemberId || !bookingDate || !bookingTime || selectedServiceIds.length === 0;
  const backToBookHref = useMemo(() => {
    const params = new URLSearchParams();
    if (studioId) params.set("studioId", studioId);
    if (businessMemberId) params.set("barberId", businessMemberId);
    if (selectedServiceIds.length > 0) params.set("services", selectedServiceIds.join(","));
    const query = params.toString();
    return query ? `/user/book?${query}` : "/user/book";
  }, [studioId, businessMemberId, selectedServiceIds]);

  const handlePayAndConfirm = async () => {
    if (invalidContext || !bookingTime) {
      toast.error("Missing booking details. Please return and select your slot again.");
      return;
    }
    if (selectedServices.length === 0 || !selectedProfessional) {
      toast.error("Unable to load booking details. Please go back and retry.");
      return;
    }

    setSubmitting(true);
    try {
      const noteParts = [noteFromBooking];
      if (fullName.trim() || mobile.trim()) noteParts.push(`Checkout contact: ${fullName.trim()} ${mobile.trim()}`.trim());

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
        setSubmitting(false);
        return;
      }

      const bookingId = result.booking.id;

      const order = await api.createPaymentOrder(bookingId);
      if (order.error || !order.orderId || !order.keyId || !order.amount) {
        toast.error(order.error || "Unable to start payment for this booking.");
        setSubmitting(false);
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
          try {
            const verification = await api.verifyPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verification.error || !verification.verified) {
              toast.error(verification.error || "Payment could not be verified.");
              return;
            }
            toast.success("Payment successful. Booking confirmed.");
            router.push(`/user/confirmation?booking=${encodeURIComponent(bookingId)}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast.error("Payment was cancelled. Your slot is held as pending - complete payment to confirm it.");
          },
        },
      });

      if (!opened) {
        toast.error("Unable to load the payment widget. Please try again.");
        setSubmitting(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to complete checkout.");
      setSubmitting(false);
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

  return (
    <Container className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-7">
        <h1 className="font-headline text-2xl font-bold text-on-surface">Checkout</h1>

        <Card padding="lg" className="flex flex-col gap-6">
          <RadioGroup label="Payment method" options={PAYMENT_OPTIONS} value={selectedPayment} onValueChange={setSelectedPayment} orientation="horizontal" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
            <Input label="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 00000 00000" />
          </div>
        </Card>
      </div>

      <aside className="lg:col-span-5">
        <Card padding="lg" className="sticky top-20 flex flex-col gap-4">
          {loading ? (
            <div className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
          ) : (
            <div className="flex items-center gap-3">
              <Avatar name={business?.name ?? "Studio"} src={business?.image_url ?? undefined} size="lg" />
              <div>
                <h3 className="font-headline font-bold text-on-surface">{business?.name}</h3>
                <p className="text-xs text-muted">{[business?.city, business?.state].filter(Boolean).join(", ")}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-sm">
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between">
                <span className="text-on-surface">{s.name}</span>
                <span className="text-muted tabular-nums">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(s.price))}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted">
            <div>{formatDisplayDate(bookingDate)}</div>
            <div>
              {formatDisplayTime(bookingTime)} · {totalDuration} min
            </div>
            {selectedProfessional ? <div>with {selectedProfessional.name}</div> : null}
          </div>

          {quote && quote.discountAmount > 0 ? (
            <div className="flex flex-col gap-1 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between text-muted">
                <span>Subtotal</span>
                <span className="tabular-nums">{inr(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-success">
                <span>Offer{quote.offer ? ` · ${quote.offer.label}` : ""}</span>
                <span className="tabular-nums">−{inr(quote.discountAmount)}</span>
              </div>
            </div>
          ) : null}

          <div className={`flex items-end justify-between ${quote && quote.discountAmount > 0 ? "" : "border-t border-border pt-4"}`}>
            <span className="font-medium text-on-surface">Total</span>
            <span className="text-2xl font-bold text-primary tabular-nums">{inr(payable)}</span>
          </div>

          <Button size="lg" loading={submitting} disabled={submitting || loading} onClick={handlePayAndConfirm}>
            Pay & confirm booking
          </Button>
          <p className="text-center text-xs text-muted">By continuing, you agree to our 24h cancellation policy.</p>
        </Card>
      </aside>
    </Container>
  );
}

function CheckoutPageFallback() {
  return <Container className="py-8 text-sm text-muted">Loading checkout...</Container>;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageFallback />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
