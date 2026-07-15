import type { OnboardingState } from "@/lib/business/api";

export interface WizardStepProps {
  studioId: string;
  state: OnboardingState;
  /** Persist optional field data + advance the resume cursor to the next step. */
  goNext: (data?: Record<string, unknown>) => void;
  goPrev: () => void;
  /** Jump to an arbitrary step index (used by Review's "fix this" links). */
  jumpTo: (index: number) => void;
  exit: () => void;
  saving: boolean;
}

export const stepComplete = (state: OnboardingState, key: string): boolean =>
  state.steps.find((s) => s.key === key)?.complete ?? false;
