import { ServiceCard, EmptyState } from "@/components/ui";
import type { Service } from "@/lib/types";

interface ServiceGridProps {
  services: Service[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function ServiceGrid({ services, selectedIds, onToggle }: ServiceGridProps) {
  if (services.length === 0) {
    return <EmptyState title="No services listed yet" />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          name={service.name}
          description={service.description ?? undefined}
          price={Number(service.price)}
          duration={service.duration}
          imageUrl={service.image_url}
          selected={selectedIds.includes(service.id)}
          onSelect={() => onToggle(service.id)}
        />
      ))}
    </div>
  );
}
