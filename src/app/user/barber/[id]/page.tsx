"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Star, BadgeCheck, Award as AwardIcon, ExternalLink, ChevronLeft, ChevronRight, X,
  Instagram, Facebook, Linkedin, Globe, ChevronRight as ChevronRightSm, Store,
} from "lucide-react";
import { Container, Card, Avatar, Badge, TimeSlotPicker, Button, ErrorState, TrustBadges } from "@/components/ui";
import { useProfessional, useBusiness, useAvailability } from "@/lib/hooks";
import { SectionNav } from "@/components/user/business/DetailChrome";
import ReviewSection from "@/components/user/sections/ReviewSection";
import type { ProfessionalSocialLinks } from "@/lib/types";

const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const scrollToBooking = () =>
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-32 flex-col gap-4">
      <h2 className="font-headline text-xl font-semibold text-on-surface">{title}</h2>
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

  // Authoritative: the server already applies the shop's hours and this
  // professional's own rota, so no client-side filtering is needed on top.
  const { slots: availableTimes, loading: slotsLoading } = useAvailability(
    professional?.studio_id ?? "",
    professional?.id ?? null,
    selectedDate
  );

  useEffect(() => {
    if (!availableTimes.includes(selectedSlot ?? "")) setSelectedSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTimes]);

  const handleConfirm = () => {
    if (!professional || !selectedSlot) return;
    const qs = new URLSearchParams({ studioId: professional.studio_id, barberId: professional.id, date: selectedDate, time: selectedSlot });
    router.push(`/user/book?${qs.toString()}`);
  };

  if (loading) {
    return (
      <Container width="lg" className="py-8">
        <div className="h-80 animate-pulse rounded-3xl bg-surface-container-high" />
      </Container>
    );
  }

  if (error || !professional) {
    return (
      <Container width="lg" className="py-16">
        <ErrorState description={error || "This professional may not exist or is no longer available."} onRetry={refetch} />
      </Container>
    );
  }

  const featuredServices = (business?.services ?? []).filter((s) => professional.featured_service_ids?.includes(s.id));
  const socialLinks = PRO_SOCIAL.filter((s) => professional.social_links?.[s.key]);
  const portfolio = [...(professional.portfolio ?? [])].sort(
    (a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order
  );
  const certificates = professional.certificates ?? [];
  const rating = Number(professional.rating ?? 0);
  const cover = portfolio.find((p) => p.is_cover)?.media_url ?? portfolio[0]?.media_url ?? null;
  const peers = (business?.professionals ?? []).filter((p) => p.id !== professional.id);

  const sectionNav: { id: string; label: string }[] = [];
  if (portfolio.length) sectionNav.push({ id: "portfolio", label: "Portfolio" });
  if (featuredServices.length) sectionNav.push({ id: "services", label: "Services" });
  if (professional.education?.length || professional.experience_years) sectionNav.push({ id: "experience", label: "Experience" });
  if (certificates.length) sectionNav.push({ id: "certificates", label: "Certificates" });
  sectionNav.push({ id: "reviews", label: "Reviews" });

  return (
    <>
      <Container width="lg" className="flex flex-col gap-6 py-6">
        <Link
          href={`/user/business/${professional.studio_id}`}
          className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-on-surface"
        >
          <ArrowLeft size={16} /> Back to {professional.business_name}
        </Link>

        {/* Hero — portfolio-forward */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="relative h-40 md:h-56">
            {cover ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- portfolio cover */}
                <img src={cover} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
              </>
            ) : (
              <div className="brand-gradient h-full w-full">
                <div className="grainy-overlay absolute inset-0" />
              </div>
            )}
          </div>

          <div className="px-5 pb-6 md:px-8">
            {/* Only the avatar overlaps the cover; identity + CTA sit below it, on the card. */}
            <div className="-mt-14 w-fit">
              <Avatar
                name={professional.name}
                src={professional.image_url ?? undefined}
                size="xl"
                className="ring-4 ring-card shadow-elevated"
              />
            </div>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {professional.designation && (
                  <p className="text-xs font-medium uppercase tracking-wide text-primary">{professional.designation}</p>
                )}
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">{professional.name}</h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  {rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-on-surface">
                      <Star size={14} className="fill-primary text-primary" />
                      <span className="font-semibold">{rating.toFixed(1)}</span>
                    </span>
                  )}
                  {professional.experience_years ? (
                    <span className="text-muted">{professional.experience_years} yrs experience</span>
                  ) : null}
                  {professional.badges && professional.badges.length > 0 && (
                    <TrustBadges badges={professional.badges} max={2} size={12} />
                  )}
                </div>
              </div>
              <Button size="lg" onClick={scrollToBooking} className="shrink-0">
                Book now
              </Button>
            </div>

            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
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
            )}
          </div>
        </section>

        <SectionNav sections={sectionNav} />

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Left: portfolio & story */}
          <div className="flex min-w-0 flex-col gap-10">
            {professional.bio && (
              <Block id="about" title="About">
                <p className="whitespace-pre-line text-sm leading-relaxed text-secondary-foreground">{professional.bio}</p>
              </Block>
            )}

            {portfolio.length > 0 && (
              <Block id="portfolio" title="Portfolio">
                <div className="columns-2 gap-3 md:columns-3 [&>button]:mb-3">
                  {portfolio.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="group block w-full break-inside-avoid overflow-hidden rounded-xl border border-border"
                      aria-label={img.caption ?? "View portfolio image"}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.media_url}
                        alt={img.caption ?? "Portfolio image"}
                        className="w-full object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </Block>
            )}

            {featuredServices.length > 0 && (
              <Block id="services" title="Featured services">
                <div className="grid gap-3 sm:grid-cols-2">
                  {featuredServices.map((s) => (
                    <Card key={s.id} padding="md" className="flex items-center justify-between">
                      <span className="text-sm font-medium text-on-surface">{s.name}</span>
                      <span className="text-sm text-muted">₹{s.price} · {s.duration}m</span>
                    </Card>
                  ))}
                </div>
              </Block>
            )}

            {(professional.education?.length || professional.experience_years) ? (
              <Block id="experience" title="Experience">
                {professional.experience_years ? (
                  <p className="text-sm text-secondary-foreground">
                    {professional.experience_years} years of professional experience.
                  </p>
                ) : null}
                {professional.education?.length ? (
                  <div className="flex flex-col gap-3">
                    {professional.education.map((e, i) => (
                      <Card key={`${e.institution}-${i}`} padding="md">
                        <div className="text-sm font-medium text-on-surface">{e.institution}</div>
                        {(e.degree || e.year) && (
                          <div className="text-sm text-muted">{[e.degree, e.year].filter(Boolean).join(" · ")}</div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : null}
              </Block>
            ) : null}

            {professional.specialties.length > 0 && (
              <Block id="specializations" title="Specializations">
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((s) => (
                    <Badge key={s} tone="primary">{s}</Badge>
                  ))}
                </div>
              </Block>
            )}

            {professional.languages?.length > 0 && (
              <Block id="languages" title="Languages">
                <div className="flex flex-wrap gap-2">
                  {professional.languages.map((l) => (
                    <span key={l} className="rounded-full bg-surface-container-high px-3 py-1 text-sm text-on-surface-variant">{l}</span>
                  ))}
                </div>
              </Block>
            )}

            {certificates.length > 0 && (
              <Block id="certificates" title="Certifications">
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
                        {(c.issued_date || c.expiry_date) && (
                          <div className="text-xs text-muted">
                            {[c.issued_date?.slice(0, 10), c.expiry_date ? `exp ${c.expiry_date.slice(0, 10)}` : ""].filter(Boolean).join(" · ")}
                          </div>
                        )}
                        {c.credential_id && <div className="text-xs text-muted">ID: {c.credential_id}</div>}
                        {c.verification_url && (
                          <a href={c.verification_url} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                            View certificate <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </Block>
            )}

            {professional.awards?.length > 0 && (
              <Block id="awards" title="Awards">
                <div className="flex flex-col gap-3">
                  {professional.awards.map((a, i) => (
                    <Card key={`${a.title}-${i}`} padding="md" className="flex items-start gap-3">
                      <AwardIcon size={18} className="mt-0.5 shrink-0 text-primary" />
                      <div>
                        <div className="text-sm font-medium text-on-surface">{a.title}</div>
                        {a.year && <div className="text-sm text-muted">{a.year}</div>}
                      </div>
                    </Card>
                  ))}
                </div>
              </Block>
            )}

            <Block id="reviews" title="Reviews">
              <ReviewSection businessId={professional.studio_id} />
            </Block>

            {peers.length > 0 && (
              <Block id="team" title={`More from ${professional.business_name}`}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {peers.slice(0, 6).map((p) => (
                    <Link
                      key={p.id}
                      href={`/user/barber/${p.id}`}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-shadow hover:shadow-elevated"
                    >
                      <Avatar name={p.name} src={p.image_url ?? undefined} size="lg" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-on-surface">{p.name}</div>
                        {p.designation && <div className="truncate text-xs text-muted">{p.designation}</div>}
                      </div>
                    </Link>
                  ))}
                </div>
              </Block>
            )}
          </div>

          {/* Right: Works-at + sticky booking (desktop) */}
          {/* min-w-0 for the same reason as the left column: a grid item's
              automatic minimum size is its min-content, and the date strip's
              rigid w-14 buttons make that 378px - wider than the mobile track,
              which widened the single column and bled the whole page 4px. */}
          <aside className="flex min-w-0 flex-col gap-4">
            {business && (
              <Link
                href={`/user/business/${professional.studio_id}`}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-elevated"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Store size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted">Works at</div>
                  <div className="truncate font-semibold text-on-surface">{professional.business_name}</div>
                  {business.category_name && <div className="truncate text-xs text-muted">{business.category_name}</div>}
                </div>
                <ChevronRightSm size={18} className="shrink-0 text-muted" />
              </Link>
            )}

            <div id="booking" className="scroll-mt-24 lg:sticky lg:top-24">
              <Card padding="lg" className="flex flex-col gap-5">
                <h3 className="font-headline text-lg font-bold text-on-surface">Book with {professional.name.split(" ")[0]}</h3>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted">Select date</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {dateOptions.map((d) => (
                      <button
                        key={d.iso}
                        onClick={() => setSelectedDate(d.iso)}
                        className={`flex w-14 shrink-0 flex-col items-center rounded-xl border py-2 transition-colors ${
                          selectedDate === d.iso ? "border-primary bg-primary text-primary-foreground" : "border-border text-on-surface hover:bg-surface-container-low"
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
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile floating Book Now */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur-sm lg:hidden">
        <Button size="lg" className="w-full" onClick={scrollToBooking}>
          Book with {professional.name.split(" ")[0]}
        </Button>
      </div>

      {lightbox !== null && portfolio[lightbox] ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setLightbox(null)}>
          <button type="button" aria-label="Close" className="absolute right-4 top-4 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
            <X size={28} />
          </button>
          {portfolio.length > 1 && (
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v === null ? v : (v - 1 + portfolio.length) % portfolio.length)); }}
            >
              <ChevronLeft size={32} />
            </button>
          )}
          <div className="max-h-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portfolio[lightbox].media_url} alt={portfolio[lightbox].caption ?? "Portfolio image"} className="max-h-[80vh] w-auto rounded-lg object-contain" />
            {portfolio[lightbox].caption && <p className="mt-3 text-center text-sm text-white/80">{portfolio[lightbox].caption}</p>}
          </div>
          {portfolio.length > 1 && (
            <button
              type="button"
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v === null ? v : (v + 1) % portfolio.length)); }}
            >
              <ChevronRight size={32} />
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}
