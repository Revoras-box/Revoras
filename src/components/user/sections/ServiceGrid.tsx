"use client";

import { ServicePicker } from "@/components/user/booking/ServicePicker";
import type { Professional, Service } from "@/lib/types";

interface ServiceGridProps {
  services: Service[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  /**
   * The studio's team. Passed so the catalogue can show what the shop really
   * charges and takes ("from ₹49 · 30–40 min") rather than a single catalogue
   * number no particular professional is bound to.
   */
  professionals?: Professional[];
}

/**
 * The studio page's catalogue is the same decision as step 1 of the booking
 * wizard, so it renders through the same picker — one card language, one place
 * to change it.
 */
export default function ServiceGrid({ services, selectedIds, onToggle, professionals }: ServiceGridProps) {
  return (
    <ServicePicker
      services={services}
      professionals={professionals}
      selectedIds={selectedIds}
      onToggle={onToggle}
    />
  );
}
