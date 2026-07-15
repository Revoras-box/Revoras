"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useMembers, useAddMember } from "@/lib/business/hooks/useMembers";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

export function StepTeam({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: members, isLoading } = useMembers(studioId);
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <StepHeader
        eyebrow="Step 4 of 9"
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

      {adding ? <AddMemberModal studioId={studioId} onClose={() => setAdding(false)} /> : null}

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

function AddMemberModal({ studioId, onClose }: { studioId: string; onClose: () => void }) {
  const addMember = useAddMember(studioId);
  const [form, setForm] = useState({ email: "", roleKey: "staff", designation: "", providesServices: true });

  const handleSubmit = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }
    addMember.mutate(
      {
        email: form.email.trim(),
        roleKey: form.roleKey as "owner" | "staff",
        designation: form.designation.trim() || undefined,
        providesServices: form.providesServices,
        specialties: [],
      },
      {
        onSuccess: () => {
          toast.success("Team member added");
          onClose();
        },
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't add member"),
      }
    );
  };

  return (
    <Modal
      open
      onOpenChange={(open) => !open && onClose()}
      title="Add team member"
      description="Links an existing Revoras account to your business — they must already have signed up with this email."
      footer={
        <>
          <Button intent="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={addMember.isPending}>
            <UserPlus size={16} /> Add member
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="professional@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <Select
          label="Role"
          value={form.roleKey}
          onValueChange={(v) => setForm((f) => ({ ...f, roleKey: v }))}
          options={[
            { value: "staff", label: "Staff" },
            { value: "owner", label: "Owner" },
          ]}
        />
        <Input label="Designation" placeholder="e.g. Senior Stylist" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} />
        <Switch label="Provides services" description="Can be booked by customers" checked={form.providesServices} onCheckedChange={(v) => setForm((f) => ({ ...f, providesServices: v }))} />
      </div>
    </Modal>
  );
}
