"use client";

import { useRouter } from "next/navigation";
import { ProfessionalCard, EmptyState } from "@/components/ui";
import type { Professional } from "@/lib/types";

interface ProfessionalCarouselProps {
  professionals: Professional[];
}

export default function ProfessionalCarousel({ professionals }: ProfessionalCarouselProps) {
  const router = useRouter();

  if (professionals.length === 0) {
    return <EmptyState title="No professionals listed yet" />;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {professionals.map((professional) => (
        <ProfessionalCard
          key={professional.id}
          name={professional.name}
          avatarUrl={professional.image_url ?? undefined}
          designation={professional.designation ?? undefined}
          rating={professional.rating ? Number(professional.rating) : undefined}
          specialties={professional.specialties}
          className="w-64 shrink-0"
          onClick={() => router.push(`/user/barber/${professional.id}`)}
        />
      ))}
    </div>
  );
}
