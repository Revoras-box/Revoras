"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Shared bottom navigation for every wizard step so Previous / Next / Exit are
 * identical throughout. Each step owns its own save logic and passes the result
 * in via onNext / nextDisabled.
 */
export function WizardFooter({
  onPrev,
  onNext,
  onExit,
  showPrev = true,
  nextLabel = "Continue",
  nextDisabled = false,
  nextLoading = false,
  hint,
}: {
  onPrev?: () => void;
  onNext: () => void;
  onExit: () => void;
  showPrev?: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  hint?: string;
}) {
  return (
    <div className="mt-8 border-t border-border pt-5">
      {hint ? <p className="mb-3 text-xs text-muted">{hint}</p> : null}
      <div className="flex items-center justify-between gap-3">
        <div>
          {showPrev && onPrev ? (
            <Button intent="ghost" onClick={onPrev} disabled={nextLoading}>
              <ArrowLeft size={18} /> Back
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button intent="outline" onClick={onExit} disabled={nextLoading}>
            Save &amp; exit
          </Button>
          <Button onClick={onNext} disabled={nextDisabled} loading={nextLoading}>
            {nextLabel}
            {!nextLoading ? <ArrowRight size={18} /> : null}
          </Button>
        </div>
      </div>
    </div>
  );
}
