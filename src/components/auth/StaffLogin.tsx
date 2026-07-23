"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useBusinessAuth } from "@/lib/business/auth";
import { resolveLandingPath } from "@/lib/business/resolveLandingPath";

export default function StaffLogin() {
  const router = useRouter();
  const { login } = useBusinessAuth();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    identifier: "",
    password: "",
    remember: false,
  });

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleLogin = async () => {
    // Autofill sometimes fills only the password (a saved-password suggestion
    // with no matching username), leaving this field visibly empty - a toast
    // alone is easy to miss, so the message also stays inline on the page.
    if (!form.identifier || !form.password) {
      const message = "Please fill in phone/email and password";
      setFormError(message);
      toast.error(message);
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identifier);
    const digitsOnly = form.identifier.replace(/\D/g, '');
    const isValidPhone = digitsOnly.length >= 7 && digitsOnly.length <= 15;

    if (!isValidEmail && !isValidPhone) {
      const message = "Please enter a valid email address or phone number";
      setFormError(message);
      toast.error(message);
      return;
    }

    setFormError(null);
    setLoading(true);
    toast.loading("Authenticating...");

    try {
      const { error, memberships } = await login({
        ...(isValidEmail ? { email: form.identifier } : { phone: form.identifier }),
        password: form.password,
      });

      toast.dismiss();

      if (!error) {
        toast.success("Welcome back!");
        window.location.href = resolveLandingPath(memberships ?? [], null);
      } else if (error === "Account not found" || error === "Not found") {
        const message = "No account found with those details. Check for typos, or ask your business owner to re-send your invite.";
        setFormError(message);
        toast.error(message);
      } else if (error === "Invalid credentials" || error === "Invalid") {
        const message = "Invalid credentials. Please try again.";
        setFormError(message);
        toast.error(message);
      } else {
        const message = error || "Login failed. Please try again.";
        setFormError(message);
        toast.error(message);
      }
    } catch {
      toast.dismiss();
      const message = "Something went wrong. Please try again.";
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-175 h-175 bg-primary-container/10 blur-[140px] rounded-full" />

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Section */}
        <div className="space-y-8">

          <div className="text-xs tracking-[0.35em] text-primary uppercase">
            Team Portal
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            See Your <br />
            <span className="text-primary">Schedule.</span>
          </h1>

          <p className="text-muted max-w-lg">
            Sign in to see your appointments, manage your day, and keep your profile up to date.
          </p>

        </div>



        {/* Login Card */}
        <div className="bg-card border border-border rounded-3xl p-10 backdrop-blur-xl shadow-floating">

          <div className="space-y-8">

            <div>
              <h2 className="text-2xl font-semibold">
                Team Login
              </h2>

              <p className="text-muted text-sm">
                Welcome back to Revoras. Enter your credentials.
              </p>
            </div>

            <div className="space-y-6">

              <div>
                <label className="text-xs uppercase text-secondary-foreground">
                  Phone Number or Email Address
                </label>

                <input
                  className="w-full bg-transparent border-b border-border py-3 outline-none focus:border-primary transition"
                  placeholder="Enter your phone number or email address"
                  name="identifier"
                  autoComplete="username"
                  value={form.identifier}
                  onChange={(e) => updateField("identifier", e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>


              <div>
                <label className="text-xs uppercase text-secondary-foreground">
                  Password
                </label>

                <input
                  type="password"
                  className="w-full bg-transparent border-b border-border py-3 outline-none focus:border-primary transition"
                  placeholder="••••••••"
                  name="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              {formError ? (
                <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
                  {formError}
                </p>
              ) : null}

              <div className="flex justify-between text-sm">

                <label className="flex gap-2 text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => updateField("remember", e.target.checked)}
                    className="accent-primary"
                    disabled={loading}
                  />
                  Remember me
                </label>

                <span className="text-primary cursor-pointer">
                  Forgot?
                </span>

              </div>


              <button
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Authenticating...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </button>

            </div>


            <div className="text-center text-sm text-muted">
              Business owner?
              <span
                className="text-primary ml-2 cursor-pointer"
                onClick={() => router.push("/login-barber")}
              >
                Log in here →
              </span>
            </div>

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
