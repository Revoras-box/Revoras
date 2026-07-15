import { Tag } from "lucide-react";
import type { PublicOffer, Service } from "@/lib/types";

/**
 * Phase 2.4 (Offers & Promotions) - the offer section on a business detail
 * page. Lists the business's live offers with their headline discount and,
 * for service-scoped offers, which services they apply to. Purely advertising:
 * the actual best offer is applied automatically at booking (the customer never
 * picks one), so there's no CTA here.
 */
export default function BusinessOffers({ offers, services }: { offers: PublicOffer[]; services: Service[] }) {
  if (!offers || offers.length === 0) return null;

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? "a service";

  return (
    <div className="flex flex-col gap-3">
      {offers.map((offer) => (
        <div key={offer.id} className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/5 p-4">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-error text-on-error">
            <Tag size={16} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-on-surface">{offer.label}</span>
              <span className="text-sm text-muted">· {offer.title}</span>
            </div>
            {offer.description ? <p className="mt-0.5 text-sm text-secondary-foreground">{offer.description}</p> : null}
            <p className="mt-1 text-xs text-muted">
              {offer.appliesTo === "business"
                ? "On all services"
                : `On ${offer.serviceIds.map(serviceName).join(", ")}`}
              {offer.minSpend != null ? ` · Min spend ₹${offer.minSpend}` : ""}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
