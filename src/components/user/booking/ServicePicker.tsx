"use client";

import { useMemo } from "react";
import { Check, Clock, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui";
import type { Professional, Service } from "@/lib/types";

/**
 * The service catalogue, priced and timed honestly.
 *
 * One component for both the studio page and step 1 of the booking wizard,
 * because they are the same decision and were drifting into two different card
 * languages. The studio page just doesn't pass `professionals`.
 *
 * The headline change: a service no longer has *a* duration. The same haircut is
 * 25 minutes with one barber and 40 with another, so quoting a single number
 * here would be a number the customer never actually gets. Where the team
 * differs this shows the real spread and says why.
 */

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/** What the team actually charges and takes for one service. */
interface Spread {
  minDuration: number;
  maxDuration: number;
  minPrice: number;
  maxPrice: number;
  offeredBy: number;
  teamSize: number;
}

const buildSpreads = (services: Service[], professionals: Professional[]): Map<string, Spread> => {
  const map = new Map<string, Spread>();
  if (professionals.length === 0) return map;

  for (const service of services) {
    const rows = professionals
      .map((p) => p.services?.find((row) => row.serviceId === service.id))
      .filter((row): row is NonNullable<typeof row> => Boolean(row));
    if (rows.length === 0) continue;

    const durations = rows.map((r) => r.duration);
    const prices = rows.map((r) => r.price);
    map.set(service.id, {
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      offeredBy: rows.length,
      teamSize: professionals.length,
    });
  }
  return map;
};

const categoryOf = (service: Service) => service.category_name || "Other services";

interface ServiceCardProps {
  service: Service;
  spread: Spread | undefined;
  selected: boolean;
  onToggle: (id: string) => void;
}

function ServiceRow({ service, spread, selected, onToggle }: ServiceCardProps) {
  const minDuration = spread ? spread.minDuration : service.duration;
  const maxDuration = spread ? spread.maxDuration : service.duration;
  const minPrice = spread ? spread.minPrice : Number(service.price);
  const maxPrice = spread ? spread.maxPrice : Number(service.price);

  const durationVaries = minDuration !== maxDuration;
  const priceVaries = minPrice !== maxPrice;
  // "Not everyone here does this" is worth saying up front — it's the reason a
  // professional will be greyed out on the next step.
  const partialTeam = spread ? spread.offeredBy < spread.teamSize && spread.teamSize > 1 : false;

  return (
    <button
      type="button"
      onClick={() => onToggle(service.id)}
      aria-pressed={selected}
      aria-label={`${service.name}, ${priceVaries ? `from ${inr(minPrice)}` : inr(minPrice)}, ${
        durationVaries ? `${minDuration} to ${maxDuration}` : minDuration
      } minutes${selected ? ", selected" : ""}`}
      className={cn(
        "group relative flex h-full w-full items-start gap-3.5 rounded-2xl border p-4 text-left",
        "transition-colors duration-(--duration-fast) ease-(--ease-out)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        selected
          ? "border-primary bg-primary-container/25"
          : "border-border bg-card hover:border-primary/45 hover:bg-surface-container-low"
      )}
    >
      {service.image_url ? (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-container-low">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image_url} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="truncate font-headline text-sm font-semibold text-on-surface">{service.name}</h4>
        {service.description ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">{service.description}</p>
        ) : null}

        {/* Pushed to the bottom so price/duration line up across cards of
            different text lengths — the row reads as a table, not a ragged list. */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
          <span className="font-semibold tabular-nums text-on-surface">
            {priceVaries ? `from ${inr(minPrice)}` : inr(minPrice)}
          </span>
          <span className="inline-flex items-center gap-1 text-muted">
            <Clock size={12} />
            <span className="tabular-nums">
              {durationVaries ? `${minDuration}–${maxDuration}` : minDuration} min
            </span>
          </span>
          {durationVaries || priceVaries ? (
            <span className="text-[11px] text-muted/80">varies by professional</span>
          ) : null}
        </div>

        {partialTeam ? (
          <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted">
            <Users size={11} />
            {spread?.offeredBy} of {spread?.teamSize} professionals
          </span>
        ) : null}
      </div>

      <span
        aria-hidden
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-(--duration-fast)",
          selected
            ? "border-primary bg-primary text-on-primary"
            : "border-border bg-surface-container-low text-muted group-hover:border-primary/50 group-hover:text-primary"
        )}
      >
        {selected ? <Check size={15} strokeWidth={3} /> : <Plus size={15} />}
      </span>
    </button>
  );
}

export interface ServicePickerProps {
  services: Service[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  /** Pass the team to show real per-professional spreads instead of one flat number. */
  professionals?: Professional[];
  emptyLabel?: string;
}

export function ServicePicker({
  services,
  selectedIds,
  onToggle,
  professionals = [],
  emptyLabel = "No services listed yet",
}: ServicePickerProps) {
  const spreads = useMemo(() => buildSpreads(services, professionals), [services, professionals]);

  // Grouped, because a catalogue of fifteen items in one flat grid is a wall.
  // Insertion order is the server's (category sort_order, then name), so the
  // shop's own ordering is preserved rather than alphabetised here.
  const groups = useMemo(() => {
    const byCategory = new Map<string, Service[]>();
    for (const service of services) {
      const key = categoryOf(service);
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key)!.push(service);
    }
    return [...byCategory.entries()];
  }, [services]);

  if (services.length === 0) return <EmptyState title={emptyLabel} />;

  return (
    <div className="flex flex-col gap-6">
      {groups.map(([category, items]) => (
        <div key={category}>
          {/* A single unnamed group is just "the services" — no header needed. */}
          {groups.length > 1 ? (
            <h3 className="mb-2.5 flex items-baseline gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {category}
              <span className="rounded-full bg-surface-container-high px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-on-surface-variant">
                {items.length}
              </span>
            </h3>
          ) : null}
          <div className="grid items-stretch gap-3 sm:grid-cols-2">
            {items.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                spread={spreads.get(service.id)}
                selected={selectedIds.includes(service.id)}
                onToggle={onToggle}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
