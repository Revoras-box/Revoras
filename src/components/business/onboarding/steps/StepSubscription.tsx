"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Sparkles, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { useBusinessAuth } from "@/lib/business/auth";
import { useSubscription, useCreateSubscriptionOrder, useVerifySubscriptionPayment } from "@/lib/business/hooks/useSubscription";
import { useSubmitOnboarding } from "@/lib/business/hooks/useOnboarding";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

const PERKS = [
  "Listed on the Revoras marketplace",
  "Online bookings & calendar",
  "Customer reviews & ratings",
  "Business dashboard & analytics",
];

/**
 * Phase 1.5d - the real ₹99/month payment (previously a placeholder). The flow
 * is: submit onboarding (DRAFT/ONBOARDING -> PAYMENT_PENDING, only if not
 * already done) -> create a Razorpay order -> open Checkout -> verify the
 * payment (-> PAYMENT_PENDING -> PENDING_REVIEW). Mirrors the customer
 * checkout page's createOrder -> openRazorpayCheckout -> verify shape exactly.
 * If the business already reached PAYMENT_PENDING on a prior visit (submitted
 * but payment never completed), submit is skipped and this only needs to
 * create a fresh order and pay.
 */
export function StepSubscription({ studioId, state, goPrev, jumpTo, exit }: WizardStepProps) {
  const { user } = useBusinessAuth();
  const { data: subscription, isLoading } = useSubscription(studioId);
  const submitOnboarding = useSubmitOnboarding(studioId);
  const createOrder = useCreateSubscriptionOrder(studioId);
  const verifyPayment = useVerifySubscriptionPayment(studioId);
  const [paying, setPaying] = useState(false);

  const canSubmit = state.canSubmit;
  const missingSteps = state.steps.filter((s) => s.required && !s.complete);
  const alreadySubmitted = state.businessStatus === "payment_pending";
  const configured = subscription?.configured ?? true;

  const handlePay = async () => {
    setPaying(true);
    try {
      if (!alreadySubmitted) {
        await submitOnboarding.mutateAsync();
      }

      const order = await createOrder.mutateAsync();
      const opened = await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Revoras",
        description: "Revoras for Business — monthly subscription",
        order_id: order.orderId,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone || undefined },
        theme: { color: "#C9A45C" },
        handler: async (response) => {
          try {
            const result = await verifyPayment.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!result.verified) {
              toast.error("Payment could not be verified.");
              return;
            }
            toast.success("Payment successful — your business is submitted for review!");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.error("Payment was cancelled. You can complete it any time from here.");
          },
        },
      });

      if (!opened) {
        toast.error("Unable to load the payment widget. Please try again.");
        setPaying(false);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't start payment");
      setPaying(false);
    }
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 10 of 10"
        title="Subscription"
        description="One simple plan to go live on Revoras. Pay ₹99 to submit your business for review."
      />

      <div className="flex max-w-2xl flex-col gap-6">
        <Card className="relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={18} />
            <span className="text-sm font-medium uppercase tracking-wide">Revoras for Business</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-headline text-4xl font-semibold text-on-surface">₹99</span>
            <span className="text-muted">/ month</span>
          </div>
          <ul className="mt-5 flex flex-col gap-2.5">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-on-surface">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <Check size={12} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Card>

        {isLoading ? (
          <Skeleton className="h-24 rounded-2xl" />
        ) : !configured ? (
          <Card className="flex items-start gap-3 border-tertiary-container">
            <ShieldAlert size={20} className="mt-0.5 shrink-0 text-on-surface" />
            <div>
              <h3 className="font-headline text-base font-semibold text-on-surface">Payments aren&apos;t live yet</h3>
              <p className="mt-1 text-sm text-muted">
                Your business setup is otherwise complete{alreadySubmitted ? " and already submitted" : ""}. Once payments
                are switched on, come back here to pay and finish submitting for review.
              </p>
            </div>
          </Card>
        ) : !canSubmit && !alreadySubmitted ? (
          <Card className="border-tertiary-container">
            <h3 className="font-headline text-base font-semibold text-on-surface">A few things left</h3>
            <p className="mt-1 text-sm text-muted">Complete these required steps before you can pay and submit:</p>
            <div className="mt-3 flex flex-col gap-2">
              {missingSteps.map((s) => (
                <button
                  key={s.key}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-surface-container-low"
                  onClick={() => jumpTo(s.index)}
                >
                  <span className="font-medium text-on-surface">{s.label}</span>
                  <span className="text-xs font-medium text-primary">Complete →</span>
                </button>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-between gap-4 border-secondary-container bg-secondary-container/20">
            <div>
              <p className="text-sm font-medium text-on-surface">
                {alreadySubmitted ? "Your business is submitted — complete payment to finish" : "Ready to go"}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {alreadySubmitted
                  ? "Payment wasn't completed last time. Pay ₹99 to move into review."
                  : "Everything required is complete. Paying submits your business for review."}
              </p>
            </div>
            <Badge tone="primary">
              <Check size={12} /> Verified
            </Badge>
          </Card>
        )}
      </div>

      <WizardFooter
        onPrev={goPrev}
        onNext={handlePay}
        onExit={exit}
        nextLabel={`Pay ₹99 & submit`}
        nextDisabled={!configured || (!canSubmit && !alreadySubmitted)}
        nextLoading={paying || submitOnboarding.isPending || createOrder.isPending || verifyPayment.isPending}
        hint={!configured ? "Payments aren't configured on this server yet." : undefined}
      />
    </div>
  );
}
