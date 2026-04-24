"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

// Generic data fetching hook
export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    refetch();
  }, deps);

  return { data, loading, error, refetch };
}

// Studios hooks
export function useStudios(params = {}) {
  return useApi(() => api.getStudios(params), [JSON.stringify(params)]);
}

export function useStudio(id) {
  return useApi(() => api.getStudio(id), [id]);
}

export function useStudioServices(id, category) {
  return useApi(() => api.getStudioServices(id, category), [id, category]);
}

export function useStudioBarbers(id) {
  return useApi(() => api.getStudioBarbers(id), [id]);
}

// Booking hooks
export function useBookings(params = {}) {
  return useApi(() => api.getBookings(params), [JSON.stringify(params)]);
}

export function useBooking(id) {
  return useApi(() => api.getBooking(id), [id]);
}

export function useAvailability(studioId, barberId, date) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(err.message);
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
export function useStudioReviews(studioId, params = {}) {
  return useApi(
    () => api.getStudioReviews(studioId, params),
    [studioId, JSON.stringify(params)]
  );
}

export function useBarberReviews(barberId, params = {}) {
  return useApi(
    () => api.getBarberReviews(barberId, params),
    [barberId, JSON.stringify(params)]
  );
}

export function useMyReviews(params = {}) {
  return useApi(() => api.getMyReviews(params), [JSON.stringify(params)]);
}

// Profile hooks
export function useProfile() {
  return useApi(() => api.getProfile(), []);
}

export function useFavorites() {
  return useApi(() => api.getFavorites(), []);
}

// Mutation hook for actions
export function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (...args) => {
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
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { mutate, loading, error };
}
