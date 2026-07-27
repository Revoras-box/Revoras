"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// const API = "https://api.revoras.tech/api";
const API = process.env.NEXT_PUBLIC_API_URL || "https://api.revoras.tech/api";


// Only allow same-app relative destinations (e.g. "/user/book?..."). Anything
// else — an absolute URL, a protocol-relative "//evil.com" — is ignored so the
// redirect param can never bounce a user off to another origin.
function safeRedirect(target) {
  if (!target) return null;
  if (!target.startsWith("/") || target.startsWith("//")) return null;
  return target;
}

export default function LoginHeroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Where to send the user once they're in. Set by the booking gate (AuthGate)
  // as `?redirect=`, defaulting to the customer home when they came here directly.
  const redirectTo = safeRedirect(searchParams.get("redirect")) || "/user";

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
        setSession(user, token);
        toast.success("Welcome back!");
        // The Google round-trip drops our query params, so the intended
        // destination was stashed before redirecting out (see handleGoogleLogin).
        const stashed = safeRedirect(sessionStorage.getItem("postLoginRedirect"));
        sessionStorage.removeItem("postLoginRedirect");
        router.push(stashed || "/");
      } catch (e) {
        toast.error("Failed to process login. Please try again.");
        router.replace("/login");
      }
    }
  }, [searchParams, router, setSession]);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    toast.loading("Signing in...");

    try {
      const res = await login(form.email, form.password);

      toast.dismiss();

      if (res.token) {
        toast.success("Welcome back!");
        router.push(redirectTo);
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
    // Stash the destination — the OAuth round-trip returns to /login without our
    // query, so we can't rely on the `redirect` param surviving it.
    if (redirectTo && redirectTo !== "/user") {
      sessionStorage.setItem("postLoginRedirect", redirectTo);
    }
    window.location.href = `${API}/auth/google`;
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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 sm:px-6 pt-24 pb-16 relative overflow-hidden">

      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-primary/10 blur-[140px] rounded-full" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-accent/10 blur-[140px] rounded-full" />

      {/* Split card */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 bg-card border border-border rounded-3xl overflow-hidden shadow-floating">

        {/* ── Left: brand panel ─────────────────────────────── */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 brand-banner overflow-hidden">
          <div className="grainy-overlay absolute inset-0" />

          <div className="relative">
            {/* Wordmark */}
            <div className="flex items-center gap-2 text-foreground">
              <div className="w-9 h-9 rounded-xl bg-foreground/10 border border-foreground/15 flex items-center justify-center font-headline font-bold">
                R
              </div>
              <span className="font-headline text-lg font-bold tracking-tight">Revoras</span>
            </div>
          </div>

          <div className="relative space-y-6">
            <div className="text-[11px] tracking-[0.35em] text-foreground/70 uppercase">
              Welcome Back
            </div>

            <h2 className="font-headline text-4xl xl:text-5xl font-bold leading-[1.05] text-foreground">
              Your digital
              <br />
              concierge awaits.
            </h2>

            <p className="text-foreground/70 text-sm leading-relaxed max-w-xs">
              Sign in to manage your bookings, discover elite studios, and
              pick up right where you left off.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Track upcoming appointments",
                "Rebook your favourites in one tap",
                "Exclusive member offers",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                  <span className="w-5 h-5 rounded-full bg-foreground/10 border border-foreground/15 flex items-center justify-center text-[11px]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex gap-8 text-xs text-foreground/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              Concierge Live
            </div>
            <div className="flex items-center gap-2">🔒 Encrypted</div>
          </div>
        </div>

        {/* ── Right: form panel ─────────────────────────────── */}
        <div className="p-8 sm:p-12">
          <div className="space-y-8 max-w-sm mx-auto">

            {/* Header (mobile-visible brand + heading) */}
            <div className="space-y-3">
              <div className="lg:hidden text-[11px] tracking-[0.35em] text-primary uppercase">
                Welcome Back
              </div>
              <h1 className="font-headline text-3xl font-bold leading-tight">
                Sign in to Revoras
              </h1>
              <p className="text-muted text-sm leading-relaxed">
                Enter your details to access your account.
              </p>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-surface border border-border text-foreground py-3.5 rounded-btn font-semibold hover:bg-surface-container transition disabled:opacity-50"
            >
              {googleLoading ? (
                <LoadingSpinner color="currentColor" />
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
              <div className="flex-1 h-px bg-border" />
              <div className="text-xs text-muted uppercase tracking-widest">or</div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form */}
            <div className="space-y-5">

              <div className="space-y-1.5">
                <label className="text-xs uppercase text-secondary-foreground tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-surface border border-border rounded-input px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || googleLoading}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="tracking-widest uppercase text-secondary-foreground">
                    Password
                  </label>
                  <span
                    className="text-primary cursor-pointer hover:opacity-80 font-medium"
                    onClick={() => router.push("/forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  className="w-full bg-surface border border-border rounded-input px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || googleLoading}
                />
              </div>

              <button
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-btn font-semibold hover:bg-primary-hover transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-soft"
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
            <div className="text-center text-sm text-secondary-foreground">
              New to Revoras?{" "}
              <span
                className="text-primary cursor-pointer hover:opacity-80 font-semibold"
                onClick={() =>
                  router.push(
                    redirectTo && redirectTo !== "/user"
                      ? `/signup/customer?redirect=${encodeURIComponent(redirectTo)}`
                      : "/signup/customer"
                  )
                }
              >
                Create an account
              </span>
            </div>

          </div>
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
