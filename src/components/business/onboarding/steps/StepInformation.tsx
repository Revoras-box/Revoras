"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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

const POLICY_FIELDS: { key: keyof BusinessPolicies; label: string }[] = [
  { key: "cancellation", label: "Cancellation policy" },
  { key: "rescheduling", label: "Rescheduling policy" },
  { key: "refund", label: "Refund policy" },
  { key: "general", label: "General policy" },
];

const EMPTY = { description: "", website: "", amenities: "", languages: "", paymentMethods: "", accessibility: "" };

export function StepInformation({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: business, isLoading } = useBusinessProfile(studioId);
  const [form, setForm] = useState(EMPTY);
  const [social, setSocial] = useState<SocialLinks>({});
  const [policies, setPolicies] = useState<BusinessPolicies>({});

  useEffect(() => {
    if (business) {
      setForm({
        description: business.description || "",
        website: business.website || "",
        amenities: fromList(business.amenities),
        languages: fromList(business.languages),
        paymentMethods: fromList(business.payment_methods),
        accessibility: fromList(business.accessibility),
      });
      setSocial(business.social_links || {});
      setPolicies(business.policies || {});
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
      paymentMethods: toList(form.paymentMethods),
      accessibility: toList(form.accessibility),
      socialLinks: cleanObject(social),
      policies: cleanObject(policies),
    });

  return (
    <div>
      <StepHeader
        eyebrow="Step 2 of 9"
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
            <Input label="Payment methods" placeholder="Cash, Card, UPI" {...field("paymentMethods")} />
            <Input label="Accessibility" placeholder="Wheelchair accessible, Accessible parking" {...field("accessibility")} />
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
