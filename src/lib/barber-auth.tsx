"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { api } from "./api";

// Types for both studio owners and barbers
interface StudioOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'manager';
  image_url?: string;
  [key: string]: unknown;
}

interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  title?: string;
  image_url?: string;
  studio_id?: number;
  [key: string]: unknown;
}

interface Studio {
  id: number;
  name: string;
  address: string;
  city?: string;
  state?: string;
  image_url?: string;
  [key: string]: unknown;
}

type AuthUser = StudioOwner | Barber;
type UserRole = 'studio_owner' | 'barber';

interface StudioAuthContextType {
  // Current user (either studio owner or barber)
  user: AuthUser | null;
  studio: Studio | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isStudioOwner: boolean;
  isBarber: boolean;
  
  // Auth methods
  loginAsStudio: (credentials: { phone?: string; email?: string; password: string }) => Promise<{ token?: string; owner?: StudioOwner; studio?: Studio; error?: string }>;
  loginAsBarber: (credentials: { phone: string; password: string }) => Promise<{ token?: string; barber?: Barber; studio?: Studio; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  
  // Legacy alias for backward compatibility
  barber: AuthUser | null;
}

const StudioAuthContext = createContext<StudioAuthContextType | null>(null);

interface StudioAuthProviderProps {
  children: ReactNode;
}

export function BarberAuthProvider({ children }: StudioAuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session - try studio owner first, then barber
    const storedOwner = localStorage.getItem("studioOwner");
    const studioToken = localStorage.getItem("studioToken");
    const storedBarber = localStorage.getItem("barber");
    const barberToken = localStorage.getItem("barberToken");
    const storedStudio = localStorage.getItem("studio");
    
    console.log("BarberAuthProvider checking localStorage:");
    console.log("  studioToken:", studioToken ? "EXISTS" : "NOT FOUND");
    console.log("  studioOwner:", storedOwner ? "EXISTS" : "NOT FOUND");
    console.log("  barberToken:", barberToken ? "EXISTS" : "NOT FOUND");
    
    try {
      if (storedOwner && studioToken) {
        console.log("  → Setting user as studio_owner");
        setUser(JSON.parse(storedOwner));
        setRole('studio_owner');
        if (storedStudio) setStudio(JSON.parse(storedStudio));
      } else if (storedBarber && barberToken) {
        console.log("  → Setting user as barber");
        setUser(JSON.parse(storedBarber));
        setRole('barber');
        if (storedStudio) setStudio(JSON.parse(storedStudio));
      } else {
        console.log("  → No valid auth found");
      }
    } catch (e) {
      console.error("  → Error parsing storage:", e);
      // Clear invalid storage
      localStorage.removeItem("studioOwner");
      localStorage.removeItem("studioToken");
      localStorage.removeItem("barber");
      localStorage.removeItem("barberToken");
      localStorage.removeItem("studio");
    }
    setLoading(false);
  }, []);

  const loginAsStudio = useCallback(async (credentials: { phone?: string; email?: string; password: string }) => {
    const result = await api.studioLogin(credentials);
    let owner: StudioOwner | undefined = undefined;
    let studio: Studio | undefined = undefined;
    if (
      result.token &&
      result.owner &&
      typeof result.owner === 'object' &&
      Object.keys(result.owner).length > 0
    ) {
      owner = result.owner as StudioOwner;
      setUser(owner);
      if (result.studio && result.studio !== null && typeof result.studio === 'object' && Object.keys(result.studio).length > 0) {
        studio = result.studio as Studio;
        setStudio(studio);
      } else {
        setStudio(null);
      }
      setRole('studio_owner');
    }
    return {
      token: result.token,
      owner,
      studio: studio ?? (result.studio as Studio | undefined),
      error: result.error,
    };
  }, []);

  const loginAsBarber = useCallback(async (credentials: { phone: string; password: string }) => {
    const result = await api.barberEmployeeLogin(credentials);
    let barber: Barber | undefined = undefined;
    let studio: Studio | undefined = undefined;
    if (result.token && result.barber && typeof result.barber === 'object' && Object.keys(result.barber).length > 0) {
      barber = result.barber as Barber;
      setUser(barber);
      if (result.studio && typeof result.studio === 'object' && Object.keys(result.studio).length > 0) {
        studio = result.studio as Studio;
        setStudio(studio);
      } else {
        setStudio(null);
      }
      setRole('barber');
    }
    return {
      token: result.token,
      barber,
      studio: studio ?? (result.studio as Studio | undefined),
      error: result.error,
    };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStudio(null);
    setRole(null);
    
    // Clear all auth tokens
    localStorage.removeItem("studioToken");
    localStorage.removeItem("studioOwner");
    localStorage.removeItem("barberToken");
    localStorage.removeItem("barber");
    localStorage.removeItem("studio");
    
    window.location.href = "/login-barber";
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // Update the correct storage based on role
      if (role === 'studio_owner') {
        localStorage.setItem("studioOwner", JSON.stringify(updated));
      } else {
        localStorage.setItem("barber", JSON.stringify(updated));
      }
      
      return updated;
    });
  }, [role]);

  const value: StudioAuthContextType = {
    user,
    studio,
    role,
    loading,
    isAuthenticated: !!user,
    isStudioOwner: role === 'studio_owner',
    isBarber: role === 'barber',
    loginAsStudio,
    loginAsBarber,
    logout,
    updateUser,
    // Legacy alias
    barber: user,
  };

  return (
    <StudioAuthContext.Provider value={value}>
      {children}
    </StudioAuthContext.Provider>
  );
}

// Main hook - use this one
export function useStudioAuth(): StudioAuthContextType {
  const context = useContext(StudioAuthContext);
  if (!context) {
    throw new Error("useStudioAuth must be used within BarberAuthProvider");
  }
  return context;
}

// Legacy alias for backward compatibility
export function useBarberAuth(): StudioAuthContextType {
  return useStudioAuth();
}

