import { MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui";
import { ICON_SIZE } from "@/lib/design-tokens";
import type { BusinessDetail } from "@/lib/types";
import { DAY_NAMES, formatHourRange } from "./utils";

interface BusinessInfoBarProps {
  business: BusinessDetail;
}

export default function BusinessInfoBar({ business }: BusinessInfoBarProps) {
  const sortedHours = [...business.workingHours].sort((a, b) => a.day_of_week - b.day_of_week);
  const location = [business.address, business.city, business.state].filter(Boolean).join(", ");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card padding="md">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-on-surface">
          <MapPin size={ICON_SIZE.sm} /> Location
        </h3>
        <p className="text-sm text-muted">{location || "Location unavailable"}</p>
        {business.phone ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Phone size={ICON_SIZE.sm} /> {business.phone}
          </p>
        ) : null}
      </Card>
      <Card padding="md">
        <h3 className="mb-3 text-sm font-semibold text-on-surface">Working hours</h3>
        {sortedHours.length === 0 ? (
          <p className="text-sm text-muted">Hours unavailable</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {sortedHours.map((hour) => (
              <li key={hour.id} className="flex justify-between text-muted">
                <span>{DAY_NAMES[hour.day_of_week]}</span>
                <span className="text-on-surface">{formatHourRange(hour)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
