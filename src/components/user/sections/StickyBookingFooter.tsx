import { Button } from "@/components/ui";
import type { Service } from "@/lib/types";

interface StickyBookingFooterProps {
  selectedServices: Service[];
  onContinue: () => void;
}

export default function StickyBookingFooter({ selectedServices, onContinue }: StickyBookingFooterProps) {
  if (selectedServices.length === 0) return null;

  const total = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="sticky bottom-0 left-0 right-0 z-(--z-index-sticky) border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-sm md:px-6">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} · {totalDuration} min
          </p>
          <p className="text-lg font-bold text-on-surface tabular-nums">
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(total)}
          </p>
        </div>
        <Button size="lg" onClick={onContinue}>
          Continue to booking
        </Button>
      </div>
    </div>
  );
}
