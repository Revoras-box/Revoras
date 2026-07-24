import type { CancellationPolicy } from "./hooks/useSettings";

// The refund schedule the owner configures: how far ahead a customer cancels →
// how much they get back. The customer earns the best tier they clear. Windows
// are fixed; only the percentages are chosen. Cancellations inside
// NO_CANCEL_WITHIN_HOURS of the appointment aren't allowed at all.
// Shared by the onboarding "Business information" step and the dashboard
// Settings page so the two editors stay identical.
export const TIER_WINDOWS = [
  { hoursBefore: 72, label: "3 days or more before" },
  { hoursBefore: 48, label: "2 days before" },
  { hoursBefore: 24, label: "24 hours before" },
  { hoursBefore: 12, label: "12 hours before" },
  { hoursBefore: 6, label: "6 hours before" },
];

export const REFUND_OPTIONS = [100, 75, 50, 25, 0].map((n) => ({ value: String(n), label: `${n}% refund` }));

export const DEFAULT_REFUNDS: Record<number, number> = { 72: 100, 48: 75, 24: 50, 12: 25, 6: 0 };

export const NO_CANCEL_WITHIN_HOURS = 2;

export type RefundMap = Record<number, number>;

// Stored policy (its `tiers`) → the refunds map the editor renders. Any window
// the stored policy doesn't cover keeps its default (also handles legacy,
// non-tiered rows, which just fall back to defaults entirely).
export function refundsFromPolicy(policy?: CancellationPolicy | null): RefundMap {
  const map = { ...DEFAULT_REFUNDS };
  policy?.tiers?.forEach((t) => {
    if (t.hoursBefore in map) map[t.hoursBefore] = t.refundPercent;
  });
  return map;
}

// The editor's refunds map → the `cancellationPolicy` payload the API expects.
export function policyFromRefunds(refunds: RefundMap): CancellationPolicy {
  return {
    tiers: TIER_WINDOWS.map((w) => ({ hoursBefore: w.hoursBefore, refundPercent: refunds[w.hoursBefore] ?? 0 })),
    noCancelWithinHours: NO_CANCEL_WITHIN_HOURS,
  };
}
