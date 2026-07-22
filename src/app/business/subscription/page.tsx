"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { DataTable, type DataTableColumn } from "@/components/ui/DataTable";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { useBusinessAuth } from "@/lib/business/auth";
import { useSubscription, useCreateSubscriptionOrder, useVerifySubscriptionPayment } from "@/lib/business/hooks/useSubscription";
import { PERMISSIONS, PermissionGate } from "@/lib/business/permissions";
import type { SubscriptionRecord } from "@/lib/business/api";
import { formatINR } from "@/lib/format";
import { ICON_SIZE } from "@/lib/design-tokens";

const PERKS = [
  "Listed on the Revoras marketplace",
  "Online bookings & calendar",
  "Customer reviews & ratings",
  "Business dashboard & analytics",
];

const STATUS_TONE: Record<SubscriptionRecord["status"], "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  active: "success",
  expired: "danger",
  cancelled: "neutral",
};

/** API dates may carry a timezone — parse, never slice. */
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function SubscriptionPage() {
  const { user, activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;

  const { data, isLoading, isError, refetch } = useSubscription(studioId);
  const createOrder = useCreateSubscriptionOrder(studioId);
  const verifyPayment = useVerifySubscriptionPayment(studioId);
  const [paying, setPaying] = useState(false);

  /**
   * Renewal only: create an order, pay, verify. Unlike the onboarding step this
   * must NOT submit onboarding — the business is already past that.
   */
  const handlePay = async () => {
    setPaying(true);
    try {
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
            toast.success("Payment successful — your subscription is active.");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Payment verification failed.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.error("Payment was cancelled.");
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

  const columns: DataTableColumn<SubscriptionRecord>[] = [
    { key: "createdAt", header: "Date", render: (r) => <span className="text-sm text-on-surface">{fmtDate(r.createdAt)}</span> },
    { key: "plan", header: "Plan", render: (r) => <span className="text-sm text-on-surface">{r.plan}</span> },
    { key: "amount", header: "Amount", render: (r) => <span className="text-sm tabular-nums text-on-surface">{formatINR(r.amount)}</span> },
    {
      key: "period",
      header: "Period",
      render: (r) => (
        <span className="text-xs text-muted">
          {fmtDate(r.currentPeriodStart)} – {fmtDate(r.currentPeriodEnd)}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (r) => <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge> },
  ];

  return (
    <PermissionGate permissions={activeMembership?.permissions || []} require={PERMISSIONS.SETTINGS_MANAGE}>
      <div>
        <PageHeader title="Subscription" description="Your Revoras for Business plan and payment history." />

        {isLoading ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} description="Couldn't load your subscription." />
        ) : data ? (
          <>
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles size={ICON_SIZE.sm} />
                      <span className="text-sm font-medium uppercase tracking-wide">{data.plan.label}</span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-headline text-4xl font-semibold text-on-surface">{formatINR(data.plan.amount)}</span>
                      <span className="text-muted">/ month</span>
                    </div>
                  </div>
                  <Badge tone={data.current ? STATUS_TONE[data.current.status] : "neutral"}>
                    {data.current ? data.current.status : "no plan"}
                  </Badge>
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

              <Card className="flex flex-col gap-3">
                <h3 className="font-headline text-base font-semibold text-on-surface">
                  {data.active ? "Your plan is active" : "No active plan"}
                </h3>

                {data.active && data.current?.currentPeriodEnd ? (
                  <p className="text-sm text-muted">
                    Renews on <span className="font-medium text-on-surface">{fmtDate(data.current.currentPeriodEnd)}</span>.
                  </p>
                ) : (
                  <p className="text-sm text-muted">Your listing needs an active subscription to stay discoverable on the marketplace.</p>
                )}

                {!data.configured ? (
                  // Razorpay keys aren't set on this server — an honest dead-end beats a button that can't work.
                  <div className="mt-1 flex items-start gap-2.5 rounded-xl border border-border p-3">
                    <ShieldAlert size={ICON_SIZE.sm} className="mt-0.5 shrink-0 text-on-surface" />
                    <p className="text-xs text-muted">Payments aren&apos;t configured on this server yet, so the plan can&apos;t be renewed from here.</p>
                  </div>
                ) : (
                  <Button className="mt-auto" onClick={handlePay} loading={paying || createOrder.isPending || verifyPayment.isPending}>
                    <RefreshCw size={ICON_SIZE.sm} /> {data.active ? "Renew now" : `Subscribe — ${formatINR(data.plan.amount)}`}
                  </Button>
                )}
              </Card>
            </div>

            <Section title="Payment history" description="Every subscription charge on this business">
              {data.history.length === 0 ? (
                <Card>
                  <EmptyState title="No payments yet" description="Your subscription charges will appear here." />
                </Card>
              ) : (
                <DataTable columns={columns} data={data.history} rowKey={(r) => r.id} />
              )}
            </Section>
          </>
        ) : null}
      </div>
    </PermissionGate>
  );
}
