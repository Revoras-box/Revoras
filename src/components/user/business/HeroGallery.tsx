"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";

/**
 * Airbnb-style hero mosaic for the business detail page. The layout adapts to
 * how many photos the studio actually has (1 fills the frame, 2 split it, 3+
 * become the big-plus-two mosaic) so an empty slot never shows a placeholder
 * next to real photos. With `href` set, every tile and the count badge link to
 * the all-photos page. A studio with no photos falls back to a branded gold
 * wash + monogram (not clickable).
 */
function Tile({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-surface-container-high ${className ?? ""}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/12 via-surface-container to-accent/12">
          <span aria-hidden className="select-none font-headline text-6xl font-extrabold text-on-surface/12">
            {(name?.trim()?.charAt(0) ?? "R").toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}

export default function HeroGallery({
  name,
  images,
  href,
}: {
  name: string;
  images: (string | null | undefined)[];
  /** When set, tiles and the count badge link here (the all-photos page). */
  href?: string;
}) {
  const imgs = images.filter(Boolean) as string[];
  const total = imgs.length;

  // A single tile: a link to the all-photos page when href is set, otherwise a
  // plain wrapper. `group` drives the hover zoom on the image inside.
  const cell = (src: string, key: number) =>
    href ? (
      <Link
        key={key}
        href={href}
        aria-label={`View all ${total} photos`}
        className="group relative block h-full w-full overflow-hidden"
      >
        <Tile src={src} name={name} />
      </Link>
    ) : (
      <div key={key} className="relative h-full w-full overflow-hidden">
        <Tile src={src} name={name} />
      </div>
    );

  // No photos yet: keep the branded placeholder, non-interactive.
  if (total === 0) {
    return (
      <div className="relative h-[280px] w-full overflow-hidden rounded-3xl md:h-[420px]">
        <Tile src={null} name={name} className="h-full" />
      </div>
    );
  }

  const badge =
    href != null ? (
      <Link
        href={href}
        className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3.5 py-2 text-xs font-semibold text-on-surface shadow-soft backdrop-blur-sm transition-colors hover:bg-surface"
      >
        <ImageIcon size={14} />
        {total} photo{total === 1 ? "" : "s"}
      </Link>
    ) : (
      <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3.5 py-2 text-xs font-semibold text-on-surface shadow-soft backdrop-blur-sm">
        <ImageIcon size={14} />
        {total} photo{total === 1 ? "" : "s"}
      </span>
    );

  // One photo fills the whole frame.
  if (total === 1) {
    return (
      <div className="relative h-[280px] w-full overflow-hidden rounded-3xl md:h-[420px]">
        {cell(imgs[0], 0)}
        {badge}
      </div>
    );
  }

  // Two or more photos share the dominant-hero mosaic: a large 2/3-width cover
  // photo leads, with the rest as smaller accents on the right third. This
  // keeps the cover prominent and the layout consistent regardless of count
  // (and downplays a weaker secondary shot instead of giving it equal weight).
  // On mobile the grid collapses to a single column showing just the cover.
  return (
    <div className="relative grid h-[280px] grid-cols-1 gap-2 overflow-hidden rounded-3xl md:h-[420px] md:grid-cols-[2fr_1fr]">
      {cell(imgs[0], 0)}
      {total === 2 ? (
        <div className="hidden h-full md:block">{cell(imgs[1], 1)}</div>
      ) : (
        <div className="hidden grid-rows-2 gap-2 md:grid">
          {cell(imgs[1], 1)}
          {cell(imgs[2], 2)}
        </div>
      )}
      {badge}
    </div>
  );
}
