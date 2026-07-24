"use client";
import { Suspense } from "react";
import LoginHeroContent from "./LoginHeroContent";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 sm:px-6 pt-24 pb-16">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-card border border-border rounded-3xl overflow-hidden shadow-floating min-h-[30rem]">
        <div className="hidden lg:block brand-banner" />
        <div className="p-8 sm:p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted mt-4 text-sm">Loading...</p>
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
