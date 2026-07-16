"use client";

import { Star, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function BookingCard({
  services,
  selectedServices,
  rating,
  reviewCount,
  onContinue,
}: {
  services: Service[];
  selectedServices: Service[];
  rating: number;
  reviewCount: number;
  onContinue: () => void;
}) {
  const prices = services.map((s) => Number(s.price)).filter((n) => !Number.isNaN(n));
  const fromPrice = prices.length ? Math.min(...prices) : 0;
  const total = selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
  const totalMins = selectedServices.reduce((sum, s) => sum + Number(s.duration || 0), 0);
  const hasSelection = selectedServices.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-elevated">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-xs text-muted">{hasSelection ? "Total" : "From"}</span>
          <div className="font-headline text-2xl font-extrabold text-on-surface">
            {inr(hasSelection ? total : fromPrice)}
          </div>
        </div>
        {rating > 0 && (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-on-surface">
            <Star size={14} className="fill-primary text-primary" />
            {rating.toFixed(1)}
            <span className="font-normal text-muted">({reviewCount})</span>
          </span>
        )}
      </div>

      <div className="my-4 h-px bg-border" />

      {hasSelection ? (
        <ul className="mb-4 flex flex-col gap-2">
          {selectedServices.map((s) => (
            <li key={s.id} className="flex items-center justify-between text-sm">
              <span className="truncate text-on-surface">{s.name}</span>
              <span className="shrink-0 font-medium text-on-surface">{inr(Number(s.price))}</span>
            </li>
          ))}
          {totalMins > 0 && (
            <li className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted">
              <Clock size={13} />
              About {totalMins} min
            </li>
          )}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-muted">Select services to see your total and pick a time.</p>
      )}

      <button
        type="button"
        onClick={onContinue}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
      >
        {hasSelection ? "Continue to book" : "Book now"}
        <ArrowRight size={16} />
      </button>

      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
        <ShieldCheck size={13} className="text-primary" />
        Free cancellation on most bookings
      </p>
    </div>
  );
}
