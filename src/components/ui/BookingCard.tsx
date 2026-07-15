import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
// Single source of truth for booking statuses (Phase 2.5 added checked_in).
import type { BookingStatus } from "@/lib/types";

export type { BookingStatus };

const STATUS_CONFIG: Record<BookingStatus, { label: string; tone: "neutral" | "primary" | "success" | "warning" | "danger" }> = {
  pending: { label: "Pending payment", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "success" },
  checked_in: { label: "Checked in", tone: "primary" },
  completed: { label: "Completed", tone: "neutral" },
  cancelled: { label: "Cancelled", tone: "danger" },
  no_show: { label: "No-show", tone: "danger" },
};

export interface BookingCardProps {
  businessName: string;
  businessImageUrl?: string;
  professionalName: string;
  serviceNames: string[];
  dateLabel: string;
  timeLabel: string;
  status: BookingStatus;
  confirmationCode?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/** One row in "My bookings" (Customer) or a booking detail summary (Business). Status pill is driven directly by the real backend enum. */
export function BookingCard({
  businessName,
  businessImageUrl,
  professionalName,
  serviceNames,
  dateLabel,
  timeLabel,
  status,
  confirmationCode,
  actions,
  onClick,
  className,
}: BookingCardProps) {
  const statusConfig = STATUS_CONFIG[status];

  return (
    <Card
      padding="sm"
      elevation="flat"
      onClick={onClick}
      className={cn("flex gap-3", onClick && "cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:bg-surface-container-low", className)}
    >
      <Avatar name={businessName} src={businessImageUrl} size="lg" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-on-surface truncate">{businessName}</h4>
          <Badge tone={statusConfig.tone} dot>
            {statusConfig.label}
          </Badge>
        </div>
        <p className="text-xs text-muted mt-0.5 truncate">
          {serviceNames.join(", ")} with {professionalName}
        </p>
        <p className="text-xs text-on-surface-variant mt-1">
          {dateLabel} · {timeLabel}
        </p>
        {confirmationCode ? <p className="text-xs text-muted mt-1 font-mono">{confirmationCode}</p> : null}
        {actions ? <div className="flex items-center gap-2 mt-3">{actions}</div> : null}
      </div>
    </Card>
  );
}
