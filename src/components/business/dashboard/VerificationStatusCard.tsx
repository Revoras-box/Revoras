"use client";

import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useVerification } from "@/lib/business/hooks/useVerification";
import { VERIFICATION_STATUS_META } from "@/lib/business/verification-status";
import { ICON_SIZE } from "@/lib/design-tokens";

export function VerificationStatusCard({ studioId }: { studioId: string | undefined }) {
  const { data, isLoading } = useVerification(studioId);

  if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;
  if (!data) return null;

  const meta = data.currentRequest ? VERIFICATION_STATUS_META[data.currentRequest.status] : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification</CardTitle>
        {data.verified ? (
          <Badge tone="success">
            <BadgeCheck size={ICON_SIZE.sm} /> Verified
          </Badge>
        ) : meta ? (
          <Badge tone={meta.tone}>{meta.label}</Badge>
        ) : null}
      </CardHeader>

      {data.verified ? (
        <p className="text-sm text-muted">Your verified badge is live on your public listing.</p>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted">
            {meta ? meta.blurb : "Verified businesses rank higher and convert better."}
          </p>
          <Button asChild intent={meta?.tone === "warning" ? "primary" : "outline"} size="sm">
            <Link href="/business/verification">
              <ShieldCheck size={ICON_SIZE.sm} /> {meta ? "Open Verification Center" : "Get verified"}
            </Link>
          </Button>
        </div>
      )}
    </Card>
  );
}
