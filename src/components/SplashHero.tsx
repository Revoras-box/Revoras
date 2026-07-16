"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, Star, ShieldCheck, Sparkles } from "lucide-react";

const POPULAR = ["Haircut", "Hair Spa", "Facial", "Beard Trim", "Manicure", "Bridal"];

const COLLAGE = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800",
  "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=800",
];

export default function SplashHero() {
  const router = useRouter();
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (what.trim()) params.set("search", what.trim());
    if (where.trim()) params.set("location", where.trim());
    router.push(`/user/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Ambient brand glows */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto grid max-w-screen-2xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy + search */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Sparkles size={13} className="text-accent" />
            India&apos;s beauty &amp; wellness marketplace
          </span>

          <h1 className="mt-5 font-headline text-5xl font-extrabold leading-[1.05] tracking-tight text-on-surface md:text-6xl lg:text-7xl">
            Your best look
            <br />
            <span className="brand-gradient-text">starts here.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-secondary-foreground md:text-lg">
            Discover and book trusted salons, barbers, spas and beauty professionals near you — all in one beautiful place.
          </p>

          {/* Floating search */}
          <form
            onSubmit={submit}
            className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-floating sm:flex-row sm:items-center sm:rounded-full"
          >
            <label className="flex flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 sm:rounded-full">
              <Search size={18} className="shrink-0 text-muted" />
              <input
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="What are you looking for?"
                aria-label="Service, studio or professional"
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

          {/* Popular searches */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted">Popular:</span>
            {POPULAR.map((p) => (
              <Link
                key={p}
                href={`/user/search?search=${encodeURIComponent(p)}`}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {p}
              </Link>
            ))}
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-secondary-foreground">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-primary" />
              Verified studios
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Star size={16} className="text-accent" />
              Real customer reviews
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={16} className="text-primary" />
              Instant booking
            </span>
          </div>
        </div>

        {/* Right: image collage */}
        <div className="relative hidden lg:block">
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-10 flex flex-col gap-4">
              {COLLAGE.slice(0, 2).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- decorative hero imagery
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="aspect-[3/4] w-full rounded-3xl border border-border object-cover shadow-elevated"
                />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {COLLAGE.slice(2, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- decorative hero imagery
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="aspect-[3/4] w-full rounded-3xl border border-border object-cover shadow-elevated"
                />
              ))}
            </div>
          </div>
          {/* Floating rating chip */}
          <div className="absolute -bottom-4 left-6 flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 shadow-floating">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
              <Star size={16} className="fill-primary text-primary" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-on-surface">4.8 average</p>
              <p className="text-xs text-muted">across trusted studios</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
