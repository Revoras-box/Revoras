"use client";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  CUTOFF_OPTIONS,
  MAX_RESCHEDULE_OPTIONS,
  type ReschedulePolicy,
} from "@/lib/business/reschedule-policy";

/**
 * The Reschedule Protection terms editor. Shared by the onboarding "Business
 * information" step and the dashboard Settings page so both look and behave
 * identically. Controlled — the parent owns the policy object.
 *
 * The three settings are exactly what the engine enforces, so there's nothing
 * here an owner can configure that the booking flow won't honour.
 */
export function ReschedulePolicyEditor({
  policy,
  onChange,
  className,
}: {
  policy: ReschedulePolicy;
  onChange: (next: ReschedulePolicy) => void;
  className?: string;
}) {
  const set = <K extends keyof ReschedulePolicy>(key: K, value: ReschedulePolicy[K]) =>
    onChange({ ...policy, [key]: value });

  return (
    <Card className={`flex flex-col gap-4 ${className ?? ""}`}>
      <div>
        <h3 className="font-headline text-base font-semibold text-on-surface">Reschedule protection</h3>
        <p className="mt-1 text-sm text-muted">
          An optional paid add-on at checkout. Customers who take it can move their appointment themselves up to your
          cutoff — the old slot frees up automatically and you&apos;re notified. Customers who don&apos;t take it
          can&apos;t reschedule online.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={policy.enabled}
          onChange={(e) => set("enabled", e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-on-surface">Offer reschedule protection at checkout</span>
          <span className="block text-xs text-muted">
            Turn this off and no new booking is offered it. Bookings that already paid for it keep what they bought.
          </span>
        </span>
      </label>

      {/* Only meaningful while the add-on is on — hidden rather than disabled, so
          the card doesn't present three dead controls. */}
      {policy.enabled ? (
        <div className="flex flex-col gap-4 border-t border-border pt-4">
          <Input
            label="Price (₹)"
            type="number"
            min={0}
            step={1}
            value={String(policy.feeAmount)}
            onChange={(e) => {
              // An empty field parses as NaN; treat it as 0 so the input stays
              // editable and the payload stays valid while they retype.
              const next = Number(e.target.value);
              set("feeAmount", Number.isFinite(next) ? Math.max(0, next) : 0);
            }}
            hint="What you charge for the option. Added to the customer's total when they tick it."
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Rescheduling closes</label>
            <Select
              value={String(policy.cutoffHours)}
              onValueChange={(v) => set("cutoffHours", Number(v))}
              options={CUTOFF_OPTIONS}
            />
            <p className="mt-1.5 text-xs text-muted">
              After this point nobody can move the booking online, so you&apos;re never left with a last-minute gap.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface">Moves included</label>
            <Select
              value={String(policy.maxReschedules)}
              onValueChange={(v) => set("maxReschedules", Number(v))}
              options={MAX_RESCHEDULE_OPTIONS}
            />
            <p className="mt-1.5 text-xs text-muted">How many times one purchase lets the customer move the booking.</p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
