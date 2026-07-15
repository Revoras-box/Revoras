"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Mail, Phone, Store } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { businessApi, businessAuthStorage } from "@/lib/business/api";

type Phase = "details" | "email" | "phone" | "creating";

const VALUE_PROPS = [
  "Reach thousands of nearby customers",
  "Online bookings, calendar & reminders",
  "Your own business dashboard & insights",
  "No setup fee — go live in minutes",
];

const emailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export function HostSignup() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("details");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState({ email: "", phone: "" });
  const [devOtp, setDevOtp] = useState<{ email?: string; phone?: string }>({});
  const [verified, setVerified] = useState({ email: false, phone: false });

  const set = (key: keyof typeof form, v: string) => setForm((f) => ({ ...f, [key]: v }));

  const detailsValid =
    form.ownerName.trim() &&
    form.businessName.trim() &&
    emailValid(form.email) &&
    form.phone.trim().length >= 7 &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword;

  const startVerification = async () => {
    if (!detailsValid) {
      if (form.password !== form.confirmPassword) toast.error("Passwords don't match");
      else if (form.password.length < 6) toast.error("Password must be at least 6 characters");
      else toast.error("Please fill in all fields with a valid email and phone");
      return;
    }
    await sendCode("email");
  };

  const sendCode = async (type: "email" | "phone") => {
    setLoading(true);
    try {
      const payload = type === "email" ? { email: form.email, type } : { phone: form.phone, type };
      const result = await api.sendVerification(payload);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (result?.otp) setDevOtp((d) => ({ ...d, [type]: result.otp }));
      toast.success(`Verification code sent to your ${type}`);
      setPhase(type);
    } catch {
      toast.error("Couldn't send the verification code");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (type: "email" | "phone") => {
    const code = otp[type];
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const payload = type === "email" ? { email: form.email, type, otp: code } : { phone: form.phone, type, otp: code };
      const result = await api.verifyCode(payload);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      if (result?.verified) {
        setVerified((v) => ({ ...v, [type]: true }));
        if (type === "email") {
          toast.success("Email verified");
          await sendCode("phone");
        } else {
          toast.success("Phone verified");
          await register();
        }
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setPhase("creating");
    setLoading(true);
    try {
      const result = await businessApi.hostRegister({
        ownerName: form.ownerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        businessName: form.businessName.trim(),
      });
      businessAuthStorage.setSession(result);
      toast.success("Welcome to Revoras! Let's set up your business.");
      router.push("/business/onboarding");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Signup failed. Please try again.");
      setPhase("phone");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = phase === "details" ? 0 : phase === "email" ? 1 : 2;

  return (
    <section className="flex flex-1 items-stretch bg-background px-6 py-16">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2">
        {/* Brand / value panel */}
        <div className="hidden flex-col gap-8 lg:flex">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Revoras for Business</p>
            <h1 className="mt-3 font-headline text-4xl font-semibold leading-tight text-foreground">
              List your business.
              <br />
              Grow with <span className="text-primary">Revoras.</span>
            </h1>
            <p className="mt-4 max-w-md text-muted">
              Create your host account and complete a guided setup — your progress saves as you go.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {VALUE_PROPS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Check size={16} />
                </span>
                <span className="text-sm text-secondary-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Form card */}
        <div className="w-full rounded-3xl border border-border bg-card p-7 shadow-floating sm:p-9">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Store size={20} />
            </span>
            <div>
              <h2 className="font-headline text-lg font-semibold text-foreground">Create your host account</h2>
              <p className="text-xs text-muted">Step {stepIndex + 1} of 3</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="mb-7 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-primary" : "bg-surface-container-high"}`}
              />
            ))}
          </div>

          {phase === "details" && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Your name" value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} placeholder="Full name" />
                <Input label="Business name" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} placeholder="e.g. Luxe Studio" />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@business.com" />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91…" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Password" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 6 characters" />
                <Input
                  label="Confirm password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  error={form.confirmPassword && form.password !== form.confirmPassword ? "Passwords don't match" : undefined}
                />
              </div>
              <Button className="mt-2" onClick={startVerification} loading={loading} disabled={!detailsValid}>
                Continue <ArrowRight size={18} />
              </Button>
            </div>
          )}

          {(phase === "email" || phase === "phone") && (
            <OtpStep
              type={phase}
              target={phase === "email" ? form.email : form.phone}
              value={otp[phase]}
              devCode={devOtp[phase]}
              loading={loading}
              onChange={(v) => setOtp((o) => ({ ...o, [phase]: v }))}
              onVerify={() => verify(phase)}
              onResend={() => sendCode(phase)}
              onBack={() => setPhase("details")}
              emailDone={verified.email}
            />
          )}

          {phase === "creating" && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm text-muted">Creating your business…</p>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login-barber" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function OtpStep({
  type,
  target,
  value,
  devCode,
  loading,
  onChange,
  onVerify,
  onResend,
  onBack,
  emailDone,
}: {
  type: "email" | "phone";
  target: string;
  value: string;
  devCode?: string;
  loading: boolean;
  onChange: (v: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
  emailDone: boolean;
}) {
  const Icon = type === "email" ? Mail : Phone;
  return (
    <div className="flex flex-col gap-4">
      {type === "phone" && emailDone ? (
        <div className="flex items-center gap-2 text-sm text-primary">
          <Check size={16} /> Email verified
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={20} />
        </span>
        <div>
          <h3 className="font-headline text-base font-semibold text-foreground">Verify your {type}</h3>
          <p className="text-xs text-muted">Enter the 6-digit code sent to {target}</p>
        </div>
      </div>

      {devCode ? (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
          Dev code: <span className="font-semibold">{devCode}</span>
        </div>
      ) : null}

      <Input
        label="6-digit code"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
      />

      <Button onClick={onVerify} loading={loading} disabled={value.length !== 6}>
        Verify {type} <ArrowRight size={18} />
      </Button>

      <div className="flex items-center justify-between text-sm">
        <button className="inline-flex items-center gap-1 text-muted hover:text-foreground" onClick={onBack} disabled={loading}>
          <ArrowLeft size={14} /> Back
        </button>
        <button className="font-medium text-primary hover:underline" onClick={onResend} disabled={loading}>
          Resend code
        </button>
      </div>
    </div>
  );
}
