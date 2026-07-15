import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";
import { ICON_SIZE } from "@/lib/design-tokens";

export interface ServiceCardProps {
  name: string;
  description?: string;
  price: number;
  /** Minutes. */
  duration: number;
  currency?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);

/** One line item in a business's service catalog and the booking-flow service picker — same shape, different `onSelect`. */
export function ServiceCard({ name, description, price, duration, currency = "INR", selected, onSelect, className }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-xl border p-3.5 transition-colors duration-(--duration-fast) ease-(--ease-out)",
        selected ? "border-primary bg-primary-container/20" : "border-border",
        className
      )}
    >
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-on-surface truncate">{name}</h4>
        {description ? <p className="text-xs text-muted mt-0.5 line-clamp-2">{description}</p> : null}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted">
          <span className="font-medium text-on-surface tabular-nums">{formatPrice(price, currency)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={ICON_SIZE.sm} />
            {duration} min
          </span>
        </div>
      </div>
      {onSelect ? (
        <Button intent={selected ? "primary" : "outline"} size="sm" onClick={onSelect} className="shrink-0">
          {selected ? "Selected" : "Select"}
        </Button>
      ) : null}
    </div>
  );
}
