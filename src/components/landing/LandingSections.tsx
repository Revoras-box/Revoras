"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Store,
  ShieldCheck,
  CreditCard,
  Star,
  CalendarClock,
} from "lucide-react";
import { Skeleton } from "@/components/ui";
import { useCategories, useBusinesses } from "@/lib/hooks";
import type { Business } from "@/lib/types";

/**
 * The landing page is laid out as an editorial spread rather than a stack of
 * centred cards: every section leads with a small numbered eyebrow, a hairline
 * rule, and a left-aligned display heading. `SectionHead` is that masthead.
 *
 * The old version alternated background tones to separate sections. This one
 * separates them with rules and rhythm instead — banded backgrounds are the
 * single most template-like device on a marketplace homepage, and with seven
 * sections they produced a visible zebra stripe.
 */
function SectionHead({
  index,
  title,
  subtitle,
  action,
}: {
  index: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 border-t border-border pt-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">{index}</span>
          <h2 className="mt-3 font-headline text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-on-surface md:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="mt-3 max-w-md text-sm leading-relaxed text-secondary-foreground md:text-base">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

const SHELL = "mx-auto max-w-screen-2xl px-5 md:px-8";

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
/* ------------------------------------------------------------------ */

const MARQUEE_ITEMS = [
  "Haircut",
  "Hair Colour",
  "Hair Spa",
  "Facial",
  "Beard Trim",
  "Manicure",
  "Pedicure",
  "Massage",
  "Bridal",
  "Threading",
  "Waxing",
  "Skin Care",
];

/**
 * The band directly under the hero. It replaces a row of icon+label trust
 * chips, which is the exact component every competitor ships in that slot.
 * These are service names, not claims, so it makes no promises the product
 * can't keep — the credibility work happens in `TrustBand` below.
 *
 * The track is duplicated and the keyframe shifts exactly -50%, so the loop is
 * seamless; `aria-hidden` on the second copy keeps it out of the a11y tree.
 */
export function ServiceMarquee() {
  const track = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="inline-flex items-center gap-10">
          <span className="font-headline text-lg font-bold uppercase tracking-[0.06em] text-on-surface/70 md:text-2xl">
            {item}
          </span>
          <Sparkles size={14} className="shrink-0 text-primary" />
        </span>
      ))}
    </div>
  );

  return (
    <div className="mt-20 overflow-hidden border-y border-border py-5 md:mt-28">
      {/* w-max so the two tracks lay out side by side at natural width — a -50%
          shift only lands seamlessly if the wrapper is exactly both copies. */}
      <div className="flex w-max animate-[marquee-drift_38s_linear_infinite]">
        {track}
        <div aria-hidden>{track}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Trust                                                               */
/* ------------------------------------------------------------------ */

/**
 * Every line here maps to a feature that actually ships — this section exists
 * to answer "can I trust this?", so inventing numbers or claims would defeat
 * its purpose. No stats, no testimonials, no partner logos.
 */
const TRUST_POINTS = [
  { icon: ShieldCheck, title: "Verified businesses", body: "Studios are reviewed and verified before they can take bookings." },
  { icon: Star, title: "Ratings you can read", body: "See a studio's rating, reviews and photos before you commit." },
  { icon: CreditCard, title: "Secure payments", body: "Card, UPI and netbanking, handled end to end by Razorpay." },
  { icon: CalendarClock, title: "Plans change", body: "Reschedule or cancel from My Bookings, right up to the cutoff." },
];

export function TrustBand() {
  return (
    <section className={`${SHELL} py-20 md:py-28`}>
      <SectionHead index="01 — Why Revoras" title="Booking you don't have to second-guess." />
      {/* Vertical rules between columns rather than four boxed cards: the
          content is a set of related claims, not four separate objects. */}
      <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_POINTS.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className={`px-0 sm:px-8 ${i === 0 ? "sm:pl-0" : "sm:border-l sm:border-border"} ${
              i === 2 ? "lg:border-l lg:border-border" : ""
            }`}
          >
            <Icon size={22} className="text-primary" />
            <h3 className="mt-4 font-headline text-base font-bold text-on-surface">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

/**
 * An editorial index — numbered rows with a hairline between them — rather
 * than a wrap of pill chips. Chips read as filter UI; on a landing page this
 * is a table of contents, and rows give each category room to be a real link
 * target.
 *
 * Owns its own fetch rather than delegating to CategoryRail: the rail renders
 * `null` when there are no categories, which used to leave the heading
 * stranded above empty space. The heading now lives or dies with its content.
 */
export function LandingCategories() {
  const router = useRouter();
  const { data, loading } = useCategories("business");
  const categories = data?.categories ?? [];

  if (!loading && categories.length === 0) return null;

  return (
    <section className={`${SHELL} py-20 md:py-28`}>
      <SectionHead
        index="02 — Categories"
        title="Browse by category."
        subtitle="Find exactly the kind of care you're after."
      />
      {loading ? (
        <div className="grid gap-x-16 md:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="mb-px h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-x-16 md:grid-cols-2">
          {categories.map((category, i) => (
            <button
              key={category.id}
              onClick={() => router.push(`/user/search?categoryId=${category.id}`)}
              className="group flex items-center justify-between gap-4 border-b border-border py-5 text-left transition-colors hover:border-primary"
            >
              <span className="flex min-w-0 items-baseline gap-5">
                <span className="shrink-0 font-headline text-xs font-bold tabular-nums text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate font-headline text-xl font-bold text-on-surface transition-colors group-hover:text-primary md:text-2xl">
                  {category.name}
                </span>
              </span>
              <ArrowUpRight
                size={20}
                className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Featured                                                            */
/* ------------------------------------------------------------------ */

function ratingOf(b: Business): string | null {
  // `rating` arrives as a pg decimal, which the driver hands back as a string.
  const n = b.rating ? Number(b.rating) : 0;
  return n > 0 ? n.toFixed(1) : null;
}

/** The lead studio — one large frame with the name set over the photo. */
function LeadStudio({ business, wide }: { business: Business; wide: boolean }) {
  const rating = ratingOf(business);
  return (
    <Link
      href={`/user/business/${business.id}`}
      className={`group relative block overflow-hidden rounded-3xl border border-border ${
        wide ? "aspect-[16/10]" : "aspect-[4/5] lg:aspect-auto lg:h-full"
      }`}
    >
      {business.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos, same as BusinessCard
        <img
          src={business.image_url}
          alt={business.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-container-low" />
      )}
      {/* Fixed black scrim + white text: this sits on a photograph, so it must
          not invert with the theme. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
          {business.category_name ?? "Studio"}
        </span>
        <h3 className="mt-2 font-headline text-2xl font-extrabold leading-tight text-white md:text-4xl">
          {business.name}
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
          {rating && (
            <span className="inline-flex items-center gap-1.5">
              <Star size={14} className="fill-current text-primary" />
              {rating}
              <span className="text-white/55">({business.review_count})</span>
            </span>
          )}
          {business.city && <span className="text-white/70">{business.city}</span>}
        </div>
      </div>
    </Link>
  );
}

/** A supporting studio — thumbnail row, stretched to share the lead's height. */
function StudioRow({ business }: { business: Business }) {
  const rating = ratingOf(business);
  return (
    <Link
      href={`/user/business/${business.id}`}
      className="group flex flex-1 items-center gap-4 border-b border-border py-4 transition-colors last:border-b-0 hover:border-primary"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border md:h-20 md:w-20">
        {business.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos, same as BusinessCard
          <img src={business.image_url} alt={business.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-surface-container-low" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-headline text-base font-bold text-on-surface transition-colors group-hover:text-primary md:text-lg">
          {business.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-secondary-foreground">
          <span>{business.category_name ?? "Studio"}</span>
          {rating && (
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="fill-current text-primary" />
              {rating} ({business.review_count})
            </span>
          )}
        </div>
      </div>
      <ArrowUpRight
        size={18}
        className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
      />
    </Link>
  );
}

/**
 * Deliberately NOT built on BusinessRailGrid. That grid is a fixed
 * `md:grid-cols-4`, so with the two featured studios the dev DB actually has,
 * it left half the row as dead space — the single worst-looking thing on the
 * page. This layout is asymmetric by design: one lead frame plus a stretched
 * list, which composes correctly at 1, 2, 3 or 5 studios instead of only at 4.
 * The grid is still right for the /user discover pages, so it's left alone.
 */
export function FeaturedStudios() {
  const { data, loading } = useBusinesses({ limit: "5", sortBy: "recommended", featuredOnly: "true" });
  const businesses = data?.businesses ?? [];

  // A section whose entire content is "nothing yet" is worse than no section.
  if (!loading && businesses.length === 0) return null;

  const [lead, ...rest] = businesses;

  return (
    <section className={`${SHELL} py-20 md:py-28`}>
      <SectionHead
        index="03 — Featured"
        title="Studios worth the trip."
        subtitle="Hand-picked places our customers keep going back to."
        action={
          <Link
            href="/user/search?featuredOnly=true"
            className="inline-flex items-center gap-1.5 border-b border-primary pb-1 text-sm font-semibold text-primary"
          >
            See all <ArrowRight size={15} />
          </Link>
        }
      />

      {loading ? (
        <div className="grid gap-8 lg:grid-cols-5">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl lg:col-span-3" />
          <div className="flex flex-col gap-4 lg:col-span-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : rest.length === 0 ? (
        /* One featured studio: a lone tall frame beside an empty column would
           read as a broken layout, so it goes full width and wide instead. */
        <LeadStudio business={lead} wide />
      ) : (
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="lg:col-span-3">
            <LeadStudio business={lead} wide={false} />
          </div>
          {/* flex-1 on each row stretches the list to the lead frame's height,
              so two studios fill the column as convincingly as four. */}
          <div className="flex flex-col lg:col-span-2">
            {rest.map((b) => (
              <StudioRow key={b.id} business={b} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  { icon: Search, title: "Discover", body: "Search salons, spas and pros near you, filtered by service, rating and offers." },
  { icon: CalendarCheck, title: "Book", body: "Pick a time that works, see live prices and any deals, and confirm in seconds." },
  { icon: Sparkles, title: "Enjoy", body: "Walk in fresh. Rate your visit and save your favorites for next time." },
];

/**
 * Three numbered columns on a shared top rule, not three bordered cards. The
 * oversized numeral carries the sequence, so the step doesn't need a box to
 * read as a discrete thing.
 */
export function HowItWorks() {
  return (
    <section className={`${SHELL} py-20 md:py-28`}>
      <SectionHead index="04 — How it works" title="Three steps from scrolling to your seat." />
      <div className="grid gap-12 md:grid-cols-3 md:gap-8">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className={`md:px-8 ${i === 0 ? "md:pl-0" : "md:border-l md:border-border"}`}>
            <div className="flex items-center gap-4">
              <span className="font-headline text-6xl font-extrabold leading-none tracking-tight text-primary/25 md:text-7xl">
                {i + 1}
              </span>
              <Icon size={24} className="text-primary" />
            </div>
            <h3 className="mt-5 font-headline text-xl font-bold text-on-surface md:text-2xl">{title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-secondary-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

/* Native <details>/<summary>: keyboard-operable and open-by-find-in-page for
   free, no client state, and it still works if hydration fails. */
const FAQS = [
  {
    q: "Does it cost anything to book?",
    a: "No. Browsing and booking on Revoras is free for customers — you only pay for the service itself, either online at checkout or at the studio.",
  },
  {
    q: "How do I know a studio is genuine?",
    a: "Businesses are verified before they can take bookings, and every listing shows its rating, reviews and photos so you can judge for yourself.",
  },
  {
    q: "Can I reschedule or cancel?",
    a: "Yes. Head to My Bookings and change or cancel your appointment up until the studio's cutoff time. Anything you paid online is refunded per the studio's policy.",
  },
  {
    q: "Are my payments secure?",
    a: "Payments run through Razorpay, which handles cards, UPI and netbanking. Revoras never sees or stores your card details.",
  },
  {
    q: "I run a salon — how do I get listed?",
    a: "Create a business account, add your services, team and photos, and submit for verification. Once you're approved your listing goes live and can start taking bookings.",
  },
];

/**
 * Heading on the left, answers on the right, on hairlines rather than inside a
 * card. Named span columns, not an arbitrary grid-cols-[..] track list — those
 * can silently no-op under Tailwind v4 in this project.
 */
export function LandingFaq() {
  return (
    <section className={`${SHELL} py-20 md:py-28`}>
      <div className="grid gap-10 border-t border-border pt-6 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <span className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-primary">05 — FAQ</span>
          <h2 className="mt-3 font-headline text-3xl font-extrabold leading-[1.05] tracking-[-0.02em] text-on-surface md:text-5xl">
            Common questions.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-secondary-foreground md:text-base">
            The things people ask us most.
          </p>
        </div>

        <div className="lg:col-span-3">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-headline text-base font-bold text-on-surface transition-colors hover:text-primary md:text-lg">
                {q}
                {/* A rotating plus, not a chevron — the chevron accordion is the
                    stock pattern this page is moving away from. */}
                <span className="relative h-4 w-4 shrink-0 text-muted transition-transform duration-(--duration-base) ease-(--ease-out) group-open:rotate-[135deg]">
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                  <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <p className="max-w-xl pb-5 text-sm leading-relaxed text-secondary-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Become a host                                                       */
/* ------------------------------------------------------------------ */

const HOST_POINTS = ["Bookings around the clock", "Your own dashboard and calendar", "Reach customers already searching"];

/**
 * Full-bleed rather than an inset rounded banner. It's the page's last beat and
 * the only section addressed to a different audience, so it gets to break the
 * measure that every section above shares.
 */
export function BecomeHost() {
  return (
    <section className="brand-banner relative mt-8 overflow-hidden">
      <div className="grainy-overlay absolute inset-0" />
      <div className={`${SHELL} relative py-20 md:py-28`}>
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <Store size={13} />
              For business owners
            </span>
            <h2 className="mt-5 font-headline text-4xl font-extrabold leading-[1.02] tracking-[-0.02em] md:text-6xl">
              Grow your studio
              <br />
              on Revoras.
            </h2>
            <ul className="mt-8 flex flex-col gap-2.5 text-sm text-white/85">
              {HOST_POINTS.map((point) => (
                <li key={point} className="inline-flex items-center gap-2.5">
                  <ShieldCheck size={15} className="shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/host/signup"
            // bg-white is a fixed colour, so its label must be a fixed dark one.
            // `text-on-surface` is near-white in dark → the label vanished.
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#0B0B0D] shadow-floating transition-transform hover:-translate-y-0.5"
          >
            List your business
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
