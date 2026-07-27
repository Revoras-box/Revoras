"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useMemberServices, useUpdateMemberServices } from "@/lib/business/hooks/useMemberServices";
import type { MemberServiceRow } from "@/lib/types";

interface Props {
  studioId: string | undefined;
  memberId: string | undefined;
  memberName?: string;
  canManage: boolean;
}

/** Mirror of the server's rule, so the preview updates as the owner types. */
const deriveInterval = (durations: number[]): number | null => {
  const valid = durations.filter((d) => Number.isFinite(d) && d > 0);
  if (valid.length === 0) return null;
  const shortest = Math.min(...valid);
  return Math.min(Math.max(Math.round(shortest / 5) * 5, 10), 60);
};

const previewTimes = (interval: number, from = 9 * 60, count = 4) =>
  Array.from({ length: count }, (_, i) => {
    const total = from + i * interval;
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  });

/**
 * Which of the shop's services this professional performs, and how long THEY
 * take.
 *
 * The catalogue is owned once, by the business — "Haircut" exists a single time.
 * What varies per chair is duration and (rarely) price, so that is all this
 * screen edits. The employee never sees or sets any of it.
 *
 * The scheduling interval is deliberately read-only. It is the shortest duration
 * below, rounded to the nearest 5 minutes, and showing it as a field an owner
 * could edit would invite them to set it to something the durations contradict.
 */
export function MemberServicesEditor({ studioId, memberId, memberName, canManage }: Props) {
  const { data, isLoading, isError, refetch } = useMemberServices(studioId, memberId);
  const updateServices = useUpdateMemberServices(studioId, memberId);

  const [rows, setRows] = useState<MemberServiceRow[]>([]);

  useEffect(() => {
    if (data?.services) setRows(data.services);
  }, [data]);

  const enabled = useMemo(() => rows.filter((r) => r.enabled), [rows]);
  const liveInterval = useMemo(() => deriveInterval(enabled.map((r) => Number(r.duration))), [enabled]);
  const shortest = enabled.length
    ? Math.min(...enabled.map((r) => Number(r.duration)).filter((d) => d > 0))
    : null;
  const shortestRow = enabled.find((r) => Number(r.duration) === shortest);

  if (isLoading) return <Skeleton className="h-72 rounded-2xl" />;
  if (isError || !data?.services)
    return <ErrorState onRetry={() => refetch()} description="Couldn't load this professional's services." />;

  if (rows.length === 0)
    return (
      <EmptyState
        title="No services in the catalogue yet"
        description="Add services to your business first — then choose which ones this professional performs."
      />
    );

  const patch = (serviceId: string, next: Partial<MemberServiceRow>) =>
    setRows((prev) => prev.map((r) => (r.serviceId === serviceId ? { ...r, ...next } : r)));

  const save = () => {
    const invalid = enabled.find((r) => !Number.isFinite(Number(r.duration)) || Number(r.duration) <= 0);
    if (invalid) {
      toast.error(`Enter how long ${memberName || "this professional"} takes for ${invalid.name}`);
      return;
    }

    updateServices.mutate(
      rows.map((r) => ({
        serviceId: r.serviceId,
        enabled: r.enabled,
        duration: Number(r.duration),
        price: r.price === null || r.price === undefined || String(r.price) === "" ? null : Number(r.price),
      })),
      {
        onSuccess: () => toast.success("Services updated"),
        onError: (err) => toast.error(err instanceof Error ? err.message : "Couldn't update services"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Derived, read-only. Shown next to the rows it comes from so the cause
          and the effect are on one screen. */}
      <div className="rounded-2xl border border-border bg-surface-container-low p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
            <Clock size={13} className="text-primary" /> Scheduling interval
          </span>
          <span className="font-headline text-2xl font-extrabold tabular-nums text-primary">
            {liveInterval ? `${liveInterval} min` : "—"}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {liveInterval && shortestRow ? (
            <>
              Calculated automatically from {memberName || "this professional"}&apos;s shortest service (
              {shortestRow.name}, {shortest} min
              {shortest !== liveInterval ? ", rounded to the nearest 5" : ""}). You don&apos;t set this.
            </>
          ) : (
            <>Tick at least one service to give {memberName || "this professional"} a bookable schedule.</>
          )}
        </p>
        {liveInterval ? (
          <p className="mt-2 font-mono text-[11px] text-on-surface-variant">
            {previewTimes(liveInterval).join("  ·  ")}  …
          </p>
        ) : null}
      </div>

      {!data.configured ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3">
          <Info size={15} className="mt-0.5 shrink-0 text-primary" />
          <p className="text-xs text-muted">
            {memberName || "This professional"} currently performs every service at the catalogue duration. Adjust
            anything below and save to set their own times.
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row.serviceId}
            className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 transition-colors ${
              row.enabled ? "border-border bg-card" : "border-dashed border-border bg-transparent opacity-70"
            }`}
          >
            <Checkbox
              checked={row.enabled}
              onCheckedChange={canManage ? (on: boolean) => patch(row.serviceId, { enabled: on }) : () => {}}
              label={
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-on-surface">
                    {row.name}
                    {!row.isActive ? " (inactive)" : ""}
                  </span>
                  <span className="text-[11px] text-muted">
                    Catalogue: {row.defaultDuration} min
                    {row.defaultPrice !== null ? ` · ₹${row.defaultPrice}` : ""}
                  </span>
                </span>
              }
            />

            <div className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-[11px] text-muted">
                Minutes
                <Input
                  type="number"
                  min={1}
                  max={1440}
                  className="w-20 tabular-nums"
                  value={String(row.duration ?? "")}
                  disabled={!canManage || !row.enabled}
                  onChange={(e) => patch(row.serviceId, { duration: Number(e.target.value) })}
                />
              </label>
              {/* Blank means "charge the catalogue price" — the common case, so
                  it stays empty rather than pre-filled with a number the owner
                  would then have to keep in sync by hand. */}
              <label className="flex items-center gap-1.5 text-[11px] text-muted">
                ₹
                <Input
                  type="number"
                  min={0}
                  className="w-24 tabular-nums"
                  placeholder={row.defaultPrice !== null ? String(row.defaultPrice) : "Price"}
                  value={row.price === null || row.price === undefined ? "" : String(row.price)}
                  disabled={!canManage || !row.enabled}
                  onChange={(e) =>
                    patch(row.serviceId, { price: e.target.value === "" ? null : Number(e.target.value) })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {canManage ? (
        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={updateServices.isPending}>
            {updateServices.isPending ? "Saving…" : "Save services"}
          </Button>
          <span className="text-xs text-muted">
            {enabled.length} of {rows.length} service{rows.length === 1 ? "" : "s"} assigned
          </span>
        </div>
      ) : null}
    </div>
  );
}
