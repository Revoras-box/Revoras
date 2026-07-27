import type { Business, FavoriteCard, WorkingHour, RecentlyViewedCard, ProfessionalCardData } from "@/lib/types";

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatHourRange(hour: WorkingHour): string {
  if (hour.is_closed || !hour.open_time || !hour.close_time) return "Closed";
  return `${hour.open_time.slice(0, 5)} - ${hour.close_time.slice(0, 5)}`;
}

export function getOpenStatus(workingHours: WorkingHour[]): { isOpen: boolean; label: string } {
  if (workingHours.length === 0) return { isOpen: false, label: "Hours unavailable" };
  const now = new Date();
  const today = workingHours.find((h) => h.day_of_week === now.getDay());
  if (!today || today.is_closed || !today.open_time || !today.close_time) {
    return { isOpen: false, label: "Closed today" };
  }
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open_time.split(":").map(Number);
  const [closeH, closeM] = today.close_time.split(":").map(Number);
  const isOpen = nowMinutes >= openH * 60 + openM && nowMinutes < closeH * 60 + closeM;
  return { isOpen, label: isOpen ? "Open now" : `Opens ${today.open_time.slice(0, 5)}` };
}
import type { RecentlyViewedBusiness } from "@/lib/recently-viewed";
import type { BusinessCardProps, ProfessionalCardProps } from "@/components/ui";

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

export function businessToCardProps(b: Business): Omit<BusinessCardProps, "onClick" | "onFavoriteToggle" | "isFavorite"> {
  return {
    name: b.name,
    imageUrl: b.image_url ?? undefined,
    category: b.category_name ?? "Studio",
    rating: b.rating ? Number(b.rating) : 0,
    reviewCount: b.review_count,
    distanceLabel: b.distance_km !== undefined ? formatDistance(b.distance_km) : undefined,
    badges: b.badges, // Phase 1.4c
    offerLabel: b.offer?.bestLabel ?? undefined, // Phase 2.4
  };
}

export function favoriteToCardProps(f: FavoriteCard): Omit<BusinessCardProps, "onClick" | "onFavoriteToggle" | "isFavorite"> {
  return {
    name: f.name,
    imageUrl: f.image_url ?? undefined,
    category: f.city ?? "",
    rating: f.rating ? Number(f.rating) : 0,
    reviewCount: f.review_count,
  };
}

export function recentToCardProps(r: RecentlyViewedBusiness): Omit<BusinessCardProps, "onClick" | "onFavoriteToggle" | "isFavorite"> {
  return {
    name: r.name,
    imageUrl: r.imageUrl ?? undefined,
    category: r.category ?? "Studio",
    rating: r.rating ? Number(r.rating) : 0,
    reviewCount: r.reviewCount,
  };
}

/**
 * Phase 2.3 - maps the unified RecentlyViewedCard (what useRecentlyViewed
 * returns from either half of the hybrid) onto card props. Distinct from
 * recentToCardProps above, which maps the raw localStorage entry shape and is
 * still used where that store is read directly.
 */
export function recentCardToCardProps(r: RecentlyViewedCard): Omit<BusinessCardProps, "onClick" | "onFavoriteToggle" | "isFavorite"> {
  return {
    name: r.name,
    imageUrl: r.image_url ?? undefined,
    category: r.city ?? "Studio",
    rating: r.rating ? Number(r.rating) : 0,
    reviewCount: r.review_count,
  };
}

/** Phase 2.3 - a favorited/recently-viewed professional onto ProfessionalCard props. */
export function professionalToCardProps(p: ProfessionalCardData): Omit<ProfessionalCardProps, "onClick" | "onFavoriteToggle" | "isFavorite"> {
  return {
    name: p.name,
    avatarUrl: p.image_url ?? undefined,
    designation: p.designation ?? undefined,
    specialties: p.specialties ?? [],
    rating: p.rating ? Number(p.rating) : undefined,
  };
}

export function formatBookingDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTimeLabel(timeStr: string): string {
  const [hoursRaw, minutesRaw] = timeStr.split(":");
  const hours = Number(hoursRaw);
  const minutes = minutesRaw ?? "00";
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}
