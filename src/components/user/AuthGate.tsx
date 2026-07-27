"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui";

/**
 * Airbnb-style booking gate. Browsing is fully public; only account-specific and
 * booking routes mount this. When a signed-out visitor reaches one, we don't drop
 * them on a bare login page and lose their place — we remember exactly where they
 * were headed (path + query, so a half-built booking selection survives) and hand
 * it to `/login` as a `redirect` param. After they sign in, LoginHeroContent
 * sends them straight back here to continue.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const query = searchParams.toString();
      const returnTo = query ? `${pathname}?${query}` : pathname;
      toast.info("Please log in to continue");
      router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
    }
  }, [loading, isAuthenticated, router, pathname, searchParams]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
