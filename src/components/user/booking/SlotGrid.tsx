"use client";

import { Lock, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { displayTime, displayDuration } from "@/lib/slot-fit";
import type { AvailabilitySlot } from "@/lib/types";

/**
 * The professional's whole day, not just the parts that happen to fit.
 *
 * The grid used to render only bookable start times, so a slot taken by
 * someone else simply vanished — indistinguishable from a salon that closes at
 * 3pm. Showing every position with its real state is what lets a customer
 * reason about the day: "3:00 is booked, 3:30 only has 30 minutes free".
 *
 * Only `insufficient_time` slots are clickable-but-not-bookable, because they
 * are the one state the customer can resolve themselves (by trimming
 * services); the parent opens the fit dialog for them.
 */

const PART_OF_DAY = [
  { label: "Morning", test: (h: number) => h < 12 },
  { label: "Afternoon", test: (h: number) => h >= 12 && h < 17 },
  { label: "Evening", test: (h: number) => h >= 17 },
] as const;

interface SlotChipProps {
  slot: AvailabilitySlot;
  selected: boolean;
  /** Total minutes the current service selection needs — shown as the shortfall. */
  requiredDuration: number;
  onSelect: (time: string) => void;
  onTooShort: (slot: AvailabilitySlot) => void;
}

function SlotChip({ slot, selected, requiredDuration, onSelect, onTooShort }: SlotChipProps) {
  const label = displayTime(slot.time);

  if (slot.status === "booked" || slot.status === "blocked") {
    const isBooked = slot.status === "booked";
    // One chip now covers a whole appointment rather than one per grid step, so
    // the chip carries its span: "10:00, till 11:00" is the useful half of the
    // information, and it's what tells a customer whether waiting is worth it.
    return (
      <div
        aria-label={`${label} — ${isBooked ? "already booked" : "unavailable"}${slot.freeAt ? `, free again at ${displayTime(slot.freeAt)}` : ""}`}
        title={slot.freeAt ? `${isBooked ? "Booked" : "Away"} — free again at ${displayTime(slot.freeAt)}` : undefined}
        className="flex cursor-not-allowed select-none flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-container-low px-2 py-2 text-center"
      >
        <span className="text-sm font-medium text-muted line-through decoration-muted/60">{label}</span>
        <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-muted">
          <Lock size={9} className="shrink-0" />
          <span className="truncate">{slot.freeAt ? `Till ${displayTime(slot.freeAt)}` : isBooked ? "Booked" : "Away"}</span>
        </span>
      </div>
    );
  }

  if (slot.status === "past") {
    return (
      <div
        aria-label={`${label} — already passed`}
        className="flex cursor-not-allowed select-none flex-col items-center justify-center rounded-xl border border-border/60 bg-transparent px-2 py-2 text-center opacity-45"
      >
        <span className="text-sm font-medium text-muted">{label}</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">Passed</span>
      </div>
    );
  }

  if (slot.status === "insufficient_time") {
    const shortBy = Math.max(requiredDuration - slot.maxDuration, 0);
    return (
      <button
        type="button"
        onClick={() => onTooShort(slot)}
        aria-label={`${label} — only ${displayDuration(slot.maxDuration)} free, ${displayDuration(shortBy)} short. Adjust your services to fit.`}
        className="flex flex-col items-center justify-center rounded-xl border border-warning/50 bg-warning-container/40 px-2 py-2 text-center transition-colors duration-fast hover:border-warning hover:bg-warning-container/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
      >
        <span className="inline-flex items-center gap-1 text-sm font-medium text-on-warning-container">
          <AlertTriangle size={11} /> {label}
        </span>
        <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-on-warning-container/80">
          {slot.maxDuration > 0 ? `${slot.maxDuration} min free` : "No room"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(slot.time)}
      aria-pressed={selected}
      aria-label={`${label} — available, ${displayDuration(slot.maxDuration)} free`}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition-colors duration-fast",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-primary text-on-primary shadow-soft"
          : "border-border bg-card text-on-surface hover:border-primary hover:bg-primary/5 hover:text-primary"
      )}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className={cn("mt-0.5 text-[10px] uppercase tracking-wide", selected ? "text-on-primary/80" : "text-muted")}>
        {selected ? "Selected" : "Free"}
      </span>
    </button>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
      <span className={cn("h-2.5 w-2.5 rounded-full border", className)} />
      {label}
    </span>
  );
}

export interface SlotGridProps {
  grid: AvailabilitySlot[];
  selected: string | null;
  requiredDuration: number;
  /**
   * Minutes between start times, as the server derived them from this shop's
   * shortest service. Shown so an unfamiliar cadence (every 20 min, times that
   * pick up mid-hour after an appointment) reads as deliberate, not broken.
   */
  interval?: number | null;
  onSelect: (time: string) => void;
  onTooShort: (slot: AvailabilitySlot) => void;
}

export function SlotGrid({ grid, selected, requiredDuration, interval, onSelect, onTooShort }: SlotGridProps) {
  const groups = PART_OF_DAY.map((part) => ({
    label: part.label,
    slots: grid.filter((slot) => part.test(Number(slot.time.split(":")[0]))),
  })).filter((group) => group.slots.length > 0);

  const freeCount = grid.filter((s) => s.available).length;
  const tightCount = grid.filter((s) => s.status === "insufficient_time").length;

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => {
        const groupFree = group.slots.filter((s) => s.available).length;
        return (
          <div key={group.label}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">{group.label}</span>
              <span className="text-[11px] text-muted">
                {groupFree} of {group.slots.length} free
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {group.slots.map((slot) => (
                <SlotChip
                  key={slot.time}
                  slot={slot}
                  selected={selected === slot.time}
                  requiredDuration={requiredDuration}
                  onSelect={onSelect}
                  onTooShort={onTooShort}
                />
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
        <LegendDot className="border-border bg-card" label="Available" />
        <LegendDot className="border-warning/50 bg-warning-container" label="Not enough time — tap to adjust" />
        <LegendDot className="border-dashed border-border bg-surface-container-low" label="Booked" />
        {interval ? (
          <span className="ml-auto text-[11px] text-muted">Start times every {interval} min</span>
        ) : null}
      </div>

      {freeCount === 0 && tightCount > 0 ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning-container/30 p-3">
          <Clock size={15} className="mt-0.5 shrink-0 text-on-warning-container" />
          <p className="text-xs text-on-warning-container">
            Nothing on this date fits all {displayDuration(requiredDuration)} of your selection. Tap any amber time to
            see what would fit there, or try another date.
          </p>
        </div>
      ) : null}
    </div>
  );
}
