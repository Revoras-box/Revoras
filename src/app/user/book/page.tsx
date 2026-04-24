"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApi, useAvailability } from "@/lib/hooks";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface StudioDetails {
  id: string | number;
  name: string;
  city?: string | null;
  state?: string | null;
  image_url?: string | null;
}

interface StudioResponse {
  studio?: StudioDetails;
  error?: string;
}

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  duration: number;
  description?: string | null;
}

interface ServicesResponse {
  services?: ServiceItem[];
  error?: string;
}

interface BarberItem {
  id: string;
  name: string;
  title?: string | null;
  image_url?: string | null;
}

interface BarbersResponse {
  barbers?: BarberItem[];
  error?: string;
}

const STUDIO_PLACEHOLDER = "/images/studio-placeholder.jpg";
const BARBER_PLACEHOLDER = "/images/barber-placeholder.jpg";

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseIdList = (value: string | null): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

function extractStudio(payload: unknown): StudioDetails | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if ("studio" in obj && obj.studio && typeof obj.studio === "object") {
    return obj.studio as StudioDetails;
  }
  if ("id" in obj && "name" in obj) {
    return obj as unknown as StudioDetails;
  }
  return null;
}

function extractServices(payload: unknown): ServiceItem[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj)) return obj as ServiceItem[];
  if ("services" in obj && Array.isArray(obj.services)) {
    return obj.services as ServiceItem[];
  }
  return [];
}

function extractBarbers(payload: unknown): BarberItem[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj)) return obj as BarberItem[];
  if ("barbers" in obj && Array.isArray(obj.barbers)) {
    return obj.barbers as BarberItem[];
  }
  return [];
}

