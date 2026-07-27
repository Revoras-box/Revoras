import type { Service, AvailabilitySlot } from "./types";

/** "15:30" -> "3:30 PM" */
export const displayTime = (time: string): string => {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
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
