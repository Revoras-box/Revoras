"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useBusinessAuth } from "@/lib/business/auth";
import { useOnboarding } from "@/lib/business/hooks/useOnboarding";

/**
 * Phase 1.5a - Host Dashboard Gate. A business only reaches the real dashboard
 * once it is ACTIVE. For every pre-launch status (draft, onboarding,
 * payment_pending, pending_review, under_review) we replace the dashboard with
 * a focused "continue / status" card instead. Discovery protection lives on the
 * backend; this is purely the owner-facing gate.
 */

// Statuses that must NOT see the normal dashboard. Anything else (active,
// suspended, inactive, rejected) falls through to the existing dashboard, which
// owns its own messaging for those.
const GATED: Record<string, { icon: typeof Rocket; title: string; body: string; cta: string }> = {
  draft: {
    icon: Rocket,
    title: "Finish setting up your business",
    body: "You're just a few steps away from going live on Revoras. Pick up where you left off.",
    cta: "Continue onboarding",
  },
  onboarding: {
    icon: Rocket,
    title: "Continue onboarding",
    body: "Complete your profile so customers can find and book you. Your progress is saved automatically.",
    cta: "Continue onboarding",
  },
  payment_pending: {
    icon: Sparkles,
    title: "One last step: pay & submit",
    body: "Your business is set up — pay the ₹99/month subscription to submit it for review.",
    cta: "Pay & submit",
  },
  pending_review: {
    icon: Clock,
    title: "Submitted for review",
    body: "Our team is reviewing your business. You'll be notified as soon as it's approved and live.",
    cta: "View onboarding",
  },
  under_review: {
    icon: Clock,
    title: "Review in progress",
    body: "Our team is taking a closer look at your business. Hang tight — this usually doesn't take long.",
    cta: "View onboarding",
  },
};

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;
  const { data, isLoading, isError } = useOnboarding(studioId);

  // Fail open: if we can't read onboarding state, don't lock the owner out of
  // their dashboard over a transient error.
  if (!studioId || isError) return <>{children}</>;

  if (isLoading || !data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const gate = GATED[data.businessStatus];
  if (!gate) return <>{children}</>;

  const Icon = gate.icon;
  const percent = data.completionPercent;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-floating sm:p-10">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon size={28} />
        </div>

        {activeMembership?.businessName ? (
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-muted">{activeMembership.businessName}</p>
        ) : null}
        <h1 className="font-headline text-2xl font-semibold text-on-surface">{gate.title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">{gate.body}</p>

        {(data.businessStatus === "draft" || data.businessStatus === "onboarding") && (
          <div className="mt-7">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-on-surface">{percent}% complete</span>
              <span className="text-muted">
                {data.steps.filter((s) => s.complete).length} of {data.steps.length} steps
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => router.push("/business/onboarding")}>
            {gate.cta}
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
