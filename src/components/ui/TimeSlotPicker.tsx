import { cn } from "@/lib/utils";

export interface TimeSlotPickerProps {
  /** "HH:MM" 24h strings, as returned by `GET /bookings/availability`. */
  slots: string[];
  selected?: string;
  onSelect: (slot: string) => void;
  className?: string;
}

const formatSlot = (slot: string) => {
  const [h, m] = slot.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

/** Renders the exact slot list the backend already computed (conflict-checked server-side) — this component does no time-math of its own. */
export function TimeSlotPicker({ slots, selected, onSelect, className }: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return <p className="text-sm text-muted py-4">No slots available on this date.</p>;
  }

  return (
    <div role="radiogroup" aria-label="Available times" className={cn("grid grid-cols-3 sm:grid-cols-4 gap-2", className)}>
      {slots.map((slot) => {
        const isSelected = slot === selected;
        return (
          <button
            key={slot}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(slot)}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium tabular-nums transition-colors duration-(--duration-fast) ease-(--ease-out)",
              isSelected
                ? "border-primary bg-primary text-on-primary"
                : "border-outline-variant text-on-surface hover:bg-surface-container-low"
            )}
          >
            {formatSlot(slot)}
          </button>
        );
      })}
    </div>
  );
}
