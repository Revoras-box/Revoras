"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSubscription } from "@/lib/business/hooks/useSubscription";
import { ICON_SIZE } from "@/lib/design-tokens";

const STATUS_TONE: Record<string, "neutral" | "primary" | "success" | "warning" | "danger"> = {
  pending: "warning",
  active: "success",
  expired: "danger",
  cancelled: "neutral",
};

/** Formats an API date without slicing the string — the raw value may carry a timezone. */
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function SubscriptionStatusCard({ studioId }: { studioId: string | undefined }) {
  const { data, isLoading } = useSubscription(studioId);

  if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;
  if (!data) return null;

  const { current, active, configured } = data;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>{data.plan.label}</CardDescription>
        </div>
        <Badge tone={current ? STATUS_TONE[current.status] : "neutral"}>{current ? current.status : "none"}</Badge>
      </CardHeader>

      {!configured ? (
        // Razorpay keys aren't set on the backend — say so rather than offering a button that can't work.
        <p className="text-sm text-muted">Payments aren&apos;t configured yet, so subscriptions can&apos;t be purchased.</p>
      ) : active && current?.currentPeriodEnd ? (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted">Renews on {formatDate(current.currentPeriodEnd)}.</p>
          <Link href="/business/subscription" className="text-sm font-medium text-primary">
            Manage subscription
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted">Your listing needs an active subscription to stay discoverable.</p>
          <Button asChild intent="primary" size="sm">
            <Link href="/business/subscription">
              <CreditCard size={ICON_SIZE.sm} /> Manage subscription
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
