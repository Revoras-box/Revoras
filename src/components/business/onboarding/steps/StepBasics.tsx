"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBusinessProfile } from "@/lib/business/hooks/useSettings";
import { useBusinessCategories } from "@/lib/business/hooks/useServices";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

const EMPTY = { name: "", phone: "", email: "", categoryId: "", address: "", city: "", state: "", country: "", zipCode: "" };

export function StepBasics({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: business, isLoading } = useBusinessProfile(studioId);
  const { data: categories } = useBusinessCategories();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        phone: business.phone || "",
        email: business.email || "",
        categoryId: business.category_id || "",
        address: business.address || "",
        city: business.city || "",
        state: business.state || "",
        country: business.country || "",
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
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      city: form.city.trim() || undefined,
      state: form.state.trim() || undefined,
      country: form.country.trim() || undefined,
      zipCode: form.zipCode.trim() || undefined,
    });
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 1 of 9"
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
              <Input label="Phone" placeholder="+91…" {...field("phone")} />
              <Input label="Email" type="email" placeholder="hello@business.com" {...field("email")} />
            </div>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-headline text-base font-semibold text-on-surface">Location</h3>
            <Input label="Address" placeholder="Street address" {...field("address")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="City" {...field("city")} />
              <Input label="State" {...field("state")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Country" {...field("country")} />
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
