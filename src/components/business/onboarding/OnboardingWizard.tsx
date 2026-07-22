"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, PartyPopper } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useBusinessAuth } from "@/lib/business/auth";
import { useOnboarding, useSaveOnboardingStep } from "@/lib/business/hooks/useOnboarding";
import { StepBasics } from "./steps/StepBasics";
import { StepLocation } from "./steps/StepLocation";
import { StepInformation } from "./steps/StepInformation";
import { StepServices } from "./steps/StepServices";
import { StepTeam } from "./steps/StepTeam";
import { StepGallery } from "./steps/StepGallery";
import { StepHours } from "./steps/StepHours";
import { StepVerification } from "./steps/StepVerification";
import { StepReview } from "./steps/StepReview";
import { StepSubscription } from "./steps/StepSubscription";
import type { WizardStepProps } from "./types";

// Order MUST match STEP_DEFS in the backend onboarding.service.js - the wizard
// resumes off the backend's step index, so a mismatch would land owners on the
// wrong screen. StepLocation is index 1 (Phase 4A), right after Basics.
const STEP_COMPONENTS: React.ComponentType<WizardStepProps>[] = [
  StepBasics,
  StepLocation,
  StepInformation,
  StepServices,
  StepTeam,
  StepGallery,
  StepHours,
  StepVerification,
  StepReview,
  StepSubscription,
];

// Statuses that mean payment already succeeded - the editable wizard is done.
// PAYMENT_PENDING is deliberately NOT here: the business was submitted but the
// ₹99 payment hasn't been captured yet, so the owner needs to land back on the
// Subscription step to finish it, not a static "you're done" screen.
const SUBMITTED = ["pending_review", "under_review"];

export function OnboardingWizard() {
  const router = useRouter();
  const { activeMembership } = useBusinessAuth();
  const studioId = activeMembership?.studioId;

  const { data: state, isLoading } = useOnboarding(studioId);
  const saveStep = useSaveOnboardingStep(studioId);

  const [active, setActive] = useState(0);
  const initialized = useRef(false);

  // Resume: seed the active step from the backend cursor once, then let local
  // navigation take over (so a background refetch doesn't yank the user around).
  // A business already awaiting payment always resumes at the last (Subscription)
  // step regardless of the stored cursor - it's the only step left to act on.
  useEffect(() => {
    if (state && !initialized.current) {
      const resumeStep =
        state.businessStatus === "payment_pending"
          ? STEP_COMPONENTS.length - 1
          : Math.min(Math.max(state.currentStep ?? 0, 0), STEP_COMPONENTS.length - 1);
      setActive(resumeStep);
      initialized.current = true;
    }
  }, [state]);

  // An already-live business shouldn't be in the wizard at all.
  useEffect(() => {
    if (state?.businessStatus === "active") router.replace("/business");
  }, [state?.businessStatus, router]);

  if (!studioId) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <p className="text-sm text-muted">No business found for your account.</p>
      </div>
    );
  }

  if (isLoading || !state) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (SUBMITTED.includes(state.businessStatus)) {
    return <SubmittedScreen onDashboard={() => router.push("/business")} />;
  }

  const lastIndex = STEP_COMPONENTS.length - 1;

  const persist = (index: number, data?: Record<string, unknown>) =>
    saveStep.mutateAsync({ step: index, data });

  const goNext = async (data?: Record<string, unknown>) => {
    const next = Math.min(active + 1, lastIndex);
    try {
      await persist(next, data);
      setActive(next);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save your progress");
    }
  };

  const goPrev = () => {
    const prev = Math.max(active - 1, 0);
    setActive(prev);
    persist(prev).catch(() => {});
  };

  const jumpTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), lastIndex);
    setActive(clamped);
    persist(clamped).catch(() => {});
  };

  const exit = () => router.push("/business");

  const StepComponent = STEP_COMPONENTS[active];
  const stepProps: WizardStepProps = {
    studioId,
    state,
    goNext,
    goPrev,
    jumpTo,
    exit,
    saving: saveStep.isPending,
  };

  const positionPercent = Math.round(((active + 1) / STEP_COMPONENTS.length) * 100);

  return (
    <div className="min-h-dvh bg-background">
      {/* Top progress bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-on-surface">Business setup</span>
              <span className="text-muted">
                Step {active + 1} of {STEP_COMPONENTS.length} · {state.completionPercent}% complete
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${positionPercent}%` }} />
            </div>
          </div>
          <Button intent="ghost" size="sm" onClick={exit} className="hidden sm:inline-flex">
            Exit
          </Button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        {/* Desktop stepper sidebar */}
        <nav className="hidden w-56 shrink-0 lg:block">
          <ol className="sticky top-24 flex flex-col gap-1">
            {state.steps.map((s) => {
              const isActive = s.index === active;
              const isDone = s.complete;
              return (
                <li key={s.key}>
                  <button
                    onClick={() => jumpTo(s.index)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? "bg-primary/10 font-medium text-primary" : "text-muted hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                        isDone
                          ? "border-primary bg-primary text-on-primary"
                          : isActive
                          ? "border-primary text-primary"
                          : "border-outline-variant text-muted"
                      }`}
                    >
                      {isDone ? <Check size={11} /> : s.index + 1}
                    </span>
                    <span className="truncate">
                      {s.label}
                      {s.required ? <span className="ml-0.5 text-error">*</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Step content */}
        <main className="min-w-0 flex-1">
          <StepComponent {...stepProps} />
        </main>
      </div>
    </div>
  );
}

function SubmittedScreen({ onDashboard }: { onDashboard: () => void }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-floating sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
          <PartyPopper size={32} />
        </div>
        <h1 className="font-headline text-2xl font-semibold text-on-surface">You&apos;re all set!</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Your payment is confirmed and your business has been submitted for review. Once our team approves you,
          you&apos;ll go live on the marketplace.
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={onDashboard}>
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
