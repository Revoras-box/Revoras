"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useBusinessProfile } from "@/lib/business/hooks/useSettings";
import { LocationPicker, type LocationValue } from "@/components/business/LocationPicker";
import { StepHeader } from "../StepHeader";
import { WizardFooter } from "../WizardFooter";
import type { WizardStepProps } from "../types";

/**
 * Phase 4A - Explore Map, Location Foundation. Required step, positioned right
 * after Basics so the address the owner just typed there seeds the search box.
 *
 * The gate to continue is a placed pin (lat + lng), not a matched address -
 * an owner in an unmapped area can still drop a pin on their rooftop and move
 * on, which is the whole reason reverse geocoding is best-effort rather than
 * required. This mirrors the backend's `location` completion check
 * (`lat != null && lng != null`).
 */
export function StepLocation({ studioId, goNext, goPrev, exit, saving }: WizardStepProps) {
  const { data: business, isLoading } = useBusinessProfile(studioId);
  const [value, setValue] = useState<LocationValue>({ lat: null, lng: null });

  useEffect(() => {
    if (business) {
      setValue({
        lat: business.lat ?? null,
        lng: business.lng ?? null,
        address: business.address || undefined,
        city: business.city || undefined,
        state: business.state || undefined,
        country: business.country || undefined,
        zipCode: business.zip_code || undefined,
      });
    }
  }, [business]);

  const hasPin = value.lat != null && value.lng != null;

  const handleNext = () => {
    if (!hasPin) {
      toast.error("Drop a pin on the map to set your location");
      return;
    }
    // Persist coordinates plus whatever address components the lookup filled
    // in, so the pin and the text stay consistent with what customers see.
    goNext({
      lat: value.lat,
      lng: value.lng,
      address: value.address?.trim() || undefined,
      city: value.city?.trim() || undefined,
      state: value.state?.trim() || undefined,
      country: value.country?.trim() || undefined,
      zipCode: value.zipCode?.trim() || undefined,
    });
  };

  return (
    <div>
      <StepHeader
        eyebrow="Step 2 of 10"
        title="Where are you located?"
        description="This is how customers find you on the map. Search your address, then drag the pin to the exact spot — your storefront, not just the street."
      />

      {isLoading ? (
        <Skeleton className="h-[32rem] rounded-2xl" />
      ) : (
        <div className="max-w-2xl">
          <Card className="flex flex-col gap-4">
            <LocationPicker value={value} onChange={setValue} initialQuery={business?.address || ""} />
          </Card>
        </div>
      )}

      <WizardFooter
        onPrev={goPrev}
        onNext={handleNext}
        onExit={exit}
        nextDisabled={!hasPin}
        nextLoading={saving}
        hint={!hasPin ? "Set your location on the map to continue." : undefined}
      />
    </div>
  );
}
