"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarHeart, Store, ArrowRight, Check } from "lucide-react";

type Choice = "customer" | "host";

const OPTIONS: {
  value: Choice;
  icon: typeof Store;
  title: string;
  subtitle: string;
  perks: string[];
}[] = [
  {
    value: "customer",
    icon: CalendarHeart,
    title: "I want to book services",
    subtitle: "Find and book salons, spas and professionals near you.",
    perks: ["Discover top-rated businesses", "Book in seconds", "Manage your appointments"],
  },
  {
    value: "host",
    icon: Store,
    title: "I want to list my business",
    subtitle: "Grow your salon or studio with Revoras.",
    perks: ["Reach new customers", "Online bookings & calendar", "Dashboard & insights"],
  },
];

export function AccountTypeSelector() {
  const router = useRouter();
  const [choice, setChoice] = useState<Choice>("customer");

  const handleContinue = () => {
    router.push(choice === "host" ? "/host/signup" : "/signup/customer");
  };

  return (
    <section className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Join Revoras</p>
          <h1 className="mt-3 font-headline text-3xl font-semibold text-foreground sm:text-4xl">Create your Revoras account</h1>
          <p className="mt-3 text-muted">How do you want to use Revoras? You can always do both later.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = choice === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setChoice(opt.value)}
                aria-pressed={selected}
                className={`group relative flex flex-col rounded-2xl border p-6 text-left transition-all ${
                  selected
                    ? "border-primary bg-primary/5 shadow-floating"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/5"
                }`}
              >
                <span
                  className={`absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    selected ? "border-primary bg-primary text-on-primary" : "border-border"
                  }`}
                >
                  {selected ? <Check size={12} /> : null}
                </span>

                <span
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    selected ? "bg-primary text-on-primary" : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={24} />
                </span>

                <h2 className="font-headline text-lg font-semibold text-foreground">{opt.title}</h2>
                <p className="mt-1.5 text-sm text-muted">{opt.subtitle}</p>

                <ul className="mt-4 flex flex-col gap-2">
                  {opt.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-secondary-foreground">
                      <Check size={14} className="text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleContinue}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
          >
            Continue
            <ArrowRight size={18} />
          </button>
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
