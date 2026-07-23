"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { TimeSelect } from "@/components/ui/TimeSelect";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useWorkingHours, useUpdateWorkingHours, type WorkingHoursDay } from "@/lib/business/hooks/useSettings";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const hhmm = (t?: string | null) => t?.slice(0, 5) || "";
// Every open day shares one open+close time — the signal for "same for all".
const isUniform = (list: WorkingHoursDay[]) => {
  const open = list.filter((d) => !d.isClosed);
  return open.length > 1 && open.every((d) => hhmm(d.openTime) === hhmm(open[0].openTime) && hhmm(d.closeTime) === hhmm(open[0].closeTime));
};

export function StepHours({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data, isLoading } = useWorkingHours(studioId);
  const updateHours = useUpdateWorkingHours(studioId);
  const [days, setDays] = useState<WorkingHoursDay[]>([]);
  // When on, one control drives every open day and the per-day pickers lock.
  const [sameForAll, setSameForAll] = useState(false);

  useEffect(() => {
    if (data) {
      setDays(data);
      setSameForAll(isUniform(data));
    }
  }, [data]);

  const updateDay = (dayOfWeek: number, patch: Partial<WorkingHoursDay>) =>
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));

  // The shared time is just whatever the first open day holds (they're kept in
  // sync while `sameForAll` is on).
  const openDays = days.filter((d) => !d.isClosed);
  const masterOpen = hhmm(openDays[0]?.openTime) || "09:00";
  const masterClose = hhmm(openDays[0]?.closeTime) || "18:00";

  const setAllTimes = (patch: Partial<WorkingHoursDay>) =>
    setDays((prev) => prev.map((d) => (d.isClosed ? d : { ...d, ...patch })));

  const toggleSameForAll = (on: boolean) => {
    setSameForAll(on);
    // Turning it on collapses every open day onto the current shared time.
    if (on) setAllTimes({ openTime: masterOpen, closeTime: masterClose });
  };

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
        eyebrow="Step 7 of 10"
        title="Business hours"
        description="When are you open? Customers can only book within these hours."
      />

      {isLoading || days.length === 0 ? (
        <Skeleton className="h-96 max-w-2xl rounded-2xl" />
      ) : (
        <Card className="flex max-w-2xl flex-col gap-3">
          <div className="flex flex-col gap-3 border-b border-border pb-3">
            <Checkbox
              checked={sameForAll}
              onCheckedChange={toggleSameForAll}
              label="Use the same hours for every open day"
              description="Set one open and close time that applies to all days you're open. Turn this off to set each day individually."
            />
            {sameForAll ? (
              <div className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-sm font-medium text-on-surface sm:w-28">All open days</span>
                <TimeSelect className="w-32" value={masterOpen} onChange={(v) => setAllTimes({ openTime: v })} />
                <span className="text-sm text-muted">to</span>
                <TimeSelect className="w-32" value={masterClose} onChange={(v) => setAllTimes({ closeTime: v })} />
              </div>
            ) : null}
          </div>

          {days
            .slice()
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((day) => (
              <div key={day.dayOfWeek} className="flex items-center gap-4 border-b border-border py-2 last:border-0">
                <span className="w-24 shrink-0 text-sm font-medium text-on-surface sm:w-28">{DAY_LABELS[day.dayOfWeek]}</span>
                <Switch
                  checked={!day.isClosed}
                  onCheckedChange={(open) =>
                    updateDay(day.dayOfWeek, {
                      isClosed: !open,
                      // A day opened while "same for all" is on adopts the shared time.
                      openTime: sameForAll ? masterOpen : day.openTime || "09:00",
                      closeTime: sameForAll ? masterClose : day.closeTime || "18:00",
                    })
                  }
                />
                {!day.isClosed ? (
                  <div className="flex items-center gap-2">
                    {/* Locked while "same for all" is on — the shared control above drives them. */}
                    <TimeSelect className="w-32" disabled={sameForAll} value={day.openTime || ""} onChange={(v) => updateDay(day.dayOfWeek, { openTime: v })} />
                    <span className="text-sm text-muted">to</span>
                    <TimeSelect className="w-32" disabled={sameForAll} value={day.closeTime || ""} onChange={(v) => updateDay(day.dayOfWeek, { closeTime: v })} />
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
