const STORAGE_KEY = "recentlyViewedBusinesses";
const MAX_ENTRIES = 12;

export interface RecentlyViewedBusiness {
  id: string;
  name: string;
  imageUrl: string | null;
  rating: string | null;
  reviewCount: number;
  category: string | null;
  viewedAt: string;
}

export function getRecentlyViewed(): RecentlyViewedBusiness[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(entry: Omit<RecentlyViewedBusiness, "viewedAt">): void {
  if (typeof window === "undefined") return;
  const existing = getRecentlyViewed().filter((item) => item.id !== entry.id);
  const next = [{ ...entry, viewedAt: new Date().toISOString() }, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

/** Phase 2.3 - the anonymous half of "Clear history" (the signed-in half is DELETE /profile/recently-viewed). */
export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
