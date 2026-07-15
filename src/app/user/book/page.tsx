"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Section, Card, ServiceCard, ProfessionalCard, TimeSlotPicker, Textarea, Button, ErrorState } from "@/components/ui";
import { useBusiness, useAvailability } from "@/lib/hooks";
import { filterSlotsByWorkingHours } from "@/components/user/sections/utils";

const parseIdList = (value: string | null): string[] =>
  value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const studioId = searchParams.get("studioId")?.trim() ?? "";
  const preselectedServiceIds = useMemo(() => parseIdList(searchParams.get("services")), [searchParams]);
  const preselectedProfessionalId = searchParams.get("barberId")?.trim() ?? "";

  const dateOptions = useMemo(() => {
    const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
    const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return { iso: toIsoDate(date), day: dayFmt.format(date), month: monthFmt.format(date), date: date.getDate() };
    });
  }, []);

  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(preselectedServiceIds);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState(preselectedProfessionalId);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]?.iso ?? toIsoDate(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const { data, loading, error, refetch } = useBusiness(studioId);
  const business = data?.business;
  const services = business?.services ?? [];
  const professionals = business?.professionals ?? [];

  useEffect(() => {
    if (professionals.length === 0 || selectedProfessionalId) return;
    setSelectedProfessionalId(professionals[0].id);
  }, [professionals, selectedProfessionalId]);

  const selectedServices = useMemo(
    () => services.filter((s) => selectedServiceIds.includes(s.id)),
    [services, selectedServiceIds]
  );
  const selectedProfessional = professionals.find((p) => p.id === selectedProfessionalId);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);

  const { slots, loading: slotsLoading, error: slotsError, refetch: refetchSlots } = useAvailability(
    studioId,
    selectedProfessionalId || null,
    selectedDate,
    totalDuration || undefined
  );

  const availableTimes = useMemo(
    () => (business ? filterSlotsByWorkingHours(slots, business.workingHours, selectedDate) : []),
    [slots, business, selectedDate]
  );

  useEffect(() => {
    if (!availableTimes.includes(selectedTime ?? "")) setSelectedTime(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableTimes]);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const canContinue = selectedServices.length > 0 && selectedProfessionalId && selectedTime;

  const handleContinue = () => {
    if (!canContinue || !selectedTime) return;
    const params = new URLSearchParams({
      studioId,
      barberId: selectedProfessionalId,
      date: selectedDate,
      time: selectedTime,
      services: selectedServiceIds.join(","),
    });
    if (notes.trim()) params.set("notes", notes.trim());
    router.push(`/user/checkout?${params.toString()}`);
  };

  if (!studioId) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-headline text-2xl font-bold text-on-surface">Choose a studio to book</h1>
        <p className="mt-2 text-sm text-muted">Start from Search or a studio page, then continue here.</p>
        <Link href="/user/search" className="mt-6 inline-block">
          <Button>Go to Search</Button>
        </Link>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-8">
        <div className="h-64 animate-pulse rounded-2xl bg-surface-container-high" />
      </Container>
    );
  }

  if (error || !business) {
    return (
      <Container className="py-8">
        <ErrorState description={error || "Unable to load this studio."} onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container className="grid grid-cols-1 gap-10 py-8 lg:grid-cols-12">
      <div className="flex flex-col gap-10 lg:col-span-8">
        <Section title="Select services">
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={service.description ?? undefined}
                price={Number(service.price)}
                duration={service.duration}
                selected={selectedServiceIds.includes(service.id)}
                onSelect={() => toggleService(service.id)}
              />
            ))}
          </div>
        </Section>

        <Section title="Select professional">
          <div className="flex flex-col gap-3">
            {professionals.map((professional) => (
              <ProfessionalCard
                key={professional.id}
                name={professional.name}
                avatarUrl={professional.image_url ?? undefined}
                designation={professional.designation ?? undefined}
                rating={professional.rating ? Number(professional.rating) : undefined}
                onClick={() => setSelectedProfessionalId(professional.id)}
                className={professional.id === selectedProfessionalId ? "border-primary bg-primary-container/20" : undefined}
              />
            ))}
          </div>
        </Section>

        <Section title="Select date">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {dateOptions.map((d) => (
              <button
                key={d.iso}
                onClick={() => setSelectedDate(d.iso)}
                className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-3 transition-colors ${
                  selectedDate === d.iso ? "border-primary bg-primary text-on-primary" : "border-border text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className="text-xs">{d.month}</span>
                <span className="text-lg font-bold">{d.date}</span>
                <span className="text-xs">{d.day}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Select time">
          {!selectedProfessionalId ? (
            <p className="text-sm text-muted">Select a professional to view available times.</p>
          ) : slotsLoading ? (
            <div className="h-16 animate-pulse rounded-lg bg-surface-container-high" />
          ) : slotsError ? (
            <ErrorState description={slotsError} onRetry={refetchSlots} />
          ) : (
            <TimeSlotPicker slots={availableTimes} selected={selectedTime ?? undefined} onSelect={setSelectedTime} />
          )}
        </Section>

        <Section title="Notes (optional)">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={250}
            rows={3}
            placeholder="Any preference for your appointment?"
          />
        </Section>
      </div>

      <aside className="lg:col-span-4">
        <Card padding="lg" className="sticky top-20 flex flex-col gap-4">
          <h3 className="font-headline text-lg font-bold text-on-surface">Reservation summary</h3>
          <div className="text-sm text-muted">{business.name}</div>
          {selectedProfessional ? <div className="text-sm text-on-surface">with {selectedProfessional.name}</div> : null}
          <div className="flex flex-col gap-1.5">
            {selectedServices.map((s) => (
              <div key={s.id} className="flex justify-between text-sm">
                <span className="text-on-surface">{s.name}</span>
                <span className="text-muted tabular-nums">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(s.price))}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted">Duration</span>
            <span className="text-on-surface">{totalDuration} min</span>
          </div>
          <div className="flex items-end justify-between border-t border-border pt-3">
            <span className="font-medium text-on-surface">Total</span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalPrice)}
            </span>
          </div>
          <Button size="lg" disabled={!canContinue} onClick={handleContinue}>
            Continue to checkout
          </Button>
        </Card>
      </aside>
    </Container>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<Container className="py-8 text-sm text-muted">Loading booking...</Container>}>
      <BookPageContent />
    </Suspense>
  );
}
