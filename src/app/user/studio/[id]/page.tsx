"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useStudio, useStudioBarbers, useStudioReviews, useStudioServices } from "@/lib/hooks";

interface StudioWorkingHour {
  day_of_week: number;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

interface StudioDetails {
  id: number;
  name: string;
  address: string;
  city?: string;
  state?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  banner_url?: string | null;
  image_url?: string | null;
  rating?: number | null;
  review_count?: number;
  created_at?: string;
  is_open?: boolean;
  next_open?: string | null;
  workingHours?: StudioWorkingHour[];
}

interface StudioResponse {
  studio?: StudioDetails;
}

interface ServiceItem {
  id: number;
  name: string;
  description?: string | null;
  duration: number;
  price: number;
}

interface ServicesResponse {
  services?: ServiceItem[];
}

interface BarberItem {
  id: string;
  name: string;
  title?: string | null;
  image_url?: string | null;
}

interface BarbersResponse {
  barbers?: BarberItem[];
}

interface ReviewsResponse {
  pagination?: {
    total?: number;
  };
  reviews?: unknown[];
}

interface WorkingHourDisplay {
  days: string;
  hours: string;
  closed: boolean;
}

const FALLBACK_HOURS: WorkingHourDisplay[] = [
  { days: "Monday - Friday", hours: "09:00 - 21:00", closed: false },
  { days: "Saturday", hours: "10:00 - 19:00", closed: false },
  { days: "Sunday", hours: "Closed", closed: true },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const BOOKING_FEE = 2.5;
const PLACEHOLDER_IMAGE = "/images/studio-placeholder.jpg";
const BARBER_PLACEHOLDER = "/images/barber-placeholder.jpg";

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
  if (Array.isArray(obj)) {
    return obj as ServiceItem[];
  }
  if ("services" in obj && Array.isArray(obj.services)) {
    return obj.services as ServiceItem[];
  }
  return [];
}

function extractBarbers(payload: unknown): BarberItem[] {
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  if (Array.isArray(obj)) {
    return obj as BarberItem[];
  }
  if ("barbers" in obj && Array.isArray(obj.barbers)) {
    return obj.barbers as BarberItem[];
  }
  return [];
}

function extractReviewCount(payload: unknown, studioReviewCount?: number): number {
  if (typeof studioReviewCount === "number") return studioReviewCount;
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if ("pagination" in obj && obj.pagination && typeof obj.pagination === "object") {
      const pagination = obj.pagination as Record<string, unknown>;
      if (typeof pagination.total === "number") return pagination.total;
    }
  }
  return 0;
}

function parseCoordinate(value: number | string | null | undefined): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function formatWorkingHours(hours: StudioWorkingHour[] | undefined): WorkingHourDisplay[] {
  if (!hours || hours.length === 0) return FALLBACK_HOURS;
  
  return [...hours]
    .sort((a, b) => a.day_of_week - b.day_of_week)
    .map((item) => ({
      days: DAY_NAMES[item.day_of_week],
      hours: item.is_closed ? "Closed" : `${item.open_time?.slice(0, 5) ?? ""} - ${item.close_time?.slice(0, 5) ?? ""}`,
      closed: item.is_closed,
    }));
}

interface StudioDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function StudioDetailPage({ params }: StudioDetailPageProps) {
  const { id: studioId } = use(params);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Services");

  const { data: studioData, loading: studioLoading, error: studioError, refetch: refetchStudio } = useStudio<StudioResponse>(studioId);
  const { data: servicesData, loading: servicesLoading } = useStudioServices<ServicesResponse>(studioId);
  const { data: barbersData, loading: barbersLoading } = useStudioBarbers<BarbersResponse>(studioId);
  const { data: reviewsData } = useStudioReviews<ReviewsResponse>(studioId, { limit: "1" });

  const studio = useMemo(() => extractStudio(studioData), [studioData]);

  const services = useMemo(() => extractServices(servicesData), [servicesData]);

  const barbers = useMemo(() => extractBarbers(barbersData), [barbersData]);

  const reviewCount = useMemo(
    () => extractReviewCount(reviewsData, studio?.review_count),
    [reviewsData, studio?.review_count]
  );

  const statusText = studio?.is_open ? "ACTIVE NOW" : studio?.next_open ? `OPENS ${studio.next_open}` : "CLOSED";
  const established = studio?.created_at ? new Date(studio.created_at).getFullYear().toString() : "N/A";
  const location = [studio?.address, studio?.city, studio?.state].filter(Boolean).join(", ") || "Location unavailable";
  const lat = parseCoordinate(studio?.lat ?? studio?.latitude);
  const lng = parseCoordinate(studio?.lng ?? studio?.longitude);
  const mapQuery = lat !== null && lng !== null
    ? `${lat},${lng}`
    : location !== "Location unavailable"
      ? location
      : "London,UK";
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

