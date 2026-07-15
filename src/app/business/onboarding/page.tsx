"use client";

import { OnboardingWizard } from "@/components/business/onboarding/OnboardingWizard";

// Phase 1.5a - Host onboarding wizard. Rendered full-screen (the business layout
// skips the dashboard shell + gate for this route). Auth + query providers still
// wrap it, so all scoped APIs work.
export default function OnboardingPage() {
  return <OnboardingWizard />;
}
