"use client";

import { Star, MapPin, Heart, Phone, Navigation, Share2, Check } from "lucide-react";
import { TrustBadges, toast } from "@/components/ui";
import type { BusinessDetail } from "@/lib/types";

const mapsUrl = (b: BusinessDetail) => {
  const q =
    b.lat != null && b.lng != null
      ? `${b.lat},${b.lng}`
      : encodeURIComponent([b.address, b.city, b.state].filter(Boolean).join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
};

/* ------------------------------- header ------------------------------- */

export function DetailHeader({
  business,
  isFavorite,
  onFavoriteToggle,
}: {
  business: BusinessDetail;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}) {
  const rating = Number(business.rating ?? 0);
  const location = [business.city, business.state].filter(Boolean).join(", ");

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: business.name, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user dismissed the share sheet — not an error */
    }
  };

  const action = "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-high";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
        {business.category_name && <span className="font-medium text-secondary-foreground">{business.category_name}</span>}
        {rating > 0 && (
          <span className="inline-flex items-center gap-1 text-on-surface">
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-muted">({business.review_count} reviews)</span>
          </span>
        )}
        {business.badges && business.badges.length > 0 && <TrustBadges badges={business.badges} max={2} size={12} />}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface md:text-4xl">
            {business.name}
          </h1>
          {(business.address || location) && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-secondary-foreground">
              <MapPin size={15} className="text-muted" />
              {[business.address, location].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onFavoriteToggle} className={action} aria-pressed={isFavorite}>
            <Heart size={16} className={isFavorite ? "fill-error text-error" : ""} />
            {isFavorite ? "Saved" : "Save"}
          </button>
          {business.phone && (
            <a href={`tel:${business.phone}`} className={action}>
              <Phone size={16} /> Call
            </a>
          )}
          <a href={mapsUrl(business)} target="_blank" rel="noopener noreferrer" className={action}>
            <Navigation size={16} /> Directions
          </a>
          <button type="button" onClick={share} className={action}>
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- section nav ----------------------------- */

export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  return (
    <nav className="sticky top-16 z-30 -mx-4 border-b border-border glass-nav px-4 md:-mx-6 md:px-6">
      <div className="flex gap-1 overflow-x-auto py-2">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ----------------------------- amenities ------------------------------ */

export function AmenitiesSection({ amenities }: { amenities: string[] }) {
  if (!amenities?.length) return null;
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {amenities.map((a) => (
        <div key={a} className="inline-flex items-center gap-2.5 text-sm text-on-surface">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Check size={13} />
          </span>
          {a}
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- location ------------------------------- */

export function LocationSection({ business }: { business: BusinessDetail }) {
  const fullAddress = [business.address, business.city, business.state, business.zip_code].filter(Boolean).join(", ");
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative flex h-44 items-center justify-center bg-linear-to-br from-primary/12 via-surface-container to-accent/12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-elevated">
          <MapPin size={22} className="text-primary" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm text-on-surface">{fullAddress || "Address not provided"}</p>
        <a
          href={mapsUrl(business)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <Navigation size={15} /> Directions
        </a>
      </div>
    </div>
  );
}
