"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useBarber } from "@/lib/hooks";
import type { BarberProfile } from "@/lib/types";

const availableDates = [
  { day: "MON", date: 12, selected: true },
  { day: "TUE", date: 13 },
  { day: "WED", date: 14 },
  { day: "THU", date: 15 },
];

const availableSlots = ["09:00 AM", "10:30 AM", "01:15 PM", "04:45 PM"];

function extractBarber(payload: unknown): BarberProfile | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if ("barber" in obj && obj.barber && typeof obj.barber === "object") {
    return obj.barber as BarberProfile;
  }
  if ("id" in obj && "name" in obj) {
    return obj as unknown as BarberProfile;
  }
  return null;
}

export default function BarberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data, loading, error, refetch } = useBarber<BarberProfile>(id);
  const barber = useMemo(() => extractBarber(data), [data]);

  if (loading) {
    return (
      <main className="pt-24 pb-20 relative min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-12 space-y-12 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-4 w-24 bg-surface rounded"></div>
              <div className="h-16 w-3/4 bg-surface rounded"></div>
              <div className="h-4 w-48 bg-surface rounded"></div>
              <div className="h-20 w-full bg-surface rounded"></div>
            </div>
            <div className="h-[450px] bg-surface rounded-3xl"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-surface rounded-xl"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !barber) {
    return (
      <main className="pt-28 px-12 min-h-screen bg-background">
        <div className="max-w-3xl mx-auto bg-surface border border-border/20 rounded-3xl p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <h1 className="text-3xl font-headline font-bold mt-4 mb-2">Barber not found</h1>
          <p className="text-muted mb-6">{error || "This barber may not exist or is no longer available."}</p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => refetch()}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-headline font-bold hover:brightness-110 transition-all"
            >
              Try Again
            </button>
            <Link
              href="/user/discover"
              className="px-6 py-3 rounded-xl border border-border/40 text-foreground font-headline font-bold hover:bg-surface transition-all"
            >
              Browse Studios
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const displayCuts = barber.cuts_completed ? `${barber.cuts_completed.toLocaleString()}+` : null;
  const displayRating = barber.rating != null ? Number(barber.rating).toFixed(1) : null;
  const displayExperience = barber.experience_years ? `${barber.experience_years}y` : null;
  const hasStats = displayCuts || displayRating || displayExperience;
  const specialties = (barber as unknown as Record<string, unknown>).specialties;

  return (
    <main className="pt-20 pb-20 relative min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href={barber.studio_id ? `/user/studio/${barber.studio_id}` : "/user/discover"}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            {barber.studio_name ? `Back to ${barber.studio_name}` : "Back to Discover"}
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-10">
            {/* Hero Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
              <div className="order-2 md:order-1">
                {barber.title && (
                  <span className="font-label text-xs tracking-widest text-primary uppercase mb-3 block">
                    {barber.title}
                  </span>
                )}
                <h1 className="font-headline text-6xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-none mb-4">
                  {barber.name}
                </h1>
                {barber.studio_name && (
                  <p className="text-secondary-foreground text-sm font-label tracking-wider mb-4">
                    at <span className="text-foreground">{barber.studio_name}</span>
                  </p>
                )}
                {barber.bio && (
                  <p className="text-muted leading-relaxed font-light max-w-md">{barber.bio}</p>
                )}
              </div>
              <div className="order-1 md:order-2">
                <div className="relative group">
                  <div className="absolute -inset-3 bg-primary/10 rounded-[2rem] blur-2xl group-hover:bg-primary/20 transition-all"></div>
                  <div className="relative h-[450px] w-full overflow-hidden rounded-3xl bg-surface border border-border/20">
                    <img
                      alt={barber.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={barber.image_url || "/images/barber-placeholder.jpg"}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Specialties */}
            {Array.isArray(specialties) && specialties.length > 0 && (
              <section>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((s: string, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-full bg-surface border border-border/30 text-sm text-foreground font-label"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Stats */}
            {hasStats && (
              <section className="grid grid-cols-3 gap-4">
                {displayCuts && (
                  <div className="bg-surface p-6 rounded-xl text-center border border-border/10">
                    <span className="font-label text-[10px] tracking-widest text-secondary-foreground uppercase">Cuts</span>
                    <p className="font-headline text-3xl font-bold text-primary mt-1">{displayCuts}</p>
                  </div>
                )}
                {displayRating && (
                  <div className="bg-surface p-6 rounded-xl text-center border border-border/10">
                    <span className="font-label text-[10px] tracking-widest text-secondary-foreground uppercase">Rating</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-headline text-3xl font-bold text-primary">{displayRating}</span>
                      <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    </div>
                  </div>
                )}
                {displayExperience && (
                  <div className="bg-surface p-6 rounded-xl text-center border border-border/10">
                    <span className="font-label text-[10px] tracking-widest text-secondary-foreground uppercase">Experience</span>
                    <p className="font-headline text-3xl font-bold text-primary mt-1">{displayExperience}</p>
                  </div>
                )}
              </section>
            )}

            {/* Bio / About */}
            {barber.bio && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground">About</h2>
                  <div className="h-px flex-grow bg-border/20"></div>
                </div>
                <p className="text-muted leading-relaxed">{barber.bio}</p>
              </section>
            )}
          </div>

          {/* Sidebar - Quick Booking */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-surface p-8 rounded-2xl border border-border/30 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline text-2xl font-bold text-foreground">Quick Booking</h3>
                  <span className="material-symbols-outlined text-primary">calendar_month</span>
                </div>

                <div className="space-y-4 mb-8">
                  <label className="font-label text-xs tracking-widest text-secondary-foreground uppercase">Select Date</label>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {availableDates.map((d) => (
                      <button
                        key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-colors ${
                          selectedDate === d.date
                            ? "bg-primary/20 text-primary border-primary/40"
                            : "bg-surface text-foreground border-border/20 hover:border-primary/40"
                        }`}
                      >
                        <span className="text-xs font-bold">{d.day}</span>
                        <span className="text-2xl font-black">{d.date}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <label className="font-label text-xs tracking-widest text-secondary-foreground uppercase">Available Slots</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all text-center ${
                          selectedSlot === slot
                            ? "bg-primary/20 text-primary border-primary/40"
                            : "bg-surface border-border/20 hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href={selectedSlot ? `/user/book?barberId=${barber.id}` : "#"}
                  className={`w-full py-4 rounded-xl font-headline font-extrabold text-lg shadow-lg transition-all block text-center ${
                    selectedSlot
                      ? "bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground active:scale-95"
                      : "bg-surface text-secondary-foreground cursor-not-allowed"
                  }`}
                >
                  {selectedSlot ? "Confirm Appointment" : "Select a Slot"}
                </Link>
              </div>

              {/* Studio Link */}
              {barber.studio_id && (
                <Link
                  href={`/user/studio/${barber.studio_id}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-surface border border-border/20 hover:border-primary/30 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-primary/10">
                    <span className="material-symbols-outlined text-primary">store</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-sm text-foreground truncate">
                      {barber.studio_name || "View Studio"}
                    </p>
                    <p className="text-xs text-secondary-foreground font-label">Visit studio page</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary-foreground group-hover:text-foreground transition-colors">
                    arrow_forward
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
