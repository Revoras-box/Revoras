"use client";

import { Heart } from "lucide-react";
import { RatingDisplay } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import type { BusinessDetail } from "@/lib/types";
import { getOpenStatus } from "./utils";

interface BusinessHeroProps {
  business: BusinessDetail;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

export default function BusinessHero({ business, isFavorite, onFavoriteToggle }: BusinessHeroProps) {
  const status = getOpenStatus(business.workingHours);
  const image = business.banner_url || business.image_url;

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-surface-container-high md:h-96">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary remote business photo
        <img src={image} alt={business.name} className="h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <button
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={isFavorite}
        onClick={onFavoriteToggle}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 shadow-soft backdrop-blur-sm"
      >
        <Heart size={ICON_SIZE.md} className={isFavorite ? "fill-error text-error" : "text-on-surface"} />
      </button>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-white/90">
          <span className={status.isOpen ? "text-secondary" : "text-white/70"}>{status.label}</span>
          {business.category_name ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{business.category_name}</span>
            </>
          ) : null}
        </div>
        <h1 className="font-headline text-3xl font-bold text-white md:text-4xl">{business.name}</h1>
        <div className="flex items-center gap-3 text-white/90">
          <RatingDisplay value={business.rating ? Number(business.rating) : 0} count={business.review_count} className="text-white" />
          <span aria-hidden="true">·</span>
          <span className="text-sm">{[business.city, business.state].filter(Boolean).join(", ") || business.address}</span>
        </div>
      </div>
    </div>
  );
}
