"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    toast.loading("Sending reset link...");

    try {
      const result = await api.forgotPassword(email);
      toast.dismiss();

      if (result.error) {
        toast.error(result.error);
      } else {
        setSubmitted(true);
        toast.success("Reset link sent! Check your email.");
      }
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

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
              Reset Your <br />
              <span className="bg-linear-to-r from-[#E6D2A4] to-[#C8A96E] text-transparent bg-clip-text">
                Password
              </span>
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed">
              {submitted
                ? "Check your email for a link to reset your password."
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs uppercase text-gray-500 tracking-widest">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-[#2a2a2a] py-3 outline-none focus:border-[#C8A96E] transition"
                  placeholder="your@email.com"
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl text-center">
                <div className="text-green-400 text-4xl mb-2">✓</div>
                <p className="text-green-400 text-sm">
                  If an account exists with this email, a reset link has been sent.
                </p>
              </div>

              <button
                onClick={() => router.push("/login")}
                className="w-full border border-gray-700 py-4 rounded-xl text-gray-400 hover:text-white transition"
              >
                Back to Login
              </button>
            </div>
          )}

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
