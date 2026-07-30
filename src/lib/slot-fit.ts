import type { Service, AvailabilitySlot, AvailabilityReason } from "./types";

/** "15:30" -> "3:30 PM" */
export const displayTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

/** "15:30" -> 930. Wall-clock minutes; NaN-safe so a bad value can't render as "NaN:NaN". */
export const timeToMinutes = (time: string): number | null => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

/** "15:30" + 45 -> "16:15". Clamped to the day, since an appointment can't wrap past midnight. */
export const addMinutes = (time: string, minutes: number): string | null => {
  const start = timeToMinutes(time);
  if (start === null) return null;
  const total = Math.min(start + Math.max(minutes, 0), 24 * 60 - 1);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

/** Half-open overlap, the same rule the booking conflict check uses. */
export const rangesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
  const [a1, a2, b1, b2] = [startA, endA, startB, endB].map(timeToMinutes);
  if (a1 === null || a2 === null || b1 === null || b2 === null) return false;
  return a1 < b2 && b1 < a2;
};

/** 90 -> "1 hr 30 min" — durations read as time, not as arithmetic. */
export const displayDuration = (minutes: number): string => {
  const mins = Math.max(Math.round(minutes), 0);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
};

export const totalDurationOf = (services: Service[]): number =>
  services.reduce((sum, s) => sum + Number(s.duration || 0), 0);

export const totalPriceOf = (services: Service[]): number =>
  services.reduce((sum, s) => sum + Number(s.price || 0), 0);

/**
 * Why a free-but-unbookable slot is capped, in the customer's words. The
 * difference matters: "the next appointment starts at 3:30" invites them to
 * pick an earlier time, "the day ends at 7:00" doesn't.
 */
export const slotLimitReason = (slot: AvailabilitySlot): string => {
  const until = slot.freeUntil ? displayTime(slot.freeUntil) : null;
  if (!until) return "there isn't enough room left in the day";
  if (slot.limitedBy === "blocked") return `the professional is unavailable from ${until}`;
  if (slot.limitedBy === "shift_end") return `the working day ends at ${until}`;
  return `the next appointment starts at ${until}`;
};

/**
 * Why this date is empty, in the customer's words. The server distinguishes
 * these cases; showing one blanket "no slots" for all of them sends someone
 * hunting through a calendar when the real answer is "she doesn't work Sundays".
 *
 * `mode` is the difference between the two callers: a customer building a
 * booking can drop a service to make it fit, a customer MOVING one cannot —
 * the appointment travels as it is — so telling them to trim it would send them
 * looking for a control that isn't there.
 */
export const emptySlotCopy = (
  reason: AvailabilityReason | null,
  { who, mode = "book" }: { who?: string; mode?: "book" | "move" } = {}
): { title: string; hint: string } => {
  const name = who || "This professional";
  const elsewhere = mode === "move" ? "Try another day from the strip above." : "Try another day from the calendar above.";

  switch (reason) {
    case "business_closed":
      return { title: "The business is closed on this date", hint: elsewhere };
    case "member_off":
      return { title: `${name} isn't working on this date`, hint: elsewhere };
    case "time_off":
      return { title: `${name} is on time off this date`, hint: elsewhere };
    case "day_ended":
      return { title: "No time left today", hint: "Pick a later date." };
    case "duration_exceeds_shift":
      return mode === "move"
        ? {
            title: "Your appointment is longer than this working day",
            hint: `${name} doesn't work a long enough day here. Try another date.`,
          }
        : {
            title: "The selected services don't fit in one appointment",
            hint: "Remove a service, or split them across two bookings.",
          };
    case "service_not_offered":
      // No date helps here, so don't send them back to the calendar.
      return mode === "move"
        ? { title: `${name} no longer offers one of your services`, hint: "Contact the business to move this booking." }
        : {
            title: `${name} doesn't offer one of your services`,
            hint: "Go back and choose a different professional, or drop that service.",
          };
    case "fully_booked":
    default:
      return { title: `${name} is fully booked on this date`, hint: elsewhere };
  }
};

export interface FitSuggestion {
  /** Service ids to keep — the largest-value selection that fits the window. */
  keepIds: string[];
  /** Service ids to drop for the selection to fit. */
  removeIds: string[];
}

/**
 * The best subset of the customer's chosen services that fits `windowMinutes`.
 *
 * Exact, not greedy: a salon menu is small (tens of services at most), so a
 * knapsack over the selected ones is instant and avoids the greedy answer's
 * embarrassment — dropping a ₹800 colour to keep two ₹200 trims because it
 * looked at price-per-minute first. Ranks by value kept, then by number of
 * services kept, then by time used, so a tie never silently drops the longer
 * service the customer probably came for.
 */
export const suggestFit = (services: Service[], windowMinutes: number): FitSuggestion => {
  const budget = Math.max(Math.floor(windowMinutes), 0);

  let best: { ids: string[]; value: number; count: number; duration: number } = {
    ids: [],
    value: 0,
    count: 0,
    duration: 0,
  };

  const walk = (index: number, ids: string[], value: number, duration: number) => {
    if (index === services.length) {
      const better =
        value > best.value ||
        (value === best.value && ids.length > best.count) ||
        (value === best.value && ids.length === best.count && duration > best.duration);
      if (better) best = { ids: [...ids], value, count: ids.length, duration };
      return;
    }
    const service = services[index];
    const nextDuration = duration + Number(service.duration || 0);
    if (nextDuration <= budget) {
      ids.push(service.id);
      walk(index + 1, ids, value + Number(service.price || 0), nextDuration);
      ids.pop();
    }
    walk(index + 1, ids, value, duration);
  };

  // 2^n is fine for a realistic basket; beyond that fall back to "keep what fits
  // in menu order" rather than hanging the browser on a pathological selection.
  if (services.length <= 16) {
    walk(0, [], 0, 0);
  } else {
    let used = 0;
    for (const s of services) {
      if (used + Number(s.duration || 0) <= budget) {
        best.ids.push(s.id);
        used += Number(s.duration || 0);
      }
    }
  }

  const keep = new Set(best.ids);
  return {
    keepIds: services.filter((s) => keep.has(s.id)).map((s) => s.id),
    removeIds: services.filter((s) => !keep.has(s.id)).map((s) => s.id),
  };
};