  const image = studio?.banner_url || PLACEHOLDER_IMAGE;
  const workingHours = formatWorkingHours(studio?.workingHours);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const selectedServiceDetails = useMemo(
    () => services.filter((s) => selectedServices.includes(String(s.id))),
    [services, selectedServices]
  );

  const subtotal = selectedServiceDetails.reduce((sum, s) => sum + s.price, 0);
  const total = subtotal + BOOKING_FEE;

  const bookHref = useMemo(() => {
    if (selectedServices.length === 0 || !studio?.id) return "#";
    const query = new URLSearchParams({
      studioId: String(studio.id),
      services: selectedServices.join(","),
    });
    return `/user/book?${query.toString()}`;
  }, [selectedServices, studio?.id]);

  if (studioLoading) {
    return (
      <main className="pt-24 px-12">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="h-80 rounded-3xl bg-surface"></div>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 h-80 rounded-3xl bg-surface"></div>
            <div className="col-span-12 lg:col-span-4 h-80 rounded-3xl bg-surface"></div>
          </div>
        </div>
      </main>
    );
  }

  if (studioError || !studio) {
    return (
      <main className="pt-28 px-12">
        <div className="max-w-3xl mx-auto bg-surface border border-border/20 rounded-3xl p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-red-400">error</span>
          <h1 className="text-3xl font-headline font-bold mt-4 mb-2">Failed to load studio</h1>
          <p className="text-muted mb-6">{studioError || "This studio may not exist."}</p>
          <button
            onClick={() => refetchStudio()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-headline font-bold"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const isServiceSelected = (serviceId: string | number) => selectedServices.includes(String(serviceId));

  const getServiceActionText = (serviceId: string | number) => {
    return isServiceSelected(serviceId) ? "REMOVE" : "ADD SERVICE";
  };

  const getServiceIcon = (serviceId: string | number) => {
    return isServiceSelected(serviceId) ? "remove_circle" : "add_circle";
  };

  return (
    <main className="pt-20">
      <section className="relative h-[614px] w-full overflow-hidden">
        <img className="w-full h-full object-cover brightness-50" src={image} alt={studio.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-12 pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-label tracking-widest flex items-center gap-2 ${
                studio.is_open ? "bg-green-900/30 text-green-400" : "bg-surface text-foreground"
              }`}>
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                {statusText}
              </span>
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold">{studio.rating ?? "New"}</span>
                <span className="text-muted text-sm font-normal ml-1">({reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter text-foreground mb-4">{studio.name}</h1>
            <p className="font-label text-primary uppercase tracking-[0.2em] flex items-center gap-4">
              <span>{location.split(",")[0]}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
              <span>Est. {established}</span>
            </p>
          </div>
          <div className="flex gap-4 mb-2">
            <button className="p-4 rounded-full border border-border/50 backdrop-blur-md hover:bg-surface transition-all" aria-label="Share studio">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="p-4 rounded-full border border-border/50 backdrop-blur-md hover:bg-surface transition-all" aria-label="Add to favorites">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-12 py-16 grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex gap-10 border-b border-border/30 mb-12 overflow-x-auto whitespace-nowrap">
            {["Services", "Barbers", "Reviews", "Gallery"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-6 border-b-2 font-headline font-bold transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-headline font-bold mb-6 text-primary">Signature Experiences</h3>
              {servicesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((item) => (
                    <div key={item} className="h-48 rounded-2xl bg-surface animate-pulse"></div>
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/30 p-8 text-center text-muted">
                  No services available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => {
                    const serviceIdStr = String(service.id);
                    const selected = isServiceSelected(service.id);
                    return (
                      <div
                        key={service.id}
                        className={`bg-surface p-6 rounded-2xl border transition-all group cursor-pointer ${
                          selected
                            ? "border-primary/50 bg-primary/5"
                            : "border-border/10 hover:border-primary/30"
                        }`}
                        onClick={() => toggleService(serviceIdStr)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleService(serviceIdStr);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-headline font-bold text-foreground">{service.name}</h4>
                          <span className="text-primary font-label font-bold text-lg">£{service.price}</span>
                        </div>
                        <p className="text-muted text-sm mb-6 leading-relaxed">{service.description || "Premium studio service."}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-label text-secondary-foreground uppercase tracking-widest">{service.duration} MINS</span>
                          <button className="text-primary text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            {getServiceActionText(service.id)}
                            <span className="material-symbols-outlined text-sm">
                              {getServiceIcon(service.id)}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-2xl font-headline font-bold text-primary">Elite Artisans</h3>
                <Link href="/user/discover" className="text-sm font-label text-muted hover:underline underline-offset-4">
                  VIEW ALL
                </Link>
              </div>
              {barbersLoading ? (
                <div className="h-32 rounded-2xl bg-surface animate-pulse"></div>
              ) : barbers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/30 p-8 text-center text-muted">
                  No barbers listed yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-8">
                  {barbers.map((barber) => (
                    <Link 
                      key={barber.id} 
                      href={`/user/barber/${barber.id}`} 
                      className="flex flex-col items-center gap-4 group cursor-pointer"
                    >
                      <div className="w-24 h-32 rounded-tl-3xl rounded-br-3xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-all">
                        <img
                          className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                          src={barber.image_url || BARBER_PLACEHOLDER}
                          alt={barber.name}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-headline font-bold text-foreground">{barber.name}</p>
                        <p className="text-[10px] font-label text-green-400 uppercase tracking-widest">{barber.title || "Barber"}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-12 pt-8">
              <div>
                <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">location_on</span> The Studio
                </h3>
                <div className="aspect-video rounded-3xl overflow-hidden bg-surface mb-4">
                  <iframe
                    title="Studio location map"
                    className="w-full h-full border-0 grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <p className="text-muted font-body">{location}</p>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">schedule</span> Concierge Hours
                </h3>
                <ul className="space-y-4 font-label text-sm uppercase tracking-widest">
                  {workingHours.map((item) => (
                    <li key={item.days} className={`flex justify-between pb-2 border-b border-border/20 ${item.closed ? "text-primary" : ""}`}>
                      <span className={item.closed ? "" : "text-muted"}>{item.days}</span>
                      <span className={item.closed ? "" : "text-foreground"}>{item.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="sticky top-32 bg-card rounded-[2rem] p-8 shadow-floating border border-border/10">
            <h3 className="text-2xl font-headline font-bold mb-8 text-foreground">Your Reservation</h3>
            <div className="space-y-6 mb-8">
              {selectedServiceDetails.length > 0 ? (
                selectedServiceDetails.map((service) => (
                  <div key={service.id} className="flex items-start gap-4 p-4 rounded-2xl bg-surface/50 border border-primary/20">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <span className="material-symbols-outlined text-primary">content_cut</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-headline font-bold text-foreground text-sm">{service.name}</p>
                        <button 
                          onClick={() => toggleService(String(service.id))} 
                          className="text-muted hover:text-red-400 transition-colors"
                          aria-label={`Remove ${service.name}`}
                        >
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                      <p className="text-xs font-label text-secondary-foreground uppercase tracking-wider mt-1">
                        {service.duration} • £{service.price}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="border-2 border-dashed border-border/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
                  <span className="material-symbols-outlined text-secondary-foreground">add_circle</span>
                  <p className="text-xs font-label text-secondary-foreground uppercase tracking-widest">Select services above</p>
                </div>
              )}
            </div>

            {selectedServices.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-border/30 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted font-label uppercase tracking-widest">Subtotal</span>
                  <span className="text-foreground font-bold">£{subtotal}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted font-label uppercase tracking-widest">Booking Fee</span>
                  <span className="text-foreground font-bold">£{BOOKING_FEE}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border/20">
                  <span className="text-primary font-headline font-bold">Total Estimate</span>
                  <span className="text-2xl font-headline font-black text-primary tracking-tighter">£{total}</span>
                </div>
              </div>
            )}

            <Link
              href={selectedServices.length > 0 ? bookHref : "#"}
              className={`w-full py-5 rounded-2xl font-headline font-black text-lg tracking-tighter shadow-xl flex items-center justify-center gap-3 transition-all ${
                selectedServices.length > 0
                  ? "bg-gradient-to-r from-primary-fixed-dim to-primary-container text-primary-foreground hover:brightness-110 active:scale-[0.98]"
                  : "bg-surface text-secondary-foreground cursor-not-allowed"
              }`}
              aria-disabled={selectedServices.length === 0}
              onClick={(e) => {
                if (selectedServices.length === 0) e.preventDefault();
              }}
            >
              BOOK A SLOT <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </Link>
            <p className="text-[10px] text-center text-secondary-foreground uppercase font-label tracking-widest mt-6">
              Cancellation policy applies. Secure checkout powered by Revoras.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
