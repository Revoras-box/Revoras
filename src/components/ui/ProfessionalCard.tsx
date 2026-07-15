"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { RatingDisplay } from "./RatingDisplay";
import { Badge } from "./Badge";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface ProfessionalCardProps {
  name: string;
  avatarUrl?: string;
  designation?: string;
  rating?: number;
  reviewCount?: number;
  specialties?: string[];
  /** Shown when this professional is also the business owner — the Indian-market "owner who cuts hair" case. */
  isOwner?: boolean;
  /** Phase 2.3 — same contract as BusinessCard: the heart only renders when a toggle is supplied. */
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

/** A bookable professional, on a business's detail page or in a booking-flow picker. */
export function ProfessionalCard({
  name,
  avatarUrl,
  designation,
  rating,
  reviewCount,
  specialties = [],
  isOwner,
  isFavorite,
  onFavoriteToggle,
  onClick,
  className,
}: ProfessionalCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border p-3",
        onClick && "cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface-container-low",
        className
      )}
    >
      <Avatar name={name} src={avatarUrl} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-on-surface truncate">{name}</span>
          {isOwner ? <Badge tone="primary">Owner</Badge> : null}
        </div>
        {designation ? <p className="text-xs text-muted mt-0.5">{designation}</p> : null}
        {specialties.length ? <p className="text-xs text-muted mt-0.5 truncate">{specialties.join(" · ")}</p> : null}
      </div>
      {typeof rating === "number" ? <RatingDisplay value={rating} count={reviewCount} className="shrink-0" /> : null}
      {onFavoriteToggle ? (
        <button
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-container-high"
        >
          <Heart size={ICON_SIZE.sm} className={isFavorite ? "fill-error text-error" : "text-muted"} />
        </button>
      ) : null}
    </div>
  );
}
