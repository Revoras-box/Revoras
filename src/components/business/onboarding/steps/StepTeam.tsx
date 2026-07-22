"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMembers } from "@/lib/business/hooks/useMembers";
import { InviteMemberModal } from "@/components/business/InviteMemberModal";
import { PendingInvites } from "@/components/business/PendingInvites";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

export function StepTeam({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: members, isLoading } = useMembers(studioId);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <StepHeader
        eyebrow="Step 5 of 10"
        title="Your team"
        description="You're already listed as the owner. Add the professionals customers can book — or invite them later."
      />

      <div className="max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">{(members || []).length} member{(members || []).length === 1 ? "" : "s"}</p>
          <Button intent="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add member
          </Button>
        </div>

        {/* Without this, inviting someone during onboarding looks like nothing
            happened — they aren't a member yet, so the count above stays put. */}
        <PendingInvites studioId={studioId} />

        {isLoading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : (
          <div className="flex flex-col gap-3">
            {(members || []).map((m) => (
              <Card key={m.id} padding="sm" className="flex items-center gap-3">
                <Avatar name={m.name} src={m.image_url} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-on-surface">{m.name}</div>
                  {m.designation ? <div className="text-xs text-muted">{m.designation}</div> : null}
                </div>
                <Badge tone={m.role === "owner" ? "primary" : "neutral"}>{m.role}</Badge>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Same invite modal as the dashboard's Professionals page. It previously
          had its own copy that could only link an existing Revoras account,
          which dead-ended here during signup - the point at which an owner is
          least likely to be adding people who are already on the platform. */}
      <InviteMemberModal studioId={studioId} open={adding} onOpenChange={setAdding} />

      <WizardFooter
        onPrev={goPrev}
        onNext={() => goNext()}
        onExit={exit}
        nextLoading={saving}
        hint="Team members are optional — you can invite them any time from your dashboard."
      />
    </div>
  );
}
