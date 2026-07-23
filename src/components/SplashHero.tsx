"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight } from "lucide-react";

const POPULAR = ["Haircut", "Hair Spa", "Facial", "Beard Trim", "Manicure", "Bridal"];

/**
 * One full-bleed image instead of the old four-tile collage. The collage was
 * the most template-like thing on the page — a 2x2 of stock interiors reads as
 * filler on every marketplace homepage. A single editorial frame with the
 * headline set over it gives the fold one subject and one voice.
 *
 * `priority` because this is the LCP element; the unsplash host is already
 * allow-listed in next.config.mjs.
 */
const HERO_IMAGE = {
  src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2000",
  alt: "Barber chairs lined up in a modern studio",
};

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
    <section className="relative">
      {/* ---------------------------------------------------------------- */}
      {/* Frame: image + scrim + headline                                   */}
      {/* ---------------------------------------------------------------- */}
      {/* svh, not vh: on mobile browsers `vh` is measured against the viewport
          with the URL bar retracted, so a `78vh` hero overflowed the visible
          area on first paint and pushed the search card below the fold. */}
      <div className="relative flex min-h-[36rem] items-end overflow-hidden sm:min-h-[42rem] md:min-h-[84svh]">
        <Image
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Two scrims, not one. The vertical pass guarantees contrast for the
            headline sitting on the bottom edge; the horizontal pass keeps the
            left column dark enough on wide screens, where the image's own
            bright areas drift under the text. Both are fixed blacks rather
            than tokens — they darken a photograph, so they must not invert
            with the theme. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        <div className="grainy-overlay absolute inset-0" />

        {/* Everything over the photo is fixed white — `text-on-surface` flips
            to near-black in light theme and would vanish here. */}
        <div className="shell max-w-shell relative pb-20 pt-32 md:pb-28">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-xs">
              <span className="h-px w-8 bg-white/40" />
              India&apos;s beauty &amp; wellness marketplace
            </span>

            {/* Capped at 6rem rather than 7rem, and the vw term reduced: at 8vw
                the headline hit its ceiling by ~1200px and then sat unchanged
                across every larger screen, so the fold looked oversized on a
                laptop and undersized on a monitor. */}
            <h1 className="mt-6 font-headline text-[clamp(2.5rem,6.5vw,6rem)] font-extrabold leading-[0.94] tracking-[-0.03em] text-white">
              Your best look
              <br />
              starts <span className="font-light italic">here.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
              Discover and book trusted salons, barbers, spas and beauty professionals near you.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Search: straddles the frame's bottom edge                          */}
      {/* ---------------------------------------------------------------- */}
      {/* Pulled up with a negative margin rather than absolutely positioned,
          so the card still occupies layout height and can grow to two rows on
          mobile without overlapping whatever follows. */}
      <div className="shell max-w-shell relative z-10 -mt-10 md:-mt-12">
        {/* Held to the headline's measure instead of the full 1280px shell. A
            search bar stretched the entire width of a wide screen reads as a
            page-wide toolbar; at this width it stays a deliberate object and
            keeps its left edge on the same line as the hero copy above. */}
        <form
          onSubmit={submit}
          className="flex max-w-4xl flex-col gap-2 rounded-2xl border border-border bg-surface p-2 shadow-floating transition-shadow focus-within:border-primary/40 sm:flex-row sm:items-center"
        >
          <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Service, studio or professional"
              className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-muted"
            />
          </label>
          <span className="hidden h-7 w-px bg-border sm:block" />
          <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Search
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-5 flex max-w-4xl flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Popular</span>
          {POPULAR.map((p) => (
            <Link
              key={p}
              href={`/user/search?search=${encodeURIComponent(p)}`}
              className="text-sm text-secondary-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {p}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
