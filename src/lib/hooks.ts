"use client";

import { useState, useEffect, useCallback, DependencyList } from "react";
import { api } from "./api";
import { useAuth } from "./auth";
import { getRecentlyViewed } from "./recently-viewed";
import type { RecentlyViewedCard, AvailabilityReason, AvailabilityResponse, AvailabilitySlot } from "./types";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  [key: string]: unknown;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Generic data fetching hook
export function useApi<T>(
  fetchFn: () => Promise<ApiResponse<T> | T>,
  deps: DependencyList = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (result && typeof result === 'object' && 'error' in result && result.error) {
        setError(result.error as string);
      } else {
        setData(result as T);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}

// Discover hooks (businesses/professionals)
export function useBusinesses(params: Record<string, string> = {}) {
  return useApi(() => api.getBusinesses(params), [JSON.stringify(params)]);
}

export function useBusinessesMap(params: { lat?: number; lng?: number; radiusKm?: number; minLat?: number; maxLat?: number; minLng?: number; maxLng?: number; limit?: number } = {}) {
  return useApi(() => api.getBusinessesMap(params), [JSON.stringify(params)]);
}

export function useBusiness(id: string) {
  return useApi(() => api.getBusiness(id), [id]);
}

export function useBusinessServices(id: string) {
  return useApi(() => api.getBusinessServices(id), [id]);
}

export function useBusinessProfessionals(id: string) {
  return useApi(() => api.getBusinessProfessionals(id), [id]);
}

export function useProfessional(id: string) {
  return useApi(() => api.getProfessional(id), [id]);
}

export function useCategories(type?: "business" | "service") {
  return useApi(() => api.getCategories(type), [type]);
}

// Phase 2.2 (Discovery Curation System) - editorial collections.
export function useCollections(params: { city?: string } = {}) {
  return useApi(() => api.getCollections(params), [JSON.stringify(params)]);
}

export function useCollection(slug: string, params: { page?: number; limit?: number } = {}) {
  return useApi(() => api.getCollection(slug, params), [slug, JSON.stringify(params)]);
}

// Booking hooks
export function useBookings(params: Record<string, string | undefined> = {}) {
  return useApi(() => api.getBookings(params), [JSON.stringify(params)]);
}

export function useBooking(id: string) {
  return useApi(() => api.getBooking(id), [id]);
}

// Phase 2.5 - `version` lets a caller force a refetch after a lifecycle action.
export function useBookingTimeline(id: string, version = 0) {
  return useApi(() => api.getBookingTimeline(id), [id, version]);
}

interface AvailabilityResult {
  slots: string[];
  /** Every position in the professional's day, taken ones included, with per-slot state. */
  grid: AvailabilitySlot[];
  /** Set when `slots` is empty: why this date has nothing bookable. */
  reason: AvailabilityReason | null;
  /** The professional's working window for the date, when they work it at all. */
  shift: AvailabilityResponse["shift"];
  /** The longest appointment that could start anywhere on this date. */
  longestFreeWindow: number;
  /** Minutes between start times, derived server-side from the shop's shortest service. */
  interval: number | null;
  /** Rescheduling only: the window being vacated, when it falls on this date. */
  movingFrom: AvailabilityResponse["movingFrom"];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Slots for one professional on one date.
 *
 * Pass `serviceIds` so the server sizes the appointment from the real service
 * durations. The response is authoritative - it already accounts for the shop's
 * opening hours, the professional's own rota, their time off and their existing
 * bookings, so callers must not filter it further.
 */
export function useAvailability(
  studioId: string,
  barberId: string | null,
  date: string,
  duration?: number,
  serviceIds?: string[],
  /** Rescheduling: the booking being moved, so it doesn't block its own move. */
  excludeBookingId?: string
): AvailabilityResult {
  const [slots, setSlots] = useState<string[]>([]);
  const [grid, setGrid] = useState<AvailabilitySlot[]>([]);
  const [longestFreeWindow, setLongestFreeWindow] = useState(0);
  // Named apart from the DOM global so nothing in this file accidentally shadows it.
  const [gridInterval, setGridInterval] = useState<number | null>(null);
  const [reason, setReason] = useState<AvailabilityReason | null>(null);
  const [shift, setShift] = useState<AvailabilityResponse["shift"]>(null);
  const [movingFrom, setMovingFrom] = useState<AvailabilityResponse["movingFrom"]>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Identity-stable dependency: a fresh array literal on every render would
  // otherwise re-trigger the fetch in a loop.
  const serviceKey = serviceIds?.join(",") ?? "";

  const fetchSlots = useCallback(async () => {
    if (!studioId || !barberId || !date) {
      setSlots([]);
      setGrid([]);
      setLongestFreeWindow(0);
      setGridInterval(null);
      setReason(null);
      setShift(null);
      setMovingFrom(null);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      const ids = serviceKey ? serviceKey.split(",") : undefined;
      const result = await api.getAvailability(studioId, barberId, date, duration, ids, excludeBookingId);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);
        setSlots(result.slots || []);
        setGrid(result.grid || []);
        setLongestFreeWindow(result.longestFreeWindow ?? 0);
        setGridInterval(result.interval ?? null);
        setReason(result.reason ?? null);
        setShift(result.shift ?? null);
        setMovingFrom(result.movingFrom ?? null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [studioId, barberId, date, duration, serviceKey, excludeBookingId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return {
    slots,
    grid,
    longestFreeWindow,
    interval: gridInterval,
    reason,
    shift,
    movingFrom,
    loading,
    error,
    refetch: fetchSlots,
  };
}

// Review hooks
export function useBusinessReviews(studioId: string, params: Record<string, string> = {}) {
  return useApi(
    () => api.getBusinessReviews(studioId, params),
    [studioId, JSON.stringify(params)]
  );
}

export function useProfessionalReviews(memberId: string, params: Record<string, string> = {}) {
  return useApi(
    () => api.getProfessionalReviews(memberId, params),
    [memberId, JSON.stringify(params)]
  );
}

export function useMyReviews<T = unknown>(params: Record<string, string> = {}) {
  return useApi<T>(() => api.getMyReviews(params) as Promise<T>, [JSON.stringify(params)]);
}

// Profile hooks
export function useProfile() {
  return useApi(() => api.getProfile(), []);
}

export function useFavorites() {
  return useApi(() => api.getFavorites(), []);
}

export function useFavoriteProfessionals() {
  return useApi(() => api.getFavoriteProfessionals(), []);
}

/**
 * Phase 2.3 (Decision D2) — hybrid recently-viewed.
 *
 * Authenticated users read their server-side history (so it follows them across
 * devices); everyone else falls back to the localStorage store this feature
 * originally shipped on.
 *
 * Note: every `/user/*` route is currently behind `AuthGate`, so the anonymous
 * branch is unreachable today — there is no logged-out browsing surface. It's
 * kept because the fallback costs one conditional and public business pages are
 * a plausible near-term addition; if that never happens, this branch and
 * `lib/recently-viewed.ts` are both dead code worth deleting.
 *
 * `version` lets a caller force a re-read (e.g. after "Clear history").
 */
export function useRecentlyViewed(limit = 12, version = 0) {
  const { user } = useAuth();
  const [local, setLocal] = useState<RecentlyViewedCard[]>([]);
  const remote = useApi(() => api.getRecentlyViewed({ limit }), [user?.id ?? "anon", limit, version]);

  useEffect(() => {
    if (user) return;
    // Map the client store onto the same card shape the API returns, so the
    // rail renders one way regardless of which half of the hybrid fed it.
    setLocal(
      getRecentlyViewed()
        .slice(0, limit)
        .map((r) => ({
          id: r.id,
          name: r.name,
          slug: "",
          image_url: r.imageUrl,
          rating: r.rating,
          review_count: r.reviewCount,
          city: r.category,
          address: "",
          viewed_at: r.viewedAt,
        }))
    );
  }, [user, limit, version]);

  if (!user) return { businesses: local, loading: false, error: null };
  return { businesses: remote.data?.businesses ?? [], loading: remote.loading, error: remote.error };
}

// Notification hooks
export function useNotifications(params: { unreadOnly?: boolean; page?: number; limit?: number } = {}) {
  return useApi(() => api.getNotifications(params), [JSON.stringify(params)]);
}

export function useUnreadNotificationCount() {
  return useApi(() => api.getUnreadNotificationCount(), []);
}

// Mutation hook for actions
interface MutationResult<T, TArgs extends unknown[]> {
  mutate: (...args: TArgs) => Promise<{ success: boolean; data?: T; error?: string }>;
  loading: boolean;
  error: string | null;
}

export function useMutation<T, TArgs extends unknown[] = unknown[]>(
  mutationFn: (...args: TArgs) => Promise<T & { error?: string }>
): MutationResult<T, TArgs> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (...args: TArgs) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mutationFn(...args);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { mutate, loading, error };
}
