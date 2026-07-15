"use client";

import { Heart, MapPin, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { RatingDisplay } from "./RatingDisplay";
import { TrustBadges } from "./TrustBadges";
import { ICON_SIZE } from "@/lib/design-tokens";
import type { TrustBadge } from "@/lib/types";

export interface BusinessCardProps {
  name: string;
  imageUrl?: string;
  category: string;
  rating: number;
  reviewCount: number;
  distanceLabel?: string;
  badges?: TrustBadge[]; // Phase 1.4c
  /** Phase 2.4 - a short discount label, e.g. "25% off". Renders an offer ribbon on the image. */
  offerLabel?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

/** A Discover result / favorites-list tile. Pure display props — the page fetching `/discover/businesses` maps the API response onto these. */
export function BusinessCard({
  name,
  imageUrl,
  category,
  rating,
  reviewCount,
  distanceLabel,
  badges,
  offerLabel,
  isFavorite,
  onFavoriteToggle,
  onClick,
  className,
}: BusinessCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "transition-shadow duration-(--duration-base) ease-(--ease-out) hover:shadow-elevated",
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-high">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- card grids render arbitrary remote business photos
          <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-105" />
        ) : null}
        {offerLabel ? (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-error px-2 py-0.5 text-xs font-semibold text-on-error shadow-soft">
            <Tag size={11} />
            {offerLabel}
          </span>
        ) : null}
        {onFavoriteToggle ? (
          <button
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 backdrop-blur-sm shadow-soft"
          >
            <Heart size={ICON_SIZE.sm} className={isFavorite ? "fill-error text-error" : "text-on-surface"} />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-headline text-sm font-semibold text-on-surface truncate">{name}</h3>
          <RatingDisplay value={rating} count={reviewCount} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <span>{category}</span>
          {distanceLabel ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-0.5">
                <MapPin size={11} />
                {distanceLabel}
              </span>
            </>
          ) : null}
        </div>
        {badges && badges.length > 0 ? <TrustBadges badges={badges} max={2} size={11} className="mt-1.5" /> : null}
      </div>
    </div>
  );
}
