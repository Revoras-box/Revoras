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
  const today = new Date().toISOString().slice(0, 10);
  const date = b.booking_date.slice(0, 10);
  if (date === today) return "today";
  return "upcoming";
}

const pad = (n: number) => String(n).padStart(2, "0");

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
  const [y, mo, d] = b.date.slice(0, 10).split("-").map(Number);
  const [hh, mm] = b.startTime.split(":").map(Number);
  const start = new Date(y, mo - 1, d, hh, mm || 0);
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
