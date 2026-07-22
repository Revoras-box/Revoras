"use client";

import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

/**
 * Verification is optional at onboarding time - `documents` is not a required
 * step in onboarding.service.js STEP_DEFS, so nothing here blocks submission.
 * Upload itself now exists (Phase 1.4b, /business/verification), so this step's
 * job is to explain the badge and hand off, not to collect files: making an
 * owner gather documents mid-wizard is what makes people abandon signup.
 */
export function StepVerification({ goNext, goPrev, exit, saving }: WizardStepProps) {
  return (
    <div>
      <StepHeader
        eyebrow="Step 8 of 10"
        title="Verification"
        description="Get the verified badge that helps customers trust you. This is optional — you can finish signing up now and add your documents whenever you're ready."
      />

      <div className="max-w-2xl">
        <Card className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-base font-semibold text-on-surface">Verification documents</h3>
              <Badge tone="neutral">
                <BadgeCheck size={12} /> Optional
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              After you finish signing up, head to{" "}
              <Link href="/business/verification" className="font-medium text-primary hover:underline">
                Verification
              </Link>{" "}
              to upload your shop licence, GST certificate, ID and address proof. Our team reviews them and your badge
              goes live once approved.
            </p>
          </div>
        </Card>
      </div>

      <WizardFooter onPrev={goPrev} onNext={() => goNext()} onExit={exit} nextLoading={saving} />
    </div>
  );
}
