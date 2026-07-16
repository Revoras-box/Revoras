"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

const QUICK = ["Haircut", "Facial", "Hair Spa", "Manicure", "Bridal"];

export default function HomeHero() {
  const router = useRouter();
  const { user } = useAuth();
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");

  const firstName = user?.name?.split(" ")[0];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (what.trim()) params.set("search", what.trim());
    if (where.trim()) params.set("location", where.trim());
    router.push(`/user/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-soft md:p-9">
      {/* Brand glow */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles size={13} className="text-accent" />
          {firstName ? "Good to see you again" : "Discover near you"}
        </span>

        <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
          {firstName ? (
            <>
              Welcome back, <span className="brand-gradient-text">{firstName}</span>
            </>
          ) : (
            <>
              Find your next <span className="brand-gradient-text">appointment</span>
            </>
          )}
        </h1>
        <p className="mt-1.5 text-sm text-secondary-foreground md:text-base">
          Search trusted salons, barbers, spas and beauty pros near you.
        </p>

        {/* Search */}
        <form
          onSubmit={submit}
          className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-soft sm:flex-row sm:items-center sm:rounded-full"
        >
          <label className="flex flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 sm:rounded-full">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="Search studios, services or professionals"
              aria-label="Search"
              className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-muted"
            />
          </label>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <label className="flex flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 sm:rounded-full">
            <MapPin size={18} className="shrink-0 text-muted" />
            <input
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="Location"
              aria-label="Location"
              className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-muted"
            />
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <Search size={16} />
            Search
          </button>
        </form>

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {QUICK.map((q) => (
            <Link
              key={q}
              href={`/user/search?search=${encodeURIComponent(q)}`}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
