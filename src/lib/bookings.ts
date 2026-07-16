import type { BookingStatus, BookingListItem } from "./types";

// Phase 2.5 (Booking Experience) - shared booking presentation helpers.

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  checked_in: "Checked in",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

export const STATUS_TONE: Record<BookingStatus, "success" | "warning" | "danger" | "neutral" | "primary"> = {
  pending: "warning",
  confirmed: "primary",
  checked_in: "primary",
  completed: "success",
  cancelled: "danger",
  no_show: "danger",
};

/**
 * The customer-facing lens the bookings list groups by. Mirrors the backend's
 * category filter but computed client-side for a booking already in hand.
 */
export type BookingCategory = "today" | "upcoming" | "completed" | "cancelled" | "no_show";

export function categorize(b: BookingListItem): BookingCategory {
  if (b.status === "cancelled") return "cancelled";
  if (b.status === "no_show") return "no_show";
  if (b.status === "completed") return "completed";
  // Compared as LOCAL calendar days. This previously compared two UTC strings
  // (`new Date().toISOString()` vs a sliced booking_date) which agreed only
  // while the local date and the UTC date happened to match - so in IST every
  // booking for today fell into "upcoming" from 05:30 onwards, leaving the
  // Today tab empty for most of the day.
  const now = new Date();
  const d = bookingDayParts(b.booking_date);
  const isToday = d.year === now.getFullYear() && d.month === now.getMonth() + 1 && d.day === now.getDate();
  return isToday ? "today" : "upcoming";
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The booking day as local calendar parts.
 *
 * `bookings.booking_date` is a DATE column. The pg driver hands it back as a JS
 * Date at LOCAL midnight, which JSON serialises to a UTC instant - so Monday
 * 2026-07-20 in IST arrives as "2026-07-19T18:30:00.000Z". Slicing that string
 * takes the UTC calendar day, i.e. the day BEFORE, for every positive-offset
 * timezone. Parsing it and reading local components recovers the intended day.
 * A bare "YYYY-MM-DD" (no time part) is already local and is split as-is.
 */
export function bookingDayParts(raw: string): { year: number; month: number; day: number } {
  if (raw.includes("T")) {
    const d = new Date(raw);
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }
  const [year, month, day] = raw.split("-").map(Number);
  return { year, month, day };
}

/** The booking's start as a local Date, built from its calendar parts. */
export function bookingStartDate(bookingDate: string, startTime: string): Date {
  const { year, month, day } = bookingDayParts(bookingDate);
  const [hh, mm] = startTime.split(":").map(Number);
  return new Date(year, month - 1, day, hh || 0, mm || 0);
}

/**
 * A .ics calendar file for a booking. Built client-side (no server round-trip)
 * and handed to the browser as a data URL. Times are emitted as local wall-clock
 * with a floating TZ (no Z suffix) so the event lands at the booking's stated
 * time in the user's calendar regardless of their device timezone.
 */
export function buildICS(b: {
  id: string;
  title: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM[:SS]
  durationMinutes: number;
}): string {
  const start = bookingStartDate(b.date, b.startTime);
  const end = new Date(start.getTime() + b.durationMinutes * 60000);
  const fmt = (dt: Date) => `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;

  const esc = (s: string) => s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Revoras//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.id}@revoras`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(b.title)}`,
    `LOCATION:${esc(b.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf8,${encodeURIComponent(lines.join("\r\n"))}`;
}

/** Google Maps directions URL for a studio's coordinates or address. */
export function directionsUrl(b: { lat?: number | null; lng?: number | null; address?: string | null }): string {
  const dest = b.lat != null && b.lng != null ? `${b.lat},${b.lng}` : encodeURIComponent(b.address ?? "");
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}
