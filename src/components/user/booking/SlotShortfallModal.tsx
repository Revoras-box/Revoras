"use client";

import { CalendarX, Lock } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { displayTime, displayDuration, slotLimitReason } from "@/lib/slot-fit";
import { TimeMeter } from "./TimeMeter";
import type { AvailabilitySlot } from "@/lib/types";

/**
 * The booking wizard's counterpart to `ServiceFitModal`, for a slot that can't
 * be fixed by trimming.
 *
 * When a customer MOVES a booking, the appointment travels exactly as it was
 * paid for — the services, the length and the price are already settled. So the
 * wizard's answer to a too-short window ("drop a service and it fits") isn't
 * available here, and offering it would be a control that can't work. What is
 * still worth saying is everything else that dialog says: how long the
 * appointment is, how much room this time actually has, what caps it, and which
 * times on the same date do fit.
 */
export interface SlotShortfallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The slot the customer tapped — free, but too short for their appointment. */
  slot: AvailabilitySlot | null;
  /** How long the booking runs, in minutes. Fixed: it moves as a whole. */
  requiredDuration: number;
  /** Other start times on this date that fit it. */
  fittingSlots: AvailabilitySlot[];
  /** Take one of those times instead. */
  onPickTime: (time: string) => void;
}

export function SlotShortfallModal({
  open,
  onOpenChange,
  slot,
  requiredDuration,
  fittingSlots,
  onPickTime,
}: SlotShortfallModalProps) {
  if (!slot) return null;

  const time = displayTime(slot.time);
  const budget = slot.maxDuration ?? 0;
  const alternatives = fittingSlots.slice(0, 6);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={`Not enough time at ${time}`}
      description={`Your booking needs ${displayDuration(requiredDuration)}, but only ${displayDuration(budget)} is free at ${time} — ${slotLimitReason(slot)}.`}
      footer={
        <Button intent="ghost" onClick={() => onOpenChange(false)}>
          Close
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <TimeMeter used={requiredDuration} budget={budget} usedLabel="Your booking" />

        {/* Said plainly, because the wizard trains customers to expect the
            opposite: there, a tight slot is solved by dropping a service. */}
        <p className="inline-flex items-start gap-2 rounded-xl bg-surface-container-low p-3 text-xs text-muted">
          <Lock size={12} className="mt-0.5 shrink-0" />
          <span>
            Moving a booking keeps the same services, so this one can&apos;t be shortened to fit. Pick a time with room
            for all {displayDuration(requiredDuration)} of it.
          </span>
        </p>

        <div className="rounded-xl border border-border p-3">
          <div className="text-xs font-semibold text-on-surface">
            Times on this date that fit {displayDuration(requiredDuration)}
          </div>
          {alternatives.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {alternatives.map((alt) => (
                <button
                  key={alt.time}
                  type="button"
                  onClick={() => onPickTime(alt.time)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-on-surface transition-colors duration-fast hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {displayTime(alt.time)}
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-1.5 inline-flex items-start gap-2 text-xs text-muted">
              <CalendarX size={12} className="mt-0.5 shrink-0" />
              Nothing on this date has room for it. Try another day from the strip above.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
