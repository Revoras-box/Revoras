"use client";

import { Check, CircleAlert, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useBusinessProfile } from "@/lib/business/hooks/useSettings";
import { useServices } from "@/lib/business/hooks/useServices";
import { useMembers } from "@/lib/business/hooks/useMembers";
import { useGallery } from "@/lib/business/hooks/useOnboarding";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

export function StepReview({ studioId, state, goNext, goPrev, jumpTo, exit, saving }: WizardStepProps) {
  const { data: business } = useBusinessProfile(studioId);
  const { data: services } = useServices(studioId, false);
  const { data: members } = useMembers(studioId);
  const { data: gallery } = useGallery(studioId);

  const activeServices = (services || []).filter((s) => s.is_active);
  const rows: { label: string; value: string; done: boolean; stepIndex: number }[] = [
    { label: "Business", value: business?.name ? `${business.name}${business.city ? ` · ${business.city}` : ""}` : "Not set", done: !!(business?.name && business?.address && business?.category_id), stepIndex: 0 },
    { label: "Information", value: business?.description ? "Profile details added" : "No description yet", done: !!business?.description, stepIndex: 1 },
    { label: "Services", value: `${activeServices.length} service${activeServices.length === 1 ? "" : "s"}`, done: activeServices.length > 0, stepIndex: 2 },
    { label: "Professionals", value: `${(members || []).length} member${(members || []).length === 1 ? "" : "s"}`, done: (members || []).length > 0, stepIndex: 3 },
    { label: "Gallery", value: `${(gallery || []).length} photo${(gallery || []).length === 1 ? "" : "s"}`, done: (gallery || []).length > 0, stepIndex: 4 },
    { label: "Hours", value: "Set from Business hours", done: true, stepIndex: 5 },
  ];

  const percent = state.completionPercent;

  return (
    <div>
      <StepHeader
        eyebrow="Step 9 of 10"
        title="Review your business"
        description="Here's everything customers will see. Fix anything that isn't right before you submit."
      />

      <div className="flex max-w-2xl flex-col gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">Profile completion</div>
            <div className="font-headline text-3xl font-semibold text-on-surface">{percent}%</div>
          </div>
          <div className="w-40">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
            {state.missing.length > 0 ? (
              <p className="mt-2 text-right text-xs text-error">Missing: {state.missing.join(", ")}</p>
            ) : (
              <p className="mt-2 text-right text-xs text-primary">Ready to submit</p>
            )}
          </div>
        </Card>

        <Card className="flex flex-col divide-y divide-border p-0">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 px-4 py-3.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  r.done ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-container text-on-surface"
                }`}
              >
                {r.done ? <Check size={14} /> : <CircleAlert size={14} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-on-surface">{r.label}</div>
                <div className="truncate text-xs text-muted">{r.value}</div>
              </div>
              <button
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                onClick={() => jumpTo(r.stepIndex)}
              >
                <Pencil size={12} /> Edit
              </button>
            </div>
          ))}
        </Card>

        {business?.policies && Object.values(business.policies).some((v) => v && v.trim()) ? (
          <Card className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-base font-semibold text-on-surface">Policies</h3>
              <Badge tone="neutral">Added</Badge>
            </div>
            <p className="text-sm text-muted">Cancellation, rescheduling and refund policies are set.</p>
          </Card>
        ) : null}
      </div>

      <WizardFooter onPrev={goPrev} onNext={() => goNext()} onExit={exit} nextLoading={saving} nextLabel="Continue to subscription" />
    </div>
  );
}
