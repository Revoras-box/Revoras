"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export default function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("user");
    const redirect = searchParams.get("redirect") || "/";

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        setSession(user, token);
        toast.success(`Welcome, ${user.name || "User"}!`);
        router.push(redirect);
      } catch (e) {
        toast.error("Failed to process login. Please try again.");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router, setSession]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted">Processing your login...</p>
      </div>
    </div>
  );
}
