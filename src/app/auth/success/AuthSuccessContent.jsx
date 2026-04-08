"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("user");
    const redirect = searchParams.get("redirect") || "/";

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("userToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success(`Welcome, ${user.name || "User"}!`);
        router.push(redirect);
      } catch (e) {
        toast.error("Failed to process login. Please try again.");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400">Processing your login...</p>
      </div>
    </div>
  );
}
