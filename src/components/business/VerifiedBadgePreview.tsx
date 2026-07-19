"use client";

import Image from "next/image";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * Shows the host what the Verified badge actually looks like on their own
 * listing, rather than describing it. Two surfaces, because they're where a
 * customer meets the badge and they render it at different sizes: the search
 * result card and the business detail header.
 *
 * Deliberately a static mock built from the business's real name/image — it is
 * NOT the live BusinessCard component. Reusing that here would couple the
 * preview to the frozen customer-experience-v1 surface and drag its data
 * requirements (pricing, availability, distance) into the dashboard.
 */
export function VerifiedBadgePreview({
  businessName,
  imageUrl,
  city,
  /** Verified businesses render the badge; unverified previews dim it as a "what you'll get". */
  active = false,
  className,
}: {
  businessName: string;
  imageUrl?: string | null;
  city?: string | null;
  active?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Search result card */}
      <figure className="m-0">
        <figcaption className="text-xs font-medium text-muted mb-2">In search results</figcaption>
        <div className="flex gap-3 rounded-xl border border-border bg-surface p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
            {imageUrl ? (
              <Image src={imageUrl} alt="" fill sizes="64px" className="object-cover" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-on-surface">{businessName}</span>
              <BadgeCheck
                size={15}
                aria-label="Verified"
                className={cn("shrink-0", active ? "text-primary" : "text-muted opacity-40")}
              />
            </div>
            {city ? (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted">
                <MapPin size={12} /> {city}
              </div>
            ) : null}
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted">
              <Star size={12} className="fill-current" /> 4.8
              <span className="opacity-60">(126)</span>
            </div>
          </div>
        </div>
      </figure>

      {/* Detail page header */}
      <figure className="m-0">
        <figcaption className="text-xs font-medium text-muted mb-2">On your profile page</figcaption>
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-headline text-lg font-semibold text-on-surface">{businessName}</span>
            <Badge tone={active ? "success" : "neutral"} className={cn(!active && "opacity-50")}>
              <BadgeCheck size={13} /> Verified
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted">
            {active
              ? "Customers see this badge everywhere your business appears."
              : "This is how your listing will look once verification is approved."}
          </p>
        </div>
      </figure>
    </div>
  );
}