const to24HourTime = (raw: string): string | null => {
  const value = raw.trim();
  if (!value) return null;

  const strict24 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (strict24) {
    const hour = Number(strict24[1]);
    const min = Number(strict24[2]);
    if (hour >= 0 && hour <= 23 && min >= 0 && min <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
  }

  const ampm = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const hour = Number(ampm[1]);
    const min = Number(ampm[2]);
    const period = ampm[3].toUpperCase();
    if (hour >= 1 && hour <= 12 && min >= 0 && min <= 59) {
      const normalizedHour = period === "PM" ? (hour % 12) + 12 : hour % 12;
      return `${String(normalizedHour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    }
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  return null;
};

const formatDisplayTime = (time: string): string => {
  const [hoursRaw, minsRaw] = time.split(":");
  const hours = Number(hoursRaw);
  const mins = Number(minsRaw);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return time;
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(mins).padStart(2, "0")} ${period}`;
};

export default function BookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studioId = searchParams.get("studioId")?.trim() ?? "";
  const preselectedServiceIds = useMemo(() => parseIdList(searchParams.get("services")), [searchParams]);
  const preselectedBarber = searchParams.get("barberId")?.trim() ?? "";

  const dateOptions = useMemo(() => {
    const formatterDay = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const formatterMonth = new Intl.DateTimeFormat("en-US", { month: "short" });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        iso: toIsoDate(date),
        day: formatterDay.format(date).toUpperCase(),
        month: formatterMonth.format(date),
        date: date.getDate(),
      };
    });
  }, []);

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(preselectedServiceIds);
  const [selectedBarber, setSelectedBarber] = useState(preselectedBarber || "");
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.iso ?? toIsoDate(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { data: studioData, loading: studioLoading, error: studioError, refetch: refetchStudio } = useApi<StudioResponse>(
    () => {
      if (!studioId) return Promise.resolve({});
      return api.getStudio(studioId) as Promise<StudioResponse>;
    },
    [studioId]
  );

  const { data: servicesData, loading: servicesLoading } = useApi<ServicesResponse>(
    () => {
      if (!studioId) return Promise.resolve({ services: [] });
      return api.getStudioServices(studioId) as Promise<ServicesResponse>;
    },
    [studioId]
  );

  const { data: barbersData, loading: barbersLoading } = useApi<BarbersResponse>(
    () => {
      if (!studioId) return Promise.resolve({ barbers: [] });
      return api.getStudioBarbers(studioId) as Promise<BarbersResponse>;
    },
    [studioId]
  );

  const studio = useMemo(() => extractStudio(studioData), [studioData]);
  const services = useMemo(() => extractServices(servicesData), [servicesData]);
  const barbers = useMemo(() => extractBarbers(barbersData), [barbersData]);

  useEffect(() => {
    if (preselectedServiceIds.length === 0) return;
    setSelectedServiceIds((prev) => (prev.length === 0 ? preselectedServiceIds : prev));
  }, [preselectedServiceIds]);

  useEffect(() => {
    if (barbersLoading || barbers.length === 0) return;
    const exists = barbers.some((barber) => barber.id === selectedBarber);
    if (!exists) setSelectedBarber(barbers[0].id);
  }, [barbers, barbersLoading, selectedBarber]);

  const selectedBarberData = useMemo(
    () => barbers.find((barber) => barber.id === selectedBarber),
    [barbers, selectedBarber]
  );

  const selectedServiceDetails = useMemo(
    () => services.filter((service) => selectedServiceIds.includes(String(service.id))),
    [services, selectedServiceIds]
  );

  const selectedServiceTotal = useMemo(
    () => selectedServiceDetails.reduce((sum, service) => sum + service.price, 0),
    [selectedServiceDetails]
  );

  const selectedDurationTotal = useMemo(
    () => selectedServiceDetails.reduce((sum, service) => sum + service.duration, 0),
    [selectedServiceDetails]
  );

  const selectedBarberId = selectedBarber || null;
  const {
    slots,
    loading: availabilityLoading,
    error: availabilityError,
    refetch: refetchAvailability,
  } = useAvailability(studioId, selectedBarberId, selectedDate);

  const availableTimes = useMemo(() => {
    const seen = new Set<string>();
    const mapped: string[] = [];
    for (const slot of slots) {
      const normalized = to24HourTime(slot);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      mapped.push(normalized);
    }
    return mapped;
  }, [slots]);

  useEffect(() => {
    if (availableTimes.length === 0) {
      if (selectedTime) setSelectedTime(null);
      return;
    }
    if (!selectedTime || !availableTimes.includes(selectedTime)) {
      setSelectedTime(availableTimes[0]);
    }
  }, [availableTimes, selectedTime]);

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleContinueToCheckout = () => {
    if (!studioId || !studio) {
      toast.error("Please select a studio first.");
      return;
    }
    if (selectedServiceDetails.length === 0) {
      toast.error("Please select at least one service.");
      return;
    }
    if (!selectedBarberId) {
      toast.error("Please select a professional.");
      return;
    }
    if (!selectedTime) {
      toast.error("Please select an available time slot.");
      return;
    }

    const query = new URLSearchParams({
      studioId: String(studio.id),
      barberId: selectedBarberId ?? "",
      date: selectedDate,
      time: selectedTime,
      services: selectedServiceDetails.map((service) => service.id).join(","),
    });
    if (notes.trim()) {
      query.set("notes", notes.trim());
    }
    router.push(`/user/checkout?${query.toString()}`);
  };

  const selectedDateData = dateOptions.find((d) => d.iso === selectedDate);

  if (!studioId) {
    return (
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto min-h-screen">
        <div className="bg-[#1a1a1a] border border-[#4D463A]/20 rounded-3xl p-10 text-center">
          <span className="material-symbols-outlined text-6xl text-[#E5C487]">storefront</span>
          <h1 className="text-3xl font-headline font-bold text-white mt-4 mb-3">Choose a studio to book</h1>
          <p className="text-gray-400 mb-8">Start from studio discovery, pick services, then continue to live availability.</p>
          <Link
            href="/user/discover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-bold"
          >
            Go to Discover
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">
                STEP 01
              </span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Select Services</h2>
            </div>
            {servicesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                  <div key={item} className="h-28 rounded-2xl bg-[#1a1a1a] animate-pulse" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#4D463A]/30 p-8 text-center text-gray-400">
                No services available for this studio.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const selected = selectedServiceIds.includes(String(service.id));
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(String(service.id))}
                      className={`text-left p-5 rounded-2xl border transition-all ${
                        selected
                          ? "border-[#E5C487]/50 bg-[#E5C487]/5"
                          : "border-[#4D463A]/20 bg-[#1a1a1a] hover:border-[#E5C487]/40"
                      }`}
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className={`font-headline font-bold ${selected ? "text-[#E5C487]" : "text-white"}`}>{service.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{service.duration} mins</p>
                        </div>
                        <p className="font-headline font-black text-[#E5C487]">${service.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">
                STEP 02
              </span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Select Professional</h2>
            </div>
            {barbersLoading ? (
              <div className="flex gap-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="w-24 h-36 rounded-2xl bg-[#1a1a1a] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-4">
                {barbers.map((barber) => (
                  <button
                    key={barber.id}
                    onClick={() => setSelectedBarber(barber.id)}
                    className={`shrink-0 text-center transition-opacity ${
                      selectedBarber !== barber.id ? "opacity-60 hover:opacity-100" : ""
                    }`}
                  >
                    <div className="relative mb-3">
                      <img
                        alt={barber.name}
                        className={`w-24 h-32 object-cover rounded-tl-3xl rounded-br-3xl border-2 transition-all duration-500 ${
                          selectedBarber === barber.id ? "border-[#E5C487]" : "border-[#4D463A]/50"
                        }`}
                        src={barber.image_url || BARBER_PLACEHOLDER}
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-tl-3xl rounded-br-3xl" />
                    </div>
                    <p className={`font-headline font-bold ${selectedBarber === barber.id ? "text-[#E5C487]" : "text-white"}`}>
                      {barber.name}
                    </p>
                    <p className="font-label text-[10px] text-gray-400 uppercase tracking-widest">{barber.title || "Barber"}</p>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">
                STEP 03
              </span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Select Date</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {dateOptions.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`shrink-0 w-20 py-6 rounded-2xl flex flex-col items-center justify-center transition-all ${
                    selectedDate === d.iso
                      ? "bg-linear-to-b from-[#E5C487] to-[#C8A96E] text-[#402d00] shadow-xl transform scale-105"
                      : "bg-[#1a1a1a] border border-[#4D463A]/20 text-white hover:border-[#E5C487]/50"
                  }`}
                >
                  <span className={`font-label text-xs uppercase ${selectedDate === d.iso ? "font-bold" : "text-gray-400"}`}>
                    {d.month}
                  </span>
                  <span className="font-headline text-3xl font-bold">{d.date}</span>
                  <span className={`font-label text-[10px] tracking-tighter ${selectedDate === d.iso ? "" : "text-gray-400"}`}>
                    {d.day}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="font-label text-[#E5C487] bg-[#E5C487]/10 px-3 py-1 rounded text-sm tracking-widest">
                STEP 04
              </span>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Pick Time</h2>
            </div>
            {!selectedBarberId ? (
              <div className="rounded-2xl border border-dashed border-[#4D463A]/30 p-8 text-center text-gray-400">
                Please select a professional to view available slots.
              </div>
            ) : availabilityLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="h-16 rounded-xl bg-[#1a1a1a] animate-pulse" />
                ))}
              </div>
            ) : availabilityError ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-6">
                <p className="text-red-300 mb-4">{availabilityError}</p>
                <button
                  onClick={() => refetchAvailability()}
                  className="px-4 py-2 rounded-lg bg-[#E5C487] text-[#402d00] font-bold text-sm"
                >
                  Retry Availability
                </button>
              </div>
            ) : availableTimes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#4D463A]/30 p-8 text-center text-gray-400">
                No slots available for this date. Pick another day.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-4 px-6 rounded-xl border font-headline font-bold transition-all ${
                      selectedTime === time
                        ? "border-[#E5C487]/60 bg-[#E5C487]/5 text-[#E5C487]"
                        : "border-[#4D463A]/30 bg-[#1a1a1a] text-gray-400 hover:border-[#E5C487]/40"
                    }`}
                  >
                    {formatDisplayTime(time)}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-32 bg-[#1a1a1a] p-8 rounded-3xl border border-[#4D463A]/20 shadow-2xl space-y-8">
            <div>
              <h3 className="font-headline text-xl font-bold text-white mb-1">Reservation Summary</h3>
              <p className="font-label text-[10px] text-gray-400 tracking-widest uppercase">Live booking via backend APIs</p>
            </div>

            {studioLoading ? (
              <div className="h-24 rounded-2xl bg-[#2a2a2a] animate-pulse" />
            ) : studioError || !studio ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-900/10 p-4">
                <p className="text-sm text-red-300 mb-3">{studioError || "Unable to load studio details."}</p>
                <button
                  onClick={() => refetchStudio()}
                  className="px-3 py-2 rounded-lg bg-[#E5C487] text-[#402d00] text-xs font-bold"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-2xl">
                <img
                  alt={studio.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#E5C487]/30"
                  src={studio.image_url || STUDIO_PLACEHOLDER}
                />
                <div>
                  <p className="text-[10px] font-label text-gray-400 tracking-widest uppercase">Studio</p>
                  <p className="font-headline font-bold text-white">{studio.name}</p>
                  <p className="text-xs text-gray-500">
                    {[studio.city, studio.state].filter(Boolean).join(", ") || "Location unavailable"}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {selectedBarberData && (
                <div className="flex items-center gap-4 p-4 bg-[#2a2a2a] rounded-2xl">
                  <img
                    alt={selectedBarberData.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#E5C487]/30"
                    src={selectedBarberData.image_url || BARBER_PLACEHOLDER}
                  />
                  <div>
                    <p className="text-[10px] font-label text-gray-400 tracking-widest uppercase">Professional</p>
                    <p className="font-headline font-bold text-white">
                      {selectedBarberData.name} {selectedBarberData.title ? `(${selectedBarberData.title})` : ""}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-[#2a2a2a] rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-label text-gray-400 tracking-widest uppercase">Services</p>
                {selectedServiceDetails.length === 0 ? (
                  <p className="text-sm text-gray-500">Select at least one service.</p>
                ) : (
                  selectedServiceDetails.map((service) => (
                    <div key={service.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{service.name}</span>
                      <span className="text-[#E5C487] font-bold">${service.price}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#E5C487] text-xl">calendar_today</span>
                    <span className="text-sm font-medium text-gray-400">Date</span>
                  </div>
                  <span className="font-headline font-bold text-white">
                    {selectedDateData ? `${selectedDateData.day}, ${selectedDateData.month} ${selectedDateData.date}` : selectedDate}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#E5C487] text-xl">schedule</span>
                    <span className="text-sm font-medium text-gray-400">Time</span>
                  </div>
                  <span className="font-headline font-bold text-white">{selectedTime ? formatDisplayTime(selectedTime) : "--"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#E5C487] text-xl">hourglass_bottom</span>
                    <span className="text-sm font-medium text-gray-400">Duration</span>
                  </div>
                  <span className="font-headline font-bold text-white">{selectedDurationTotal} mins</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-label text-gray-400 tracking-widest uppercase">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  maxLength={250}
                  className="w-full rounded-xl bg-[#2a2a2a] border border-[#4D463A]/30 px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E5C487]/40"
                  placeholder="Any preference for your appointment?"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#4D463A]/30">
              <div className="flex justify-between items-end mb-8">
                <p className="font-headline font-bold text-white">Total Price</p>
                <div className="text-right">
                  <p className="text-3xl font-headline font-black text-[#E5C487]">${selectedServiceTotal}</p>
                  <p className="text-[10px] font-label text-gray-400 tracking-widest">SERVICE TOTAL</p>
                </div>
              </div>

              <button
                onClick={handleContinueToCheckout}
                disabled={selectedServiceDetails.length === 0 || !selectedTime || !studio || !selectedBarberId}
                className="w-full bg-linear-to-r from-[#E5C487] to-[#C8A96E] text-[#402d00] font-headline font-black py-5 rounded-2xl shadow-lg shadow-[#E5C487]/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONTINUE TO CHECKOUT
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-[10px] text-center mt-6 text-gray-400 font-label leading-relaxed">
                REAL-TIME AVAILABILITY. <br /> FINAL BOOKING IS CREATED AT CHECKOUT.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
