"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

/**
 * Placeholder step. Document upload / review is built in Phase 1.5c and is not
 * required to submit in 1.5a (see onboarding.service.js STEP_DEFS: documents is
 * not a required step). We surface it so the flow is complete end to end.
 */
export function StepVerification({ goNext, goPrev, exit, saving }: WizardStepProps) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 7 of 9"
        title="Verification"
        description="Get the verified badge that helps customers trust you. Document upload is coming soon — nothing is needed from you right now."
      />

      <div className="max-w-2xl">
        <Card className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-base font-semibold text-on-surface">Verification documents</h3>
              <Badge tone="success">
                <BadgeCheck size={12} /> Ready
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              You&apos;ll be able to upload your business documents (registration, ID, address proof) here in an upcoming
              update. You can submit your business without them for now.
            </p>
          </div>
        </Card>
      </div>

      <WizardFooter onPrev={goPrev} onNext={() => goNext()} onExit={exit} nextLoading={saving} />
    </div>
  );
}
