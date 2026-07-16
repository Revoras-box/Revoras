"use client";

import { ImageIcon } from "lucide-react";

/**
 * Airbnb-style hero mosaic for the business detail page: one large image + two
 * stacked, gracefully falling back to a branded jade→clay wash + monogram when a
 * studio has no photos yet (the common case while R2 media is unavailable).
 */
function Tile({ src, name, className }: { src?: string | null; name: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface-container-high ${className ?? ""}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photos
        <img src={src} alt={name} className="h-full w-full object-cover" />
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
}: {
  name: string;
  images: (string | null | undefined)[];
}) {
  const imgs = images.filter(Boolean) as string[];
  const [a, b, c] = [imgs[0] ?? null, imgs[1] ?? null, imgs[2] ?? null];
  const total = imgs.length;

  return (
    <div className="relative grid h-[280px] grid-cols-1 gap-2 overflow-hidden rounded-3xl md:h-[420px] md:grid-cols-[2fr_1fr]">
      <Tile src={a} name={name} className="h-full" />
      <div className="hidden grid-rows-2 gap-2 md:grid">
        <Tile src={b} name={name} />
        <Tile src={c} name={name} />
      </div>
      {total > 0 && (
        <button
          type="button"
          className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3.5 py-2 text-xs font-semibold text-on-surface shadow-soft backdrop-blur-sm"
        >
          <ImageIcon size={14} />
          {total} photo{total === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );
}
