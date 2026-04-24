"use client";

import { useState, useEffect, useCallback, DependencyList } from "react";
import { api } from "./api";

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

// Studios hooks
export function useStudios<T = unknown>(params: Record<string, string> = {}) {
  return useApi<T>(() => api.getStudios(params) as Promise<T>, [JSON.stringify(params)]);
}

export function useStudiosForMap<T = unknown>(params: { lat?: number; lng?: number; radius?: number; limit?: number } = {}) {
  return useApi<T>(() => api.getStudiosForMap(params) as Promise<T>, [JSON.stringify(params)]);
}

export function useStudio<T = unknown>(id: string) {
  return useApi<T>(() => api.getStudio(id) as Promise<T>, [id]);
}

export function useStudioServices<T = unknown>(id: string, category?: string) {
  return useApi<T>(() => api.getStudioServices(id, category) as Promise<T>, [id, category]);
}

export function useStudioBarbers<T = unknown>(id: string) {
  return useApi<T>(() => api.getStudioBarbers(id) as Promise<T>, [id]);
}

// Booking hooks
export function useBookings(params: Record<string, string | undefined> = {}) {
  return useApi(() => api.getBookings(params), [JSON.stringify(params)]);
}

export function useBooking(id: string) {
  return useApi(() => api.getBooking(id), [id]);
}

interface AvailabilityResult {
  slots: string[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAvailability(studioId: string, barberId: string | null, date: string): AvailabilityResult {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    if (!studioId || !barberId || !date) {
      setSlots([]);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      const result = await api.getAvailability(studioId, barberId, date);
      if (result.error) {
        setError(result.error);
      } else {
        setSlots(result.slots || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [studioId, barberId, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slots, loading, error, refetch: fetchSlots };
}

// Review hooks
export function useStudioReviews<T = unknown>(studioId: string, params: Record<string, string> = {}) {
  return useApi<T>(
    () => api.getStudioReviews(studioId, params) as Promise<T>,
    [studioId, JSON.stringify(params)]
  );
}

export function useBarberReviews<T = unknown>(barberId: string, params: Record<string, string> = {}) {
  return useApi<T>(
    () => api.getBarberReviews(barberId, params) as Promise<T>,
    [barberId, JSON.stringify(params)]
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
