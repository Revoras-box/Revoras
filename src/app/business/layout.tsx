"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BusinessQueryProvider } from "@/lib/business/queryClient";
import { BusinessAuthProvider, useBusinessAuth } from "@/lib/business/auth";
import { BusinessShell } from "@/components/business/BusinessShell";
import { OnboardingGate } from "@/components/business/OnboardingGate";
import { Spinner } from "@/components/ui/Spinner";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useBusinessAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/login-barber");
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The onboarding wizard is a focused full-screen flow: it renders inside the
  // auth/query providers (so it can call scoped APIs) but deliberately without
  // the dashboard shell or the OnboardingGate (which would otherwise loop).
  const isOnboarding = pathname?.startsWith("/business/onboarding");

  return (
    <BusinessQueryProvider>
      <BusinessAuthProvider>
        <AuthGuard>
          {isOnboarding ? (
            children
          ) : (
            <BusinessShell>
              <OnboardingGate>{children}</OnboardingGate>
            </BusinessShell>
          )}
        </AuthGuard>
      </BusinessAuthProvider>
    </BusinessQueryProvider>
  );
}
