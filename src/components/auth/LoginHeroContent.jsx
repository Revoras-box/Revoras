"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api";

export default function LoginHeroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "google_auth_failed") {
      toast.error("Google authentication failed. Please try again.");
      router.replace("/login");
    }
  }, [searchParams, router]);

  useEffect(() => {
    const token = searchParams.get("token");
    const userData = searchParams.get("user");

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("userToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Welcome back!");
        router.push("/");
      } catch (e) {
        toast.error("Failed to process login. Please try again.");
        router.replace("/login");
      }
    }
  }, [searchParams, router]);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    toast.loading("Signing in...");

    try {
      const res = await api.userLogin({
        email: form.email,
        password: form.password,
      });

      toast.dismiss();

      if (res.token) {
        localStorage.setItem("userToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        toast.success("Welcome back!");
        router.push("/user");
      } else if (res === "User not found") {
        toast.error("User not found. Please check your credentials.");
      } else if (res === "Invalid credentials") {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error(res.error || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    toast.loading("Redirecting to Google...");
    window.location.href = `${API_URL}/auth/google`;
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && !googleLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center px-6 relative py-20 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-150 h-150 bg-[#C8A96E]/10 blur-[120px] rounded-full"></div>


      {/* Center Card */}
      <div className="relative w-full max-w-md bg-[#0b0b0b] border border-white/5 rounded-3xl p-10 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)]">

        <div className="space-y-8">

          {/* Header */}
          <div className="space-y-4">

            <div className="text-[11px] tracking-[0.35em] text-[#C8A96E] uppercase">
              Welcome Back
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              The Digital <br />

              <span className="bg-linear-to-r from-[#E6D2A4] to-[#C8A96E] text-transparent bg-clip-text">
                Concierge
              </span>

            </h1>

            <p className="text-gray-400 text-sm leading-relaxed">
              Access your grooming profile and manage your
              upcoming elite experiences.
            </p>

          </div>


          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            {googleLoading ? (
              <LoadingSpinner color="#000" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>


          {/* Divider */}
          <div className="flex items-center gap-4">

            <div className="flex-1 h-px bg-[#1a1a1a]" />

            <div className="text-xs text-gray-500 uppercase tracking-widest">
              or
            </div>

            <div className="flex-1 h-px bg-[#1a1a1a]" />

          </div>


          {/* Form */}
          <div className="space-y-8">

            <div>
              <label className="text-xs uppercase text-gray-500 tracking-widest">
                Email
              </label>

              <input
                className="w-full bg-transparent border-b border-[#2a2a2a] py-3 outline-none focus:border-[#C8A96E] transition"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || googleLoading}
              />
            </div>


            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className="tracking-widest uppercase">
                  Password
                </span>

                <span 
                  className="text-[#C8A96E] cursor-pointer hover:opacity-80"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot Password?
                </span>
              </div>

              <input
                type="password"
                className="w-full bg-transparent border-b border-[#2a2a2a] py-3 outline-none focus:border-[#C8A96E] transition"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || googleLoading}
              />
            </div>


            <button 
              className="w-full bg-linear-to-r from-[#E6D2A4] to-[#C8A96E] text-black py-4 rounded-xl font-semibold mt-4 hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2" 
              onClick={handleLogin}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

          </div>



          {/* Create Account */}
          <div className="text-center text-xs text-gray-500">

            New to the studio?{" "}
            <span
              className="text-[#C8A96E] cursor-pointer hover:opacity-80"
              onClick={() => router.push("/signup")}
            >
              Create an Account
            </span>

          </div>

        </div>

      </div>



      {/* Bottom Status */}
      <div className="absolute bottom-10 flex gap-16 text-xs text-gray-500">

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Concierge Live
        </div>

        <div className="flex items-center gap-2">
          🔒 Encrypted Connection
        </div>

      </div>

    </div>
  );
}

function LoadingSpinner({ color = "#fff" }) {
  return (
    <svg className="animate-spin h-5 w-5" style={{ color }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
