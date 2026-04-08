"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarberAuthProvider, useBarberAuth } from "@/lib/barber-auth";
import BarberSidebar from "@/components/barber/BarberSidebar";

function BarberLayoutContent({ children }: { children: React.ReactNode }) {
  const { barber, loading, isAuthenticated } = useBarberAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login-barber");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E5C487]/30 border-t-[#E5C487] rounded-full animate-spin"></div>
          <p className="text-[#4D463A] uppercase tracking-widest text-xs">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }
        .grain-overlay {
          background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuAox2kzNVZGWz4xywSzCyEJvh6sYel41cOJbvXX92qdqI8lxE3GXg8GGc_8wz-7cJ0bW_tsF0EzpzKUg1xxVDHGj0cXAJSpr6_TAZAOeye2HhV5S12VbOxjTr80QtE8PIQUu8DEqMSNOq7sYBdMbK1BwOBqF3snIGmF9tQM7gr9qAmx0kv73oahUQnnq5cPXpN8n01roY1rdKmRF1AOP1XjzfU7zFg5wJVWD4Tie028Kpgf1RKdNA8cVZBxL9vpsEJAMpp64M-NRrE);
          opacity: 0.03;
          pointer-events: none;
        }
      `}} />
      <div className="grain-overlay fixed inset-0 z-50"></div>
      <BarberSidebar />
      <main className="ml-72 flex-1 min-h-screen flex flex-col relative">
        {children}
      </main>
    </div>
  );
}

export default function BarberDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BarberAuthProvider>
      <BarberLayoutContent>{children}</BarberLayoutContent>
    </BarberAuthProvider>
  );
}
