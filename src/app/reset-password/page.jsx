"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setValidToken(false);
      return;
    }
    setValidToken(true);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    toast.loading("Resetting password...");

    try {
      const result = await api.resetPassword(token, password);
      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else {
        setResetComplete(true);
        toast.success("Password reset successful!");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (validToken === null) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (validToken === false || !token) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="relative w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
          <div className="text-center space-y-6">
            <div className="text-red-400 text-5xl">✕</div>
            <h2 className="text-2xl font-bold">Invalid Link</h2>
            <p className="text-gray-400">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={() => router.push("/forgot-password")}
              className="w-full bg-[#C8A96E] text-black py-4 rounded-xl font-semibold"
            >
              Request New Link
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full border border-gray-700 py-4 rounded-xl text-gray-400"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
        <div className="absolute w-150 h-150 bg-[#C8A96E]/10 blur-[120px] rounded-full"></div>
        
        <div className="relative w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
          <div className="text-center space-y-6">
            <div className="text-green-400 text-5xl">✓</div>
            <h2 className="text-2xl font-bold">Password Reset!</h2>
            <p className="text-gray-400">
              Your password has been successfully reset.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#C8A96E] text-black py-4 rounded-xl font-semibold"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="absolute w-150 h-150 bg-[#C8A96E]/10 blur-[120px] rounded-full"></div>

      <div className="relative w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-[11px] tracking-[0.35em] text-[#C8A96E] uppercase">
              Account Recovery
            </div>

            <h1 className="text-3xl font-bold leading-tight">
              Set New <br />
              <span className="bg-linear-to-r from-[#E6D2A4] to-[#C8A96E] text-transparent bg-clip-text">
                Password
              </span>
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-xs uppercase text-gray-500 tracking-widest">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#2a2a2a] py-3 outline-none focus:border-[#C8A96E] transition"
                placeholder="Min 6 characters"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-xs uppercase text-gray-500 tracking-widest">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[#2a2a2a] py-3 outline-none focus:border-[#C8A96E] transition"
                placeholder="Confirm password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8A96E] text-black py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="text-center">
            <span
              onClick={() => router.push("/login")}
              className="text-sm text-gray-500 cursor-pointer hover:text-[#C8A96E] transition"
            >
              Remember your password? Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#C8A96E] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
