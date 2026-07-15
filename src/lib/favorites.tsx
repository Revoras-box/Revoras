"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "./api";
import { useAuth } from "./auth";

/**
 * Phase 2.3 (Favorites & Recently Viewed) — one shared source of favorite state
 * for the whole customer app.
 *
 * Why a context rather than `useFavorites()` per card:
 * `useApi` has no cache, so eight rails each calling a favorites hook would
 * fire eight identical requests on every homepage load. This fetches the id
 * projection once per session and lets any card — rail, search result,
 * collection, professional — answer "am I favorited?" from memory.
 *
 * Decision D1: optimistic updates live here, on the existing hand-rolled hooks,
 * rather than adopting React Query. The heart flips immediately, and rolls back
 * to the previous state if the request fails, so a dropped connection can't
 * leave the UI lying about what's saved.
 */
interface FavoritesContextValue {
  isFavorite: (studioId: string) => boolean;
  isProfessionalFavorite: (memberId: string) => boolean;
  toggleFavorite: (studioId: string) => Promise<void>;
  toggleProfessionalFavorite: (memberId: string) => Promise<void>;
  /** Bumped on every successful change so list pages can refetch full cards. */
  version: number;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [studioIds, setStudioIds] = useState<Set<string>>(new Set());
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set());
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      // Signing out must clear the sets, or the next user to sign in on this
      // device briefly sees the previous user's hearts filled.
      setStudioIds(new Set());
      setMemberIds(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .getFavoriteIds()
      .then((res) => {
        if (cancelled || res.error) return;
        setStudioIds(new Set(res.studioIds ?? []));
        setMemberIds(new Set(res.memberIds ?? []));
      })
      .catch(() => {
        /* hearts stay empty; favoriting still works and will resync on reload */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavorite = useCallback((studioId: string) => studioIds.has(studioId), [studioIds]);
  const isProfessionalFavorite = useCallback((memberId: string) => memberIds.has(memberId), [memberIds]);

  /**
   * Flip locally first, call the API, restore the previous set on failure.
   * Snapshotting the whole Set (rather than re-flipping the single id on
   * rollback) keeps this correct when two toggles overlap.
   */
  const toggle = useCallback(
    async (
      id: string,
      ids: Set<string>,
      setIds: (next: Set<string>) => void,
      addFn: (id: string) => Promise<{ error?: string }>,
      removeFn: (id: string) => Promise<{ error?: string }>,
      label: string
    ) => {
      const wasFavorite = ids.has(id);
      const previous = new Set(ids);
      const next = new Set(ids);
      if (wasFavorite) next.delete(id);
      else next.add(id);
      setIds(next);

      try {
        const res = wasFavorite ? await removeFn(id) : await addFn(id);
        if (res?.error) throw new Error(res.error);
        setVersion((v) => v + 1);
        toast.success(wasFavorite ? `Removed from favorites` : `Saved to favorites`);
      } catch (err) {
        setIds(previous);
        toast.error(err instanceof Error ? err.message : `Couldn't update ${label}`);
      }
    },
    []
  );

  const toggleFavorite = useCallback(
    (studioId: string) =>
      toggle(studioId, studioIds, setStudioIds, api.addFavorite as (id: string) => Promise<{ error?: string }>, api.removeFavorite, "favorites"),
    [toggle, studioIds]
  );

  const toggleProfessionalFavorite = useCallback(
    (memberId: string) =>
      toggle(memberId, memberIds, setMemberIds, api.addFavoriteProfessional, api.removeFavoriteProfessional, "favorites"),
    [toggle, memberIds]
  );

  const value = useMemo(
    () => ({ isFavorite, isProfessionalFavorite, toggleFavorite, toggleProfessionalFavorite, version, loading }),
    [isFavorite, isProfessionalFavorite, toggleFavorite, toggleProfessionalFavorite, version, loading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

/**
 * Returns null-object behaviour outside a provider rather than throwing, so a
 * card rendered on a page without the provider (or by a logged-out visitor)
 * degrades to "no hearts" instead of crashing the page.
 */
const NOOP_FAVORITES: FavoritesContextValue = {
  isFavorite: () => false,
  isProfessionalFavorite: () => false,
  toggleFavorite: async () => {},
  toggleProfessionalFavorite: async () => {},
  version: 0,
  loading: false,
};

export function useFavoriteState(): FavoritesContextValue {
  return useContext(FavoritesContext) ?? NOOP_FAVORITES;
}
