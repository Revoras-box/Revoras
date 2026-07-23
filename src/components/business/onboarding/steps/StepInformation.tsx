"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBusinessProfile, type SocialLinks, type BusinessPolicies } from "@/lib/business/hooks/useSettings";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

// Same list encoding the Settings page uses: comma-separated tags, newline house rules.
const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);
const fromList = (a?: string[]) => (a ?? []).join(", ");
const cleanObject = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => typeof v === "string" && v.trim())) as Partial<T>;

const SOCIAL_FIELDS: { key: keyof SocialLinks; label: string; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "@handle or URL" },
  { key: "facebook", label: "Facebook", placeholder: "page or URL" },
  { key: "twitter", label: "Twitter / X", placeholder: "@handle or URL" },
  { key: "youtube", label: "YouTube", placeholder: "channel or URL" },
  { key: "tiktok", label: "TikTok", placeholder: "@handle or URL" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "phone number" },
];

// Cancellation & refund is now structured (the engine reads it), so it's no
// longer a free-text field here. Rescheduling and general stay prose.
const POLICY_FIELDS: { key: keyof BusinessPolicies; label: string }[] = [
  { key: "rescheduling", label: "Rescheduling policy" },
  { key: "general", label: "General policy" },
];

// The refund schedule the owner configures: how far ahead a customer cancels →
// how much they get back. The customer earns the best tier they clear. Windows
// are fixed; only the percentages are chosen. Cancellations inside
// NO_CANCEL_WITHIN_HOURS of the appointment aren't allowed at all.
const TIER_WINDOWS = [
  { hoursBefore: 72, label: "3 days or more before" },
  { hoursBefore: 48, label: "2 days before" },
  { hoursBefore: 24, label: "24 hours before" },
  { hoursBefore: 12, label: "12 hours before" },
  { hoursBefore: 6, label: "6 hours before" },
];
const REFUND_OPTIONS = [100, 75, 50, 25, 0].map((n) => ({ value: String(n), label: `${n}% refund` }));
const DEFAULT_REFUNDS: Record<number, number> = { 72: 100, 48: 75, 24: 50, 12: 25, 6: 0 };
const NO_CANCEL_WITHIN_HOURS = 2;

const EMPTY = { description: "", website: "", amenities: "", languages: "" };

export function StepInformation({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: business, isLoading } = useBusinessProfile(studioId);
  const [form, setForm] = useState(EMPTY);
  const [social, setSocial] = useState<SocialLinks>({});
  const [policies, setPolicies] = useState<BusinessPolicies>({});
  const [refunds, setRefunds] = useState<Record<number, number>>(DEFAULT_REFUNDS);

  useEffect(() => {
    if (business) {
      setForm({
        description: business.description || "",
        website: business.website || "",
        amenities: fromList(business.amenities),
        languages: fromList(business.languages),
      });
      setSocial(business.social_links || {});
      setPolicies(business.policies || {});
      // Prefill refund tiers from stored policy; keep defaults for any window
      // the stored policy doesn't cover (or when it's a legacy non-tiered row).
      const storedTiers = business.cancellation_policy?.tiers;
      if (storedTiers?.length) {
        const map = { ...DEFAULT_REFUNDS };
        storedTiers.forEach((t) => {
          if (t.hoursBefore in map) map[t.hoursBefore] = t.refundPercent;
        });
        setRefunds(map);
      }
    }
  }, [business]);

  const field = (key: keyof typeof EMPTY) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const handleNext = () =>
    goNext({
      description: form.description.trim() || undefined,
      website: form.website.trim() || null,
      amenities: toList(form.amenities),
      languages: toList(form.languages),
      socialLinks: cleanObject(social),
      policies: cleanObject(policies),
      cancellationPolicy: {
        tiers: TIER_WINDOWS.map((w) => ({ hoursBefore: w.hoursBefore, refundPercent: refunds[w.hoursBefore] ?? 0 })),
        noCancelWithinHours: NO_CANCEL_WITHIN_HOURS,
      },
    });

  return (
    <div>
      <StepHeader
        eyebrow="Step 3 of 10"
        title="Business information"
        description="Tell customers what makes you special. Everything here is optional, but a richer profile books more."
      />

      {isLoading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <div className="flex max-w-2xl flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <Textarea label="About your business" placeholder="Introduce your space, your style, your story…" {...field("description")} />
            <Input label="Website" placeholder="https://…" {...field("website")} />
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-headline text-base font-semibold text-on-surface">Details</h3>
            <p className="-mt-2 text-sm text-muted">Separate multiple values with commas.</p>
            <Input label="Amenities" placeholder="WiFi, Parking, AC" {...field("amenities")} />
            <Input label="Languages spoken" placeholder="English, Hindi" {...field("languages")} />
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-headline text-base font-semibold text-on-surface">Social links</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                <Input
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={social[key] || ""}
                  onChange={(e) => setSocial((s) => ({ ...s, [key]: e.target.value }))}
                />
              ))}
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <div>
              <h3 className="font-headline text-base font-semibold text-on-surface">Cancellation &amp; refund policy</h3>
              <p className="mt-1 text-sm text-muted">
                How much a customer is refunded based on how far ahead they cancel. They get the best tier they qualify
                for. Cancellations within {NO_CANCEL_WITHIN_HOURS} hours of the appointment aren&apos;t allowed.
              </p>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {TIER_WINDOWS.map((w) => (
                <div key={w.hoursBefore} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="text-sm text-on-surface">Cancel {w.label}</span>
                  <Select
                    className="w-40 shrink-0"
                    value={String(refunds[w.hoursBefore] ?? 0)}
                    onValueChange={(v) => setRefunds((r) => ({ ...r, [w.hoursBefore]: Number(v) }))}
                    options={REFUND_OPTIONS}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-headline text-base font-semibold text-on-surface">Policies</h3>
            {POLICY_FIELDS.map(({ key, label }) => (
              <Textarea
                key={key}
                label={label}
                value={policies[key] || ""}
                onChange={(e) => setPolicies((p) => ({ ...p, [key]: e.target.value }))}
              />
            ))}
          </Card>
        </div>
      )}

      <WizardFooter onPrev={goPrev} onNext={handleNext} onExit={exit} nextLoading={saving} />
    </div>
  );
}
