"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { businessApi, businessAuthStorage, type BusinessMembership, type BusinessUser } from "./api";
import { resolveLoginPath } from "./resolveLandingPath";

interface BusinessAuthContextType {
  user: BusinessUser | null;
  memberships: BusinessMembership[];
  /** The membership currently in view - drives the Business Switcher and every scoped API call. */
  activeMembership: BusinessMembership | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: {
    email?: string;
    phone?: string;
    password: string;
  }) => Promise<{ error?: string; memberships?: BusinessMembership[] }>;
  logout: () => void;
  switchBusiness: (studioId: string) => void;
}

const BusinessAuthContext = createContext<BusinessAuthContextType | null>(null);

export function BusinessAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BusinessUser | null>(null);
  const [memberships, setMemberships] = useState<BusinessMembership[]>([]);
  const [activeStudioId, setActiveStudioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = businessAuthStorage.getToken();
    if (token) {
      setUser(businessAuthStorage.getUser());
      setMemberships(businessAuthStorage.getMemberships());
      setActiveStudioId(businessAuthStorage.getActiveStudioId());
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials: { email?: string; phone?: string; password: string }) => {
    try {
      const result = await businessApi.login(credentials);
      businessAuthStorage.setSession(result);
      setUser(result.user);
      setMemberships(result.memberships);
      setActiveStudioId(result.memberships[0]?.studioId || null);
      // Returned directly (not just left to context state) because a caller that
      // awaits login() and immediately needs to route by role would otherwise read
      // a stale closure - React hasn't re-rendered this provider yet at that point.
      return { memberships: result.memberships };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Login failed" };
    }
  }, []);

  const activeMembership = memberships.find((m) => m.studioId === activeStudioId) || memberships[0] || null;

  const logout = useCallback(() => {
    const loginPath = resolveLoginPath(activeMembership?.role);
    businessAuthStorage.clear();
    setUser(null);
    setMemberships([]);
    setActiveStudioId(null);
    window.location.href = loginPath;
  }, [activeMembership]);

  const switchBusiness = useCallback((studioId: string) => {
    businessAuthStorage.setActiveStudioId(studioId);
    setActiveStudioId(studioId);
  }, []);

  const value: BusinessAuthContextType = {
    user,
    memberships,
    activeMembership,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    switchBusiness,
  };

  return <BusinessAuthContext.Provider value={value}>{children}</BusinessAuthContext.Provider>;
}

export function useBusinessAuth(): BusinessAuthContextType {
  const context = useContext(BusinessAuthContext);
  if (!context) throw new Error("useBusinessAuth must be used within BusinessAuthProvider");
  return context;
}
