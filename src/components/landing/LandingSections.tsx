"use client";

import Link from "next/link";
import { Search, CalendarCheck, Sparkles, ArrowRight, Store } from "lucide-react";
import DiscoveryRail from "@/components/user/sections/DiscoveryRail";
import CategoryRail from "@/components/user/sections/CategoryRail";

function SectionShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-screen-2xl px-5 py-10 md:px-8 md:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-secondary-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function LandingCategories() {
  return (
    <SectionShell title="Browse by category" subtitle="Find exactly the kind of care you're after.">
      <CategoryRail />
    </SectionShell>
  );
}

export function FeaturedStudios() {
  return (
    <SectionShell
      title="Featured on Revoras"
      subtitle="Hand-picked studios our customers love."
      action={
        <Link
          href="/user/search?featuredOnly=true"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          See all <ArrowRight size={15} />
        </Link>
      }
    >
      <DiscoveryRail
        params={{ sortBy: "recommended", featuredOnly: "true" }}
        emptyTitle="Nothing featured yet"
        emptyDescription="Check back soon — new studios are joining every week."
      />
    </SectionShell>
  );
}

const STEPS = [
  { icon: Search, title: "Discover", body: "Search salons, spas and pros near you, filtered by service, rating and offers." },
  { icon: CalendarCheck, title: "Book", body: "Pick a time that works, see live prices and any deals, and confirm in seconds." },
  { icon: Sparkles, title: "Enjoy", body: "Walk in fresh. Rate your visit and save your favorites for next time." },
];

export function HowItWorks() {
  return (
    <SectionShell title="How Revoras works" subtitle="Three steps from scrolling to your seat.">
      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
            <span className="absolute right-5 top-5 font-headline text-4xl font-extrabold text-surface-container-highest">
              {i + 1}
            </span>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">{title}</h3>
            <p className="mt-1.5 text-sm text-secondary-foreground">{body}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function BecomeHost() {
  return (
    <section className="mx-auto max-w-screen-2xl px-5 py-10 md:px-8 md:py-14">
      <div className="brand-gradient relative overflow-hidden rounded-3xl px-6 py-12 md:px-14 md:py-16">
        <div className="grainy-overlay absolute inset-0" />
        <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Store size={13} />
              For business owners
            </span>
            <h2 className="mt-4 font-headline text-3xl font-extrabold leading-tight md:text-4xl">
              Grow your studio on Revoras.
            </h2>
            <p className="mt-3 text-white/85">
              List your salon, spa or barbershop, take bookings around the clock, and reach new customers looking for exactly what you offer.
            </p>
          </div>
          <Link
            href="/host/signup"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-on-surface shadow-floating transition-transform hover:-translate-y-0.5"
          >
            List your business
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
