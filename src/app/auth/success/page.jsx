"use client";
import { Suspense } from "react";
import AuthSuccessContent from "./AuthSuccessContent";

function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400">Processing your login...</p>
      </div>
    </div>
  );
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthSuccessContent />
    </Suspense>
  );
}
