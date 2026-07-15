"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, BadgeCheck, Award as AwardIcon, ExternalLink, ChevronLeft, ChevronRight, X, Instagram, Facebook, Linkedin, Globe } from "lucide-react";
import { Container, Card, Avatar, Badge, TimeSlotPicker, Button, ErrorState, TrustBadges } from "@/components/ui";
import { useProfessional, useBusiness, useAvailability } from "@/lib/hooks";
import { filterSlotsByWorkingHours } from "@/components/user/sections/utils";
import ReviewSection from "@/components/user/sections/ReviewSection";
import type { ProfessionalSocialLinks } from "@/lib/types";

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ProSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-headline text-xl font-bold text-on-surface">{title}</h2>
      {children}
    </section>
  );
}

const PRO_SOCIAL: { key: keyof ProfessionalSocialLinks; Icon: typeof Star; label: string; base: (v: string) => string }[] = [
  { key: "instagram", Icon: Instagram, label: "Instagram", base: (v) => `https://instagram.com/${v.replace(/^@/, "")}` },
  { key: "facebook", Icon: Facebook, label: "Facebook", base: (v) => `https://facebook.com/${v}` },
  { key: "linkedin", Icon: Linkedin, label: "LinkedIn", base: (v) => `https://linkedin.com/in/${v}` },
  { key: "website", Icon: Globe, label: "Website", base: (v) => v },
];

