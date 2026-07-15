"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useWorkingHours, useUpdateWorkingHours, type WorkingHoursDay } from "@/lib/business/hooks/useSettings";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function StepHours({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data, isLoading } = useWorkingHours(studioId);
  const updateHours = useUpdateWorkingHours(studioId);
  const [days, setDays] = useState<WorkingHoursDay[]>([]);

  useEffect(() => {
    if (data) setDays(data);
  }, [data]);

  const updateDay = (dayOfWeek: number, patch: Partial<WorkingHoursDay>) =>
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));

  // Save hours (if edited) then advance. Hours aren't required to submit, but we
  // persist whatever the owner set here.
  const handleNext = () => {
    if (days.length === 0) {
      goNext();
      return;
    }
    updateHours.mutate(days, {
      onSuccess: () => goNext(),
      onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't save hours"),
    });
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 6 of 9"
        title="Business hours"
        description="When are you open? Customers can only book within these hours."
      />

      {isLoading || days.length === 0 ? (
        <Skeleton className="h-96 max-w-2xl rounded-2xl" />
      ) : (
        <Card className="flex max-w-2xl flex-col gap-3">
          {days
            .slice()
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((day) => (
              <div key={day.dayOfWeek} className="flex items-center gap-4 border-b border-border py-2 last:border-0">
                <span className="w-24 shrink-0 text-sm font-medium text-on-surface sm:w-28">{DAY_LABELS[day.dayOfWeek]}</span>
                <Switch
                  checked={!day.isClosed}
                  onCheckedChange={(open) =>
                    updateDay(day.dayOfWeek, { isClosed: !open, openTime: day.openTime || "09:00", closeTime: day.closeTime || "18:00" })
                  }
                />
                {!day.isClosed ? (
                  <div className="flex items-center gap-2">
                    <Input type="time" className="w-28" value={day.openTime?.slice(0, 5) || ""} onChange={(e) => updateDay(day.dayOfWeek, { openTime: e.target.value })} />
                    <span className="text-sm text-muted">to</span>
                    <Input type="time" className="w-28" value={day.closeTime?.slice(0, 5) || ""} onChange={(e) => updateDay(day.dayOfWeek, { closeTime: e.target.value })} />
                  </div>
                ) : (
                  <span className="text-sm text-muted">Closed</span>
                )}
              </div>
            ))}
        </Card>
      )}

      <WizardFooter onPrev={goPrev} onNext={handleNext} onExit={exit} nextLoading={saving || updateHours.isPending} />
    </div>
  );
}
