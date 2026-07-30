"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Wand2, ArrowRight, AlertTriangle } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { displayTime, displayDuration, totalDurationOf, totalPriceOf, slotLimitReason, suggestFit } from "@/lib/slot-fit";
import { TimeMeter } from "./TimeMeter";
import type { AvailabilitySlot, Service } from "@/lib/types";

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/* ------------------------------- service row ------------------------------ */

function ServiceRow({
  service,
  kept,
  onToggle,
}: {
  service: Service;
  kept: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={kept}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors duration-fast",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          kept
            ? "border-primary bg-primary/5"
            : "border-border bg-surface-container-low opacity-70 hover:opacity-100"
        )}
      >
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-fast",
            kept ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface"
          )}
        >
          {kept ? <Check size={13} /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn("block truncate text-sm font-medium", kept ? "text-on-surface" : "text-muted line-through")}>
            {service.name}
          </span>
          <span className="block text-xs text-muted">
            {displayDuration(Number(service.duration))} · {inr(Number(service.price))}
          </span>
        </span>
        <span className={cn("shrink-0 text-[11px] font-medium uppercase tracking-wide", kept ? "text-primary" : "text-muted")}>
          {kept ? "Keeping" : "Removed"}
        </span>
      </button>
    </li>
  );
}

/* --------------------------------- modal ---------------------------------- */

export interface ServiceFitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The slot the customer tapped — free, but too short for everything they picked. */
  slot: AvailabilitySlot | null;
  /** The services currently selected, in menu order. */
  services: Service[];
  /** Other start times on this date that fit the full selection. */
  fittingSlots: AvailabilitySlot[];
  /** Apply a trimmed selection and take this slot. */
  onApply: (keepServiceIds: string[], time: string) => void;
  /** Keep every service and take a different time instead. */
  onPickTime: (time: string) => void;
}

export function ServiceFitModal({
  open,
  onOpenChange,
  slot,
  services,
  fittingSlots,
  onApply,
  onPickTime,
}: ServiceFitModalProps) {
  const budget = slot?.maxDuration ?? 0;
  const required = totalDurationOf(services);

  // Opens already solved: the best-value combination that fits. The customer
  // can override any of it — this is a starting point, not a decision made for
  // them.
  const suggestion = useMemo(() => suggestFit(services, budget), [services, budget]);
  const [keptIds, setKeptIds] = useState<string[]>(suggestion.keepIds);

  // Re-solve whenever the dialog is opened against a different slot/selection,
  // so reopening never shows a stale trim from a previous time.
  useEffect(() => {
    if (open) setKeptIds(suggestion.keepIds);
  }, [open, suggestion.keepIds]);

  const kept = services.filter((s) => keptIds.includes(s.id));
  const used = totalDurationOf(kept);
  const fits = kept.length > 0 && used <= budget;

  const toggle = (id: string) =>
    setKeptIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const alternatives = fittingSlots.slice(0, 4);

  if (!slot) return null;

  const time = displayTime(slot.time);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={`Not enough time at ${time}`}
      description={`Your ${services.length} services need ${displayDuration(required)}, but only ${displayDuration(budget)} is free at ${time} — ${slotLimitReason(slot)}.`}
      footer={
        <>
          <Button intent="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!fits} onClick={() => onApply(keptIds, slot.time)}>
            {fits ? `Book ${time} · ${displayDuration(used)}` : "Remove a service to continue"}
            {fits ? <ArrowRight size={15} /> : null}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <TimeMeter used={used} budget={budget} />

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              Your services — tap to remove
            </span>
            {suggestion.removeIds.length > 0 && keptIds.join(",") !== suggestion.keepIds.join(",") ? (
              <button
                type="button"
                onClick={() => setKeptIds(suggestion.keepIds)}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Wand2 size={12} /> Best fit
              </button>
            ) : null}
          </div>

          <ul className="flex flex-col gap-2">
            {services.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                kept={keptIds.includes(service.id)}
                onToggle={() => toggle(service.id)}
              />
            ))}
          </ul>

          {kept.length === 0 ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-error">
              <AlertTriangle size={12} /> Keep at least one service to book this time.
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted">
              Removed services stay on the menu — you can book them separately at another time.
            </p>
          )}
        </div>

        <div className="rounded-xl bg-surface-container-low p-3">
          <div className="text-xs font-semibold text-on-surface">
            Or keep all {services.length} services ({displayDuration(required)})
          </div>
          {alternatives.length > 0 ? (
            <>
              <p className="mt-0.5 text-xs text-muted">These times on this date fit everything:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {alternatives.map((alt) => (
                  <button
                    key={alt.time}
                    type="button"
                    onClick={() => onPickTime(alt.time)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-on-surface transition-colors duration-fast hover:border-primary hover:text-primary"
                  >
                    {displayTime(alt.time)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-0.5 text-xs text-muted">
              No time on this date fits all of them. Try another date, or book the rest separately.
            </p>
          )}
        </div>

        {kept.length > 0 && kept.length < services.length ? (
          <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-sm">
            <span className="text-muted">New total</span>
            <span className="font-headline font-bold text-on-surface tabular-nums">{inr(totalPriceOf(kept))}</span>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