export default function ProfessionalProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const dateOptions = useMemo(() => {
    const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    return Array.from({ length: 5 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return { iso: toIsoDate(date), day: dayFmt.format(date), date: date.getDate() };
    });
  }, []);

  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.iso ?? toIsoDate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data, loading, error, refetch } = useProfessional(id);
  const professional = data?.professional;

  const { data: businessData } = useBusiness(professional?.studio_id ?? "");
  const business = businessData?.business;

  const { slots, loading: slotsLoading } = useAvailability(
    professional?.studio_id ?? "",
    professional?.id ?? null,
    selectedDate
  );

  const availableTimes = useMemo(
    () => (business ? filterSlotsByWorkingHours(slots, business.workingHours, selectedDate) : slots),
    [slots, business, selectedDate]
  );

  useEffect(() => {
    if (!availableTimes.includes(selectedSlot ?? "")) setSelectedSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTimes]);

  const handleConfirm = () => {
    if (!professional || !selectedSlot) return;
    const params = new URLSearchParams({
      studioId: professional.studio_id,
      barberId: professional.id,
      date: selectedDate,
      time: selectedSlot,
    });
    router.push(`/user/book?${params.toString()}`);
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="h-96 animate-pulse rounded-2xl bg-surface-container-high" />
      </Container>
    );
  }

  if (error || !professional) {
    return (
      <Container className="py-16">
        <ErrorState description={error || "This professional may not exist or is no longer available."} onRetry={refetch} />
      </Container>
    );
  }

  const featuredServices = (business?.services ?? []).filter((s) => professional.featured_service_ids?.includes(s.id));
  const socialLinks = PRO_SOCIAL.filter((s) => professional.social_links?.[s.key]);
  // Cover first, then saved order.
  const portfolio = [...(professional.portfolio ?? [])].sort(
    (a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order
  );
  const certificates = professional.certificates ?? [];

  return (
    <Container className="flex flex-col gap-10 py-8">
      <Link href={`/user/business/${professional.studio_id}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-on-surface">
        <ArrowLeft size={16} />
        Back to {professional.business_name}
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-8">
          {/* Hero */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <Avatar name={professional.name} src={professional.image_url ?? undefined} size="xl" />
              <div>
                {professional.designation ? (
                  <p className="text-xs uppercase tracking-wide text-primary">{professional.designation}</p>
                ) : null}
                <h1 className="font-headline text-3xl font-bold text-on-surface">{professional.name}</h1>
                <p className="text-sm text-muted">at {professional.business_name}</p>
                <TrustBadges badges={professional.badges} className="mt-2" />
              </div>
            </div>
            {(Number(professional.rating) > 0 || professional.experience_years) ? (
              <div className="flex flex-wrap gap-2">
                {Number(professional.rating) > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-sm font-medium text-on-surface">
                    <Star size={16} className="fill-primary text-primary" /> {Number(professional.rating).toFixed(1)}
                  </span>
                ) : null}
                {professional.experience_years ? (
                  <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 text-sm text-muted">
                    {professional.experience_years} yrs experience
                  </span>
                ) : null}
              </div>
            ) : null}
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ key, Icon, label, base }) => {
                  const value = professional.social_links[key] as string;
                  const href = /^https?:\/\//i.test(value) ? value : base(value);
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-container-high"
                    >
                      <Icon size={16} /> {label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          {professional.bio ? (
            <ProSection title="About">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{professional.bio}</p>
            </ProSection>
          ) : null}

          {professional.specialties.length > 0 ? (
            <ProSection title="Specializations">
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </ProSection>
          ) : null}

          {professional.languages?.length > 0 ? (
            <ProSection title="Languages">
              <div className="flex flex-wrap gap-2">
                {professional.languages.map((l) => (
                  <span key={l} className="rounded-full bg-surface-container-high px-3 py-1 text-sm text-muted">
                    {l}
                  </span>
                ))}
              </div>
            </ProSection>
          ) : null}

          {featuredServices.length > 0 ? (
            <ProSection title="Featured services">
              <div className="grid gap-3 sm:grid-cols-2">
                {featuredServices.map((s) => (
                  <Card key={s.id} padding="md" className="flex items-center justify-between">
                    <span className="text-sm font-medium text-on-surface">{s.name}</span>
                    <span className="text-sm text-muted">
                      ₹{s.price} · {s.duration}m
                    </span>
                  </Card>
                ))}
              </div>
            </ProSection>
          ) : null}

          {professional.education?.length > 0 ? (
            <ProSection title="Education">
              <div className="flex flex-col gap-3">
                {professional.education.map((e, i) => (
                  <Card key={`${e.institution}-${i}`} padding="md">
                    <div className="text-sm font-medium text-on-surface">{e.institution}</div>
                    {(e.degree || e.year) ? (
                      <div className="text-sm text-muted">{[e.degree, e.year].filter(Boolean).join(" · ")}</div>
                    ) : null}
                  </Card>
                ))}
              </div>
            </ProSection>
          ) : null}

          {certificates.length > 0 ? (
            <ProSection title="Certifications">
              <div className="grid gap-3 sm:grid-cols-2">
                {certificates.map((c) => (
                  <Card key={c.id} padding="md" className="flex gap-3">
                    {c.media_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.media_url} alt={c.title} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <BadgeCheck size={20} className="mt-0.5 shrink-0 text-primary" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-on-surface">{c.title}</div>
                      <div className="text-sm text-muted">{c.issuer}</div>
                      {(c.issued_date || c.expiry_date) ? (
                        <div className="text-xs text-muted">
                          {[c.issued_date?.slice(0, 10), c.expiry_date ? `exp ${c.expiry_date.slice(0, 10)}` : ""]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      ) : null}
                      {c.credential_id ? <div className="text-xs text-muted">ID: {c.credential_id}</div> : null}
                      {c.verification_url ? (
                        <a
                          href={c.verification_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          View certificate <ExternalLink size={12} />
                        </a>
                      ) : null}
                    </div>
                  </Card>
                ))}
              </div>
            </ProSection>
          ) : null}

          {professional.awards?.length > 0 ? (
            <ProSection title="Awards">
              <div className="flex flex-col gap-3">
                {professional.awards.map((a, i) => (
                  <Card key={`${a.title}-${i}`} padding="md" className="flex items-start gap-3">
                    <AwardIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                    <div>
                      <div className="text-sm font-medium text-on-surface">{a.title}</div>
                      {a.year ? <div className="text-sm text-muted">{a.year}</div> : null}
                    </div>
                  </Card>
                ))}
              </div>
            </ProSection>
          ) : null}

          {portfolio.length > 0 ? (
            <ProSection title="Portfolio">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {portfolio.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="group overflow-hidden rounded-xl border border-border"
                    aria-label={img.caption ?? "View portfolio image"}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.media_url}
                      alt={img.caption ?? "Portfolio image"}
                      className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </ProSection>
          ) : null}

          <ProSection title="Reviews">
            <ReviewSection businessId={professional.studio_id} />
          </ProSection>
        </div>

        <aside className="lg:col-span-4">
          <Card padding="lg" className="sticky top-20 flex flex-col gap-5">
            <h3 className="font-headline text-lg font-bold text-on-surface">Quick booking</h3>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Select date</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dateOptions.map((d) => (
                  <button
                    key={d.iso}
                    onClick={() => setSelectedDate(d.iso)}
                    className={`flex w-14 shrink-0 flex-col items-center rounded-lg border py-2 transition-colors ${
                      selectedDate === d.iso ? "border-primary bg-primary text-on-primary" : "border-border text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="text-xs">{d.day}</span>
                    <span className="font-bold">{d.date}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Available times</p>
              {slotsLoading ? (
                <div className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
              ) : (
                <TimeSlotPicker slots={availableTimes} selected={selectedSlot ?? undefined} onSelect={setSelectedSlot} />
              )}
            </div>

            <Button size="lg" disabled={!selectedSlot} onClick={handleConfirm}>
              {selectedSlot ? "Continue to booking" : "Select a slot"}
            </Button>
          </Card>
        </aside>
      </div>

      {lightbox !== null && portfolio[lightbox] ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="Close" className="absolute right-4 top-4 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          {portfolio.length > 1 ? (
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((v) => (v === null ? v : (v - 1 + portfolio.length) % portfolio.length));
              }}
            >
              <ChevronLeft size={32} />
            </button>
          ) : null}
          <div className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portfolio[lightbox].media_url}
              alt={portfolio[lightbox].caption ?? "Portfolio image"}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {portfolio[lightbox].caption ? (
              <p className="mt-3 text-center text-sm text-white/80">{portfolio[lightbox].caption}</p>
            ) : null}
          </div>
          {portfolio.length > 1 ? (
            <button
              type="button"
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((v) => (v === null ? v : (v + 1) % portfolio.length));
              }}
            >
              <ChevronRight size={32} />
            </button>
          ) : null}
        </div>
      ) : null}
    </Container>
  );
}
