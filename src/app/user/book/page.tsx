"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check, ChevronLeft, ArrowRight, Clock, ShieldCheck, Tag, Sparkles, CalendarClock,
} from "lucide-react";
import { Container, Avatar, Textarea, Button, ErrorState } from "@/components/ui";
import { SlotGrid } from "@/components/user/booking/SlotGrid";
import { ServiceFitModal } from "@/components/user/booking/ServiceFitModal";
import { ServicePicker } from "@/components/user/booking/ServicePicker";
import { ProfessionalPicker, type ProfessionalFit } from "@/components/user/booking/ProfessionalPicker";
import { api } from "@/lib/api";
import { useBusiness, useAvailability } from "@/lib/hooks";
import { displayDuration, displayTime, emptySlotCopy } from "@/lib/slot-fit";
import type { BusinessDetail, Service, AvailabilityReason, AvailabilityResponse, AvailabilitySlot } from "@/lib/types";

const parseIdList = (v: string | null): string[] =>
  v ? v.split(",").map((x) => x.trim()).filter(Boolean) : [];

const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const inr = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const STEPS = ["Services", "Professional", "Date", "Time", "Confirm"] as const;

/* --------------------------------- stepper -------------------------------- */

function Stepper({ step, maxReached, onGo }: { step: number; maxReached: number; onGo: (i: number) => void }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const current = i === step;
        const reachable = i <= maxReached;
        return (
          <div key={label} className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={!reachable}
              onClick={() => reachable && onGo(i)}
              className="group flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <span className="flex w-full items-center">
                <span className={`h-1 flex-1 rounded-full ${i === 0 ? "opacity-0" : done || current ? "bg-primary" : "bg-surface-container-highest"}`} />
                <span
                  className={`mx-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    done ? "bg-primary text-primary-foreground" : current ? "bg-primary/15 text-primary ring-2 ring-primary" : "bg-surface-container-high text-muted"
                  }`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <span className={`h-1 flex-1 rounded-full ${i === STEPS.length - 1 ? "opacity-0" : done ? "bg-primary" : "bg-surface-container-highest"}`} />
              </span>
              <span className={`truncate text-[11px] font-medium ${current ? "text-on-surface" : "text-muted"} hidden sm:block`}>{label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------- step: services --------------------------- */

function ServiceStep({
  services,
  professionals,
  selected,
  onToggle,
}: {
  services: Service[];
  professionals: BusinessDetail["professionals"];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <ServicePicker
      services={services}
      professionals={professionals}
      selectedIds={selected}
      onToggle={onToggle}
      emptyLabel="This studio hasn't listed any services yet"
    />
  );
}

/* ----------------------------- step: professional ------------------------- */

function ProfessionalStep({
  professionals,
  selectedServices,
  selectedId,
  onSelect,
  fitFor,
}: {
  professionals: BusinessDetail["professionals"];
  selectedServices: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
  fitFor: (professionalId: string) => ProfessionalFit;
}) {
  return (
    <ProfessionalPicker
      professionals={professionals}
      selectedServices={selectedServices}
      selectedId={selectedId}
      onSelect={onSelect}
      fitFor={fitFor}
    />
  );
}

/* -------------------------------- step: date ------------------------------ */

function DateStep({ dateOptions, selected, onSelect }: { dateOptions: { iso: string; day: string; month: string; date: number; label: string }[]; selected: string; onSelect: (iso: string) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {dateOptions.map((d) => {
        const isOn = selected === d.iso;
        return (
          <button
            key={d.iso}
            type="button"
            onClick={() => onSelect(d.iso)}
            className={`flex w-20 shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors ${
              isOn ? "border-primary bg-primary text-primary-foreground" : "border-border text-on-surface hover:bg-surface-container-low"
            }`}
          >
            <span className={`text-xs ${isOn ? "text-primary-foreground/80" : "text-muted"}`}>{d.label}</span>
            <span className="text-xl font-bold">{d.date}</span>
            <span className={`text-xs ${isOn ? "text-primary-foreground/80" : "text-muted"}`}>{d.month}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------- step: time ------------------------------ */

function TimeStep({
  loading,
  error,
  onRetry,
  reason,
  shift,
  professionalName,
  grid,
  requiredDuration,
  interval,
  selected,
  onSelect,
  onTooShort,
  hasPro,
}: {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  reason: AvailabilityReason | null;
  shift: AvailabilityResponse["shift"];
  professionalName?: string;
  grid: AvailabilitySlot[];
  requiredDuration: number;
  interval: number | null;
  selected: string | null;
  onSelect: (t: string) => void;
  onTooShort: (slot: AvailabilitySlot) => void;
  hasPro: boolean;
}) {
  if (!hasPro) return <p className="text-sm text-muted">Select a professional first to see their available times.</p>;
  if (loading) return <div className="h-24 animate-pulse rounded-2xl bg-surface-container-high" />;
  if (error) return <ErrorState description={error} onRetry={onRetry} />;
  // A day the professional doesn't work at all has no grid to show - only an
  // explanation. A day that's merely full still renders, so the customer can
  // see who's taken and what's just too tight for their selection.
  if (grid.length === 0) {
    const { title, hint } = emptySlotCopy(reason, { who: professionalName });
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <CalendarClock size={22} className="mx-auto text-muted" />
        <p className="mt-2 text-sm font-medium text-on-surface">{title}</p>
        <p className="text-xs text-muted">{hint}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {shift ? (
          <p className="text-xs text-muted">
            {professionalName || "Working"} {shift.start}–{shift.end} on this date
            {shift.source === "member" ? " (personal schedule)" : ""}
          </p>
        ) : <span />}
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-medium text-on-surface">
          <Clock size={11} className="text-primary" /> Your booking needs {displayDuration(requiredDuration)}
        </span>
      </div>

      <SlotGrid
        grid={grid}
        selected={selected}
        requiredDuration={requiredDuration}
        interval={interval}
        onSelect={onSelect}
        onTooShort={onTooShort}
      />
    </div>
  );
}

/* --------------------------------- summary -------------------------------- */

interface Quote { discountAmount: number; total: number; offer: { label: string } | null }

function Summary({
  business, professionalName, services, duration, subtotal, quote, date, time, priceFor,
}: {
  business: BusinessDetail;
  professionalName?: string;
  services: Service[];
  duration: number;
  subtotal: number;
  quote: Quote | null;
  date?: string;
  time?: string | null;
  /** The chosen professional's price for a service, falling back to the catalogue's. */
  priceFor: (service: Service) => number;
}) {
  const total = quote ? quote.total : subtotal;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar name={business.name} src={business.image_url ?? undefined} size="md" />
        <div className="min-w-0">
          <div className="truncate font-headline text-sm font-bold text-on-surface">{business.name}</div>
          {professionalName && <div className="truncate text-xs text-muted">with {professionalName}</div>}
        </div>
      </div>

      {(date || time) && (
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 text-xs text-on-surface">
          <CalendarClock size={14} className="text-primary" />
          {date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "Pick a date"}
          {time ? ` · ${displayTime(time)}` : ""}
        </div>
      )}

      {services.length > 0 ? (
        <ul className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
          {services.map((s) => (
            <li key={s.id} className="flex justify-between gap-2">
              <span className="truncate text-on-surface">{s.name}</span>
              <span className="shrink-0 tabular-nums text-muted">{inr(priceFor(s))}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-t border-border pt-3 text-sm text-muted">No services selected yet.</p>
      )}

      {services.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><Clock size={12} /> Duration</span>
          <span>{duration} min</span>
        </div>
      )}

      {quote && quote.discountAmount > 0 && (
        <div className="flex flex-col gap-1 rounded-xl bg-secondary-container/40 p-3 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span className="tabular-nums">{inr(subtotal)}</span></div>
          <div className="flex items-center justify-between font-medium text-secondary">
            <span className="inline-flex items-center gap-1"><Tag size={13} /> {quote.offer?.label ?? "Offer applied"}</span>
            <span className="tabular-nums">−{inr(quote.discountAmount)}</span>
          </div>
        </div>
      )}

      <div className="flex items-end justify-between border-t border-border pt-3">
        <span className="font-medium text-on-surface">Total</span>
        <span className="font-headline text-2xl font-extrabold text-primary tabular-nums">{inr(total)}</span>
      </div>
    </div>
  );
}

/* -------------------------------- confirm --------------------------------- */

function ConfirmStep({ business, notes, onNotes }: { business: BusinessDetail; notes: string; onNotes: (v: string) => void }) {
  const cancellation = business.policies?.cancellation;
  return (
    <div className="flex flex-col gap-6">
      {business.amenities && business.amenities.length > 0 && (
        <div>
          <div className="mb-2 font-headline text-sm font-semibold text-on-surface">Good to know</div>
          <div className="flex flex-wrap gap-2">
            {business.amenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-on-surface">
                <Check size={12} className="text-primary" /> {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-primary" />
        <div>
          <div className="text-sm font-medium text-on-surface">Cancellation policy</div>
          <p className="text-xs text-muted">{cancellation || "Free cancellation up to a few hours before your appointment. See studio policy for details."}</p>
        </div>
      </div>

      <div>
        <div className="mb-2 font-headline text-sm font-semibold text-on-surface">Notes for the studio (optional)</div>
        <Textarea value={notes} onChange={(e) => onNotes(e.target.value)} maxLength={250} rows={3} placeholder="Anything the professional should know?" />
      </div>
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studioId = searchParams.get("studioId")?.trim() ?? "";
  const preselectedServiceIds = useMemo(() => parseIdList(searchParams.get("services")), [searchParams]);
  const preselectedProfessionalId = searchParams.get("barberId")?.trim() ?? "";

  const dateOptions = useMemo(() => {
    const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
    return Array.from({ length: 10 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = i === 0 ? "Today" : i === 1 ? "Tmrw" : dayFmt.format(d);
      return { iso: toIsoDate(d), day: dayFmt.format(d), month: monthFmt.format(d), date: d.getDate(), label };
    });
  }, []);

  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(preselectedServiceIds);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(preselectedProfessionalId);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.iso ?? toIsoDate(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  // The slot the customer tapped that can't hold their whole selection; drives
  // the fit dialog. Null when the dialog is closed.
  const [tightSlot, setTightSlot] = useState<AvailabilitySlot | null>(null);

  const { data, loading, error, refetch } = useBusiness(studioId);
  const business = data?.business;
  const services = useMemo(() => business?.services ?? [], [business]);
  const professionals = useMemo(() => business?.professionals ?? [], [business]);

  const selectedServices = useMemo(() => services.filter((s) => selectedServiceIds.includes(s.id)), [services, selectedServiceIds]);
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId);

  /**
   * Per-professional durations and prices, keyed by professional then service.
   *
   * The same haircut is 25 minutes with one barber and 40 with another, so
   * "how long is my appointment" has no answer until a chair is chosen. The
   * server sends the whole matrix with the business so this step doesn't need a
   * round trip per professional.
   */
  const proServiceMap = useMemo(() => {
    const map = new Map<string, Map<string, { duration: number; price: number }>>();
    for (const p of professionals) {
      const own = new Map<string, { duration: number; price: number }>();
      for (const row of p.services ?? []) own.set(row.serviceId, { duration: row.duration, price: row.price });
      map.set(p.id, own);
    }
    return map;
  }, [professionals]);

  /** What this basket costs and takes with one specific professional. */
  const fitFor = useMemo(
    () =>
      (professionalId: string): ProfessionalFit => {
        const own = proServiceMap.get(professionalId);
        let duration = 0;
        let price = 0;
        const missing: string[] = [];
        for (const s of selectedServices) {
          const row = own?.get(s.id);
          if (!row) {
            missing.push(s.name);
            continue;
          }
          duration += row.duration;
          price += row.price;
        }
        return { duration, price, missing };
      },
    [proServiceMap, selectedServices]
  );

  const priceFor = useMemo(
    () => (service: Service) =>
      proServiceMap.get(selectedProfessionalId)?.get(service.id)?.price ?? Number(service.price),
    [proServiceMap, selectedProfessionalId]
  );

  // Once a professional is chosen, THEIR figures are the real ones. Before that,
  // the catalogue's stand in for the summary.
  const selectedFit = selectedProfessionalId ? fitFor(selectedProfessionalId) : null;

  /**
   * Default to someone who can actually do the basket.
   *
   * Picking professionals[0] blindly used to be harmless; now that a
   * professional can be ineligible — and ineligible cards aren't selectable —
   * it could seat the customer on a disabled card with no way forward. Also
   * re-runs when the basket changes, so adding a service nobody-but-Rahul does
   * moves the selection to Rahul instead of silently blocking Continue.
   */
  useEffect(() => {
    if (professionals.length === 0) return;
    if (selectedProfessionalId && fitFor(selectedProfessionalId).missing.length === 0) return;
    const eligible = professionals.find((p) => fitFor(p.id).missing.length === 0);
    // If nobody qualifies, leave the current pick alone: the picker explains why
    // the whole team is greyed out, which beats a silent reset.
    if (eligible) setSelectedProfessionalId(eligible.id);
    else if (!selectedProfessionalId) setSelectedProfessionalId(professionals[0].id);
  }, [professionals, selectedProfessionalId, fitFor]);
  const totalDuration =
    selectedFit && selectedFit.missing.length === 0
      ? selectedFit.duration
      : selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const subtotal =
    selectedFit && selectedFit.missing.length === 0
      ? selectedFit.price
      : selectedServices.reduce((sum, s) => sum + Number(s.price), 0);

  // The server sizes the appointment from the selected services and applies the
  // shop's hours, the professional's rota, their time off and their bookings.
  // `slots` is therefore final - the old client-side working-hours filter here
  // existed only because availability used to return a fixed 09:00-20:00 grid,
  // and it wrongly hid legitimate early/late slots at shops open outside it.
  const {
    slots: availableTimes,
    grid: slotGrid,
    interval: slotInterval,
    reason: slotsReason,
    shift,
    loading: slotsLoading,
    error: slotsError,
    refetch: refetchSlots,
  } = useAvailability(
    studioId,
    selectedProfessionalId || null,
    selectedDate,
    totalDuration || undefined,
    selectedServiceIds.length > 0 ? selectedServiceIds : undefined
  );

  useEffect(() => {
    if (!availableTimes.includes(selectedTime ?? "")) setSelectedTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTimes]);

  // Auto-applied offer preview — same engine that charges at checkout.
  const serviceKey = selectedServiceIds.join(",");
  useEffect(() => {
    if (!studioId || selectedServiceIds.length === 0) { setQuote(null); return; }
    let cancelled = false;
    // Prices are per-professional too, so re-quote once a chair is chosen —
    // otherwise the discount would be computed against the wrong subtotal.
    api.quoteBooking(studioId, selectedServiceIds, selectedProfessionalId || undefined)
      .then((res) => { if (!cancelled && res.quote) setQuote({ discountAmount: res.quote.discountAmount, total: res.quote.total, offer: res.quote.offer }); })
      .catch(() => { if (!cancelled) setQuote(null); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studioId, serviceKey, selectedProfessionalId]);

  const toggleService = (id: string) =>
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  /**
   * The customer trimmed their services to fit the slot they wanted. Both
   * changes are applied together - dropping the services and taking the time -
   * so the wizard never sits in the intermediate state where the old selection
   * is still attached to a slot that can't hold it.
   *
   * The time is applied optimistically: availability refetches for the shorter
   * duration, and the effect below drops the selection again if the server
   * disagrees (someone else booked it in the meantime).
   */
  const applyFit = (keepServiceIds: string[], time: string) => {
    setSelectedServiceIds(keepServiceIds);
    setSelectedTime(time);
    setTightSlot(null);
  };

  const pickFittingTime = (time: string) => {
    setSelectedTime(time);
    setTightSlot(null);
  };

  const goToStep = (i: number) => { setStep(i); setMaxReached((m) => Math.max(m, i)); };

  const stepValid = [
    selectedServices.length > 0,
    // A professional who doesn't perform part of the basket can't be continued
    // with — the booking endpoint would reject it, so the wizard says so here.
    Boolean(selectedProfessionalId) && (selectedFit?.missing.length ?? 0) === 0,
    Boolean(selectedDate),
    Boolean(selectedTime),
    true,
  ][step];

  const next = () => {
    if (!stepValid) return;
    if (step < STEPS.length - 1) { goToStep(step + 1); return; }
    // final step → hand off to checkout (payment)
    const params = new URLSearchParams({ studioId, barberId: selectedProfessionalId, date: selectedDate, time: selectedTime ?? "", services: selectedServiceIds.join(",") });
    if (notes.trim()) params.set("notes", notes.trim());
    router.push(`/user/checkout?${params.toString()}`);
  };

  if (!studioId) {
    return (
      <Container width="lg" className="py-16 text-center">
        <h1 className="font-headline text-2xl font-bold text-on-surface">Choose a studio to book</h1>
        <p className="mt-2 text-sm text-muted">Start from Search or a studio page, then continue here.</p>
        <Button asChild className="mt-6"><Link href="/user/search">Go to Search</Link></Button>
      </Container>
    );
  }
  if (loading) return <Container width="lg" className="py-8"><div className="h-72 animate-pulse rounded-3xl bg-surface-container-high" /></Container>;
  if (error || !business) return <Container width="lg" className="py-8"><ErrorState description={error || "Unable to load this studio."} onRetry={refetch} /></Container>;

  const stepTitles = ["Choose your services", "Pick a professional", "Choose a date", "Pick a time", "Review & confirm"];
  const ctaLabel = step < STEPS.length - 1 ? "Continue" : "Continue to payment";

  return (
    <>
      <Container width="lg" className="flex flex-col gap-6 py-6 pb-28 lg:pb-6">
        <Stepper step={step} maxReached={maxReached} onGo={goToStep} />

        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          {/* Step content */}
          <div key={step} className="flex min-w-0 flex-col gap-5">
            <div>
              <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">{stepTitles[step]}</h1>
              <p className="mt-0.5 text-sm text-muted">Step {step + 1} of {STEPS.length}</p>
            </div>

            {step === 0 && (
              <ServiceStep
                services={services}
                professionals={professionals}
                selected={selectedServiceIds}
                onToggle={toggleService}
              />
            )}
            {step === 1 && (
              <ProfessionalStep
                professionals={professionals}
                selectedServices={selectedServices}
                selectedId={selectedProfessionalId}
                onSelect={setSelectedProfessionalId}
                fitFor={fitFor}
              />
            )}
            {step === 2 && <DateStep dateOptions={dateOptions} selected={selectedDate} onSelect={setSelectedDate} />}
            {step === 3 && (
              <TimeStep
                loading={slotsLoading} error={slotsError} onRetry={refetchSlots}
                reason={slotsReason} shift={shift} professionalName={selectedProfessional?.name}
                grid={slotGrid} requiredDuration={totalDuration} interval={slotInterval}
                selected={selectedTime} onSelect={setSelectedTime} onTooShort={setTightSlot}
                hasPro={Boolean(selectedProfessionalId)}
              />
            )}
            {step === 4 && <ConfirmStep business={business} notes={notes} onNotes={setNotes} />}

            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <Button intent="outline" onClick={() => goToStep(step - 1)}>
                  <ChevronLeft size={16} /> Back
                </Button>
              )}
              <Button className="hidden lg:inline-flex" disabled={!stepValid} onClick={next}>
                {ctaLabel} <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {/* Desktop sticky summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-elevated">
              <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                <Sparkles size={13} className="text-accent" /> Your appointment
              </div>
              <Summary
                business={business}
                professionalName={selectedProfessional?.name}
                services={selectedServices}
                duration={totalDuration}
                subtotal={subtotal}
                quote={quote}
                date={selectedDate}
                time={selectedTime}
                priceFor={priceFor}
              />
              <Button className="mt-4 w-full" size="lg" disabled={!stepValid} onClick={next}>
                {ctaLabel} <ArrowRight size={16} />
              </Button>
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-(--z-index-sticky) flex items-center justify-between gap-4 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div>
          <div className="text-xs text-muted">{selectedServices.length} service{selectedServices.length === 1 ? "" : "s"}</div>
          <div className="font-headline text-lg font-extrabold text-on-surface tabular-nums">{inr(quote ? quote.total : subtotal)}</div>
        </div>
        <Button size="lg" disabled={!stepValid} onClick={next}>
          {ctaLabel} <ArrowRight size={16} />
        </Button>
      </div>

      {/* Tapping a time that can't hold every selected service opens this
          instead of silently doing nothing - it names the shortfall and lets
          the customer resolve it in place. */}
      <ServiceFitModal
        open={Boolean(tightSlot)}
        onOpenChange={(open) => { if (!open) setTightSlot(null); }}
        slot={tightSlot}
        services={selectedServices}
        fittingSlots={slotGrid.filter((s) => s.available)}
        onApply={applyFit}
        onPickTime={pickFittingTime}
      />
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<Container width="lg" className="py-8 text-sm text-muted">Loading booking…</Container>}>
      <BookPageContent />
    </Suspense>
  );
}
