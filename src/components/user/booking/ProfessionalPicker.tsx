"use client";

import { useMemo } from "react";
import { Check, Clock, Star, Zap, Tag, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import { displayDuration } from "@/lib/slot-fit";
import type { Professional, Service } from "@/lib/types";

/**
 * Choosing a professional is now a real comparison, not a formality.
 *
 * Since durations and prices are per-employee, the same basket genuinely costs
 * and takes different amounts depending on the chair — 50 minutes with one
 * barber, 65 with another. This step's job is to make that legible at a glance
 * instead of burying it until the total changes on the confirm screen.
 *
 * Someone who doesn't perform part of the basket is shown, greyed and
 * unselectable, with the reason named. Hiding them would leave the customer
 * wondering where a professional went; letting them be picked would just move
 * the failure to the booking endpoint.
 */

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export interface ProfessionalFit {
  duration: number;
  price: number;
  /** Names of selected services this professional doesn't perform. */
  missing: string[];
}

interface Props {
  professionals: Professional[];
  selectedServices: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
  fitFor: (professionalId: string) => ProfessionalFit;
}

export function ProfessionalPicker({ professionals, selectedServices, selectedId, onSelect, fitFor }: Props) {
  const hasBasket = selectedServices.length > 0;

  const { fits, fastestId, cheapestId, eligibleCount } = useMemo(() => {
    const entries = professionals.map((p) => ({ id: p.id, fit: fitFor(p.id) }));
    const eligible = entries.filter((e) => e.fit.missing.length === 0);

    // Only worth a badge when there's an actual difference to point at — on a
    // team that charges and works identically, "Fastest" is noise.
    const durations = new Set(eligible.map((e) => e.fit.duration));
    const prices = new Set(eligible.map((e) => e.fit.price));

    const fastest =
      hasBasket && durations.size > 1
        ? eligible.reduce((best, e) => (e.fit.duration < best.fit.duration ? e : best)).id
        : null;
    const cheapest =
      hasBasket && prices.size > 1
        ? eligible.reduce((best, e) => (e.fit.price < best.fit.price ? e : best)).id
        : null;

    return {
      fits: new Map(entries.map((e) => [e.id, e.fit])),
      fastestId: fastest,
      cheapestId: cheapest,
      eligibleCount: eligible.length,
    };
  }, [professionals, fitFor, hasBasket]);

  if (professionals.length === 0) {
    return <p className="text-sm text-muted">No professionals available. Try choosing another day or studio.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {hasBasket && eligibleCount === 0 ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-warning/40 bg-warning-container/30 p-3">
          <Ban size={15} className="mt-0.5 shrink-0 text-on-warning-container" />
          <p className="text-xs text-on-warning-container">
            Nobody here performs all {selectedServices.length} of these together. Go back and drop one, or book them as
            two separate appointments.
          </p>
        </div>
      ) : null}

      <div className="grid items-stretch gap-3 sm:grid-cols-2">
        {professionals.map((p) => {
          const fit = fits.get(p.id)!;
          const blocked = hasBasket && fit.missing.length > 0;
          const isOn = p.id === selectedId;
          const rating = Number(p.rating ?? 0);

          return (
            <button
              key={p.id}
              type="button"
              disabled={blocked}
              onClick={() => onSelect(p.id)}
              aria-pressed={isOn}
              className={cn(
                "group flex h-full w-full items-start gap-3.5 rounded-2xl border p-4 text-left",
                "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                blocked
                  ? "cursor-not-allowed border-dashed border-border bg-surface-container-low/50 opacity-70"
                  : isOn
                    ? "border-primary bg-primary-container/25"
                    : "border-border bg-card hover:border-primary/45 hover:bg-surface-container-low"
              )}
            >
              <Avatar name={p.name} src={p.image_url ?? undefined} size="lg" className="shrink-0" />

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-baseline gap-2">
                  <h4 className="truncate font-headline text-sm font-semibold text-on-surface">{p.name}</h4>
                  {rating > 0 ? (
                    <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-muted">
                      <Star size={10} className="fill-primary text-primary" />
                      {rating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                {p.designation ? <p className="truncate text-xs text-muted">{p.designation}</p> : null}

                {blocked ? (
                  <p className="mt-2 text-[11px] font-medium text-on-warning-container">
                    Doesn&apos;t offer {fit.missing.join(", ")}
                  </p>
                ) : hasBasket ? (
                  <>
                    {/* Their figures for THIS basket — the whole reason this
                        step matters now. Bottom-aligned so the numbers line up
                        across cards with different designation lengths. */}
                    <div className="mt-auto flex flex-wrap items-baseline gap-x-2.5 gap-y-1 pt-2">
                      <span className="font-headline text-base font-bold tabular-nums text-on-surface">
                        {inr(fit.price)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <Clock size={11} />
                        {displayDuration(fit.duration)}
                      </span>
                    </div>
                    {p.id === fastestId || p.id === cheapestId ? (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {p.id === fastestId ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-secondary-container">
                            <Zap size={9} /> Fastest
                          </span>
                        ) : null}
                        {p.id === cheapestId ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-primary-container">
                            <Tag size={9} /> Best price
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                ) : p.specialties && p.specialties.length > 0 ? (
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {p.specialties.slice(0, 2).map((sp) => (
                      <span
                        key={sp}
                        className="rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] text-on-surface-variant"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <span
                aria-hidden
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-(--duration-fast)",
                  isOn && !blocked
                    ? "border-primary bg-primary text-on-primary"
                    : "border-border bg-transparent text-transparent"
                )}
              >
                <Check size={13} strokeWidth={3} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
