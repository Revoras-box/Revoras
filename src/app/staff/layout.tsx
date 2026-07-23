"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BusinessQueryProvider } from "@/lib/business/queryClient";
import { BusinessAuthProvider, useBusinessAuth } from "@/lib/business/auth";
import { StaffShell } from "@/components/business/StaffShell";
import { Spinner } from "@/components/ui/Spinner";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, activeMembership } = useBusinessAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login-staff");
      return;
    }
    // This shell is for staff; an owner-only account belongs on the full
    // business dashboard. Depends on activeMembership so switching studios
    // mid-session re-evaluates too.
    if (activeMembership?.role === "owner") router.replace("/business");
  }, [loading, isAuthenticated, activeMembership, router]);

  if (loading || !isAuthenticated || activeMembership?.role === "owner") {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessQueryProvider>
      <BusinessAuthProvider>
        <AuthGuard>
          <StaffShell>{children}</StaffShell>
        </AuthGuard>
      </BusinessAuthProvider>
    </BusinessQueryProvider>
  );
}
