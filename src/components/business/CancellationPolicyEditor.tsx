"use client";

import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { TIER_WINDOWS, REFUND_OPTIONS, NO_CANCEL_WITHIN_HOURS, type RefundMap } from "@/lib/business/cancellation-policy";

/**
 * The structured cancellation & refund schedule editor: one refund-percent
 * dropdown per cancellation window. Shared by the onboarding "Business
 * information" step and the dashboard Settings page so both look and behave
 * identically. Controlled — the parent owns the refunds map.
 */
export function CancellationPolicyEditor({
  refunds,
  onChange,
  className,
}: {
  refunds: RefundMap;
  onChange: (next: RefundMap) => void;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col gap-4 ${className ?? ""}`}>
      <div>
        <h3 className="font-headline text-base font-semibold text-on-surface">Cancellation &amp; refund policy</h3>
        <p className="mt-1 text-sm text-muted">
          How much a customer is refunded based on how far ahead they cancel. They get the best tier they qualify for.
          Cancellations within {NO_CANCEL_WITHIN_HOURS} hours of the appointment aren&apos;t allowed.
        </p>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {TIER_WINDOWS.map((w) => (
          <div key={w.hoursBefore} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <span className="text-sm text-on-surface">Cancel {w.label}</span>
            <Select
              className="w-40 shrink-0"
              value={String(refunds[w.hoursBefore] ?? 0)}
              onValueChange={(v) => onChange({ ...refunds, [w.hoursBefore]: Number(v) })}
              options={REFUND_OPTIONS}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
