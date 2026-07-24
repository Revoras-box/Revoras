"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBusinessAuth } from "@/lib/business/auth";
import { useBusinessProfile } from "@/lib/business/hooks/useSettings";
import { useBusinessCategories } from "@/lib/business/hooks/useServices";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

// Revoras operates in Jammu & Kashmir, so country and state are fixed choices
// and city is picked from the region's cities/districts rather than free-typed.
const COUNTRY_OPTIONS = [{ value: "India", label: "India" }];
const STATE_OPTIONS = [{ value: "Jammu and Kashmir", label: "Jammu and Kashmir" }];
const JK_CITIES = [
  "Srinagar",
  "Jammu",
  "Anantnag",
  "Baramulla",
  "Sopore",
  "Kathua",
  "Udhampur",
  "Samba",
  "Bandipora",
  "Ganderbal",
  "Kulgam",
  "Kupwara",
  "Pulwama",
  "Shopian",
  "Budgam",
  "Doda",
  "Kishtwar",
  "Poonch",
  "Rajouri",
  "Ramban",
  "Reasi",
];
const CITY_OPTIONS = JK_CITIES.map((c) => ({ value: c, label: c }));

const DEFAULT_COUNTRY = "India";
const DEFAULT_STATE = "Jammu and Kashmir";

const EMPTY = {
  name: "",
  phone: "",
  email: "",
  categoryId: "",
  address: "",
  city: "",
  state: DEFAULT_STATE,
  country: DEFAULT_COUNTRY,
  zipCode: "",
};

export function StepBasics({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: business, isLoading } = useBusinessProfile(studioId);
  const { data: categories } = useBusinessCategories();
  const { user } = useBusinessAuth();
  const [form, setForm] = useState(EMPTY);

  // Phone and email are the owner's verified contact from signup (both went
  // through OTP verification), so they're locked to the account here rather than
  // freely editable — the account is the single source of truth. They fall back
  // to whatever the draft business already stored if the account isn't loaded.
  const lockedPhone = user?.phone || business?.phone || "";
  const lockedEmail = user?.email || business?.email || "";

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        phone: business.phone || "",
        email: business.email || "",
        categoryId: business.category_id || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || DEFAULT_STATE,
        country: business.country || DEFAULT_COUNTRY,
        zipCode: business.zip_code || "",
      });
    }
  }, [business]);

  const field = (key: keyof typeof EMPTY) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  const valid = form.name.trim() && form.address.trim() && form.categoryId;

  const handleNext = () => {
    if (!valid) {
      toast.error("Business name, category and address are required");
      return;
    }
    goNext({
      name: form.name.trim(),
      categoryId: form.categoryId,
      address: form.address.trim(),
      phone: lockedPhone.trim() || undefined,
      email: lockedEmail.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      country: form.country.trim() || undefined,
      zipCode: form.zipCode.trim() || undefined,
    });
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 1 of 10"
        title="Business basics"
        description="The essentials customers see first — your name, what you do, and where to find you."
      />

      {isLoading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <div className="flex max-w-2xl flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <Input label="Business name" placeholder="e.g. Luxe Hair Studio" {...field("name")} />
            <Select
              label="Category"
              placeholder="Choose a category"
              value={form.categoryId}
              onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              options={(categories || []).map((c) => ({ value: c.id, label: c.name }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Phone"
                value={lockedPhone}
                readOnly
                trailingIcon={<Lock size={14} />}
                hint="From your account"
                className="cursor-not-allowed bg-surface-container text-on-surface-variant"
              />
              <Input
                label="Email"
                type="email"
                value={lockedEmail}
                readOnly
                trailingIcon={<Lock size={14} />}
                hint="From your account"
                className="cursor-not-allowed bg-surface-container text-on-surface-variant"
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-headline text-base font-semibold text-on-surface">Location</h3>
            <Input label="Address" placeholder="Street address" {...field("address")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="City"
                placeholder="Select city"
                value={form.city}
                onValueChange={(v) => setForm((f) => ({ ...f, city: v }))}
                options={CITY_OPTIONS}
              />
              <Select
                label="State"
                value={form.state}
                onValueChange={(v) => setForm((f) => ({ ...f, state: v }))}
                options={STATE_OPTIONS}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Country"
                value={form.country}
                onValueChange={(v) => setForm((f) => ({ ...f, country: v }))}
                options={COUNTRY_OPTIONS}
              />
              <Input label="PIN / ZIP code" {...field("zipCode")} />
            </div>
          </Card>
        </div>
      )}

      <WizardFooter
        onPrev={goPrev}
        showPrev={false}
        onNext={handleNext}
        onExit={exit}
        nextDisabled={!valid}
        nextLoading={saving}
        hint={!valid ? "Name, category and address are required to continue." : undefined}
      />
    </div>
  );
}
