"use client";
import { Suspense } from "react";
import LoginHeroContent from "./LoginHeroContent";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-6 relative py-20 overflow-hidden">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-10 backdrop-blur-xl shadow-floating">
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted mt-4">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginHero() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginHeroContent />
    </Suspense>
  );
}
