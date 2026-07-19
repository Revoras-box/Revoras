import type { VerificationStatus } from "@/lib/types";

export interface VerificationStatusMeta {
  label: string;
  tone: "neutral" | "primary" | "success" | "warning" | "danger";
  blurb: string;
}

/**
 * The one place a verification status becomes user-facing copy. Shared by the
 * Verification Center and the dashboard status card so they can't drift.
 */
export const VERIFICATION_STATUS_META: Record<VerificationStatus, VerificationStatusMeta> = {
  draft: { label: "Draft", tone: "neutral", blurb: "Attach your documents and submit them for review." },
  submitted: { label: "Submitted", tone: "primary", blurb: "Your request is in the queue — an admin will review it shortly." },
  under_review: { label: "Under review", tone: "primary", blurb: "An admin is reviewing your request right now." },
  more_info: { label: "More info needed", tone: "warning", blurb: "The reviewer needs more from you before deciding." },
  approved: { label: "Verified", tone: "success", blurb: "Your business is verified. The Verified badge now shows on your listing." },
  rejected: { label: "Rejected", tone: "danger", blurb: "This request was rejected. You can start a new one after addressing the reason below." },
  suspended: { label: "Suspended", tone: "danger", blurb: "Your verification was suspended. Contact support or re-apply." },
};
