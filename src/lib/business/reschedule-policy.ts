/**
 * The owner's Reschedule Protection terms — the paid add-on a customer can buy at
 * checkout to be able to move their appointment later.
 *
 * Mirrors cancellation-policy.ts: the shared shape and conversions used by both
 * the onboarding step and the dashboard Settings page, so the two editors can't
 * drift. The server's reschedulePolicy.service.js applies the same defaults, so a
 * business that never touches this still offers a working add-on.
 */
export interface ReschedulePolicy {
  enabled: boolean;
  feeAmount: number;
  cutoffHours: number;
  maxReschedules: number;
}

export const DEFAULT_RESCHEDULE_POLICY: ReschedulePolicy = {
  enabled: true,
  feeAmount: 2,
  cutoffHours: 2,
  maxReschedules: 1,
};

// Fixed choices rather than a free-text hours box: these are the windows that
// make sense operationally, and they keep the customer-facing copy readable
// ("up to 2 hours before it starts").
export const CUTOFF_OPTIONS = [
  { value: "1", label: "1 hour before" },
  { value: "2", label: "2 hours before" },
  { value: "4", label: "4 hours before" },
  { value: "6", label: "6 hours before" },
  { value: "12", label: "12 hours before" },
  { value: "24", label: "24 hours before" },
  { value: "48", label: "2 days before" },
];

export const MAX_RESCHEDULE_OPTIONS = [1, 2, 3].map((n) => ({
  value: String(n),
  label: n === 1 ? "1 reschedule" : `${n} reschedules`,
}));

/**
 * Stored policy → the editor's shape. Every field falls back independently so a
 * partial or missing row still renders a complete, valid form rather than NaN in
 * a number input.
 */
export function reschedulePolicyFrom(policy?: Partial<ReschedulePolicy> | null): ReschedulePolicy {
  const num = (value: unknown, fallback: number, min: number) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= min ? n : fallback;
  };

  return {
    // Only an explicit false disables it, matching the server's normalizer.
    enabled: policy?.enabled !== false,
    feeAmount: num(policy?.feeAmount, DEFAULT_RESCHEDULE_POLICY.feeAmount, 0),
    cutoffHours: num(policy?.cutoffHours, DEFAULT_RESCHEDULE_POLICY.cutoffHours, 0),
    maxReschedules: Math.max(1, Math.round(num(policy?.maxReschedules, DEFAULT_RESCHEDULE_POLICY.maxReschedules, 1))),
  };
}

/** The editor's shape → the `reschedulePolicy` payload the API expects. */
export function reschedulePolicyPayload(policy: ReschedulePolicy): ReschedulePolicy {
  return {
    enabled: policy.enabled,
    // A blank or nonsense fee field must not be sent as NaN, which would fail
    // validation and lose the owner's other edits along with it.
    feeAmount: Number.isFinite(policy.feeAmount) ? Math.max(0, policy.feeAmount) : DEFAULT_RESCHEDULE_POLICY.feeAmount,
    cutoffHours: policy.cutoffHours,
    maxReschedules: policy.maxReschedules,
  };
}
