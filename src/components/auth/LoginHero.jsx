"use client";
import { Suspense } from "react";
import LoginHeroContent from "./LoginHeroContent";

function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-6 relative py-20 overflow-hidden">
      <div className="w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
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
