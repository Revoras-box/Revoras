"use client";
import { Suspense } from "react";
import AuthSuccessContent from "./AuthSuccessContent";

function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted">Processing your login...</p>
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
