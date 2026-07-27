"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { TimeSelect } from "@/components/ui/TimeSelect";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  useMemberSchedule,
  useUpdateMemberSchedule,
  type MemberScheduleDay,
  type WorkingHoursDay,
} from "@/lib/business/hooks/useSettings";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const hhmm = (t?: string | null) => t?.slice(0, 5) || "";

/**
 * Seed the editor when a member is switching off "follows shop hours" for the
 * first time: start them on the shop's own schedule rather than an empty week,
 * so the common tweak ("same as the shop, but Ravi leaves at 2 on Fridays") is
 * a single edit instead of seven.
 */
const seedFromBusinessHours = (businessHours: WorkingHoursDay[]): MemberScheduleDay[] =>
  Array.from({ length: 7 }, (_, dayOfWeek) => {
    const shop = businessHours.find((h) => h.dayOfWeek === dayOfWeek);
    if (!shop || shop.isClosed) return { dayOfWeek, startTime: null, endTime: null, isOff: true };
    return { dayOfWeek, startTime: hhmm(shop.openTime), endTime: hhmm(shop.closeTime), isOff: false };
  });

const mergeStoredDays = (stored: MemberScheduleDay[], businessHours: WorkingHoursDay[]): MemberScheduleDay[] =>
  Array.from({ length: 7 }, (_, dayOfWeek) => {
    const row = stored.find((d) => d.dayOfWeek === dayOfWeek);
    // A weekday with no stored row is a day off - the same rule the backend
    // applies once a member is on a rota.
    if (!row) return { dayOfWeek, startTime: null, endTime: null, isOff: true };
    return { ...row, startTime: hhmm(row.startTime), endTime: hhmm(row.endTime) };
  });

interface Props {
  studioId: string | undefined;
  memberId: string | undefined;
  memberName?: string;
  canManage: boolean;
}

/**
 * A professional's weekly rota.
 *
 * Availability is per-member: two barbers at one shop can work different days
 * and hours, and a customer only ever sees the slots of the person they picked.
 * A member left on "follows business hours" inherits the shop's schedule and
 * keeps tracking it when the owner changes opening times.
 */
export function MemberScheduleEditor({ studioId, memberId, memberName, canManage }: Props) {
  const { data, isLoading, isError, refetch } = useMemberSchedule(studioId, memberId);
  const updateSchedule = useUpdateMemberSchedule(studioId, memberId);

  const [followsShop, setFollowsShop] = useState(true);
  const [days, setDays] = useState<MemberScheduleDay[]>([]);

  useEffect(() => {
    if (!data) return;
    setFollowsShop(data.followsBusinessHours);
    setDays(
      data.followsBusinessHours
        ? seedFromBusinessHours(data.businessHours)
        : mergeStoredDays(data.days, data.businessHours)
    );
  }, [data]);

  if (isLoading) return <Skeleton className="h-72 rounded-2xl" />;
  if (isError || !data)
    return <ErrorState onRetry={() => refetch()} description="Couldn't load this professional's schedule." />;

  const businessByDay = new Map(data.businessHours.map((h) => [h.dayOfWeek, h]));

  const updateDay = (dayOfWeek: number, patch: Partial<MemberScheduleDay>) =>
    setDays((prev) => prev.map((d) => (d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d)));

  const toggleFollowsShop = (on: boolean) => {
    setFollowsShop(on);
    if (on) setDays(seedFromBusinessHours(data.businessHours));
  };

  const save = () => {
    if (followsShop) {
      updateSchedule.mutate(
        { followsBusinessHours: true },
        {
          onSuccess: () => toast.success(`${memberName || "This professional"} now follows business hours`),
          onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update schedule"),
        }
      );
      return;
    }

    if (days.every((d) => d.isOff)) {
      toast.error("Set at least one working day, or switch back to business hours");
      return;
    }

    updateSchedule.mutate(
      { followsBusinessHours: false, days },
      {
        onSuccess: () => toast.success("Schedule updated"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update schedule"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={followsShop}
        onCheckedChange={canManage ? toggleFollowsShop : () => {}}
        label="Follows business hours"
        description="This professional is bookable whenever the shop is open. Turn this off to give them their own days and hours."
      />

      {!followsShop ? (
        <div className="flex flex-col gap-1 rounded-xl border border-border p-3">
          {days.map((day) => {
            const shop = businessByDay.get(day.dayOfWeek);
            const shopClosed = !shop || shop.isClosed;

            return (
              <div key={day.dayOfWeek} className="flex flex-wrap items-center gap-2 border-b border-border py-2 last:border-0">
                <span className="w-24 shrink-0 text-sm font-medium text-on-surface">{DAY_LABELS[day.dayOfWeek]}</span>

                {shopClosed ? (
                  // Nobody can be booked on a day the shop is shut, so there is
                  // nothing to configure here.
                  <span className="text-sm text-muted">Business closed</span>
                ) : (
                  <>
                    <Switch
                      checked={!day.isOff}
                      disabled={!canManage}
                      onCheckedChange={(working) =>
                        updateDay(day.dayOfWeek, {
                          isOff: !working,
                          startTime: working ? day.startTime || hhmm(shop.openTime) : null,
                          endTime: working ? day.endTime || hhmm(shop.closeTime) : null,
                        })
                      }
                    />
                    {day.isOff ? (
                      <span className="text-sm text-muted">Day off</span>
                    ) : (
                      <>
                        <TimeSelect
                          className="w-28"
                          disabled={!canManage}
                          value={day.startTime || ""}
                          onChange={(v) => updateDay(day.dayOfWeek, { startTime: v })}
                        />
                        <span className="text-sm text-muted">to</span>
                        <TimeSelect
                          className="w-28"
                          disabled={!canManage}
                          value={day.endTime || ""}
                          onChange={(v) => updateDay(day.dayOfWeek, { endTime: v })}
                        />
                        <span className="text-xs text-muted">
                          shop {hhmm(shop.openTime)}–{hhmm(shop.closeTime)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {canManage ? (
        <div>
          <Button loading={updateSchedule.isPending} onClick={save}>
            Save schedule
          </Button>
        </div>
      ) : null}
    </div>
  );
}
