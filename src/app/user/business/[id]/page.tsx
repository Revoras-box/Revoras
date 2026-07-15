"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Section, ErrorState } from "@/components/ui";
import { useBusiness } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import { useFavoriteState } from "@/lib/favorites";
import { api } from "@/lib/api";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import BusinessHero from "@/components/user/sections/BusinessHero";
import BusinessInfoBar from "@/components/user/sections/BusinessInfoBar";
import BusinessTrust from "@/components/user/sections/BusinessTrust";
import BusinessAbout from "@/components/user/sections/BusinessAbout";
import BusinessPolicies from "@/components/user/sections/BusinessPolicies";
import ServiceGrid from "@/components/user/sections/ServiceGrid";
import ProfessionalCarousel from "@/components/user/sections/ProfessionalCarousel";
import ReviewSection from "@/components/user/sections/ReviewSection";
import BusinessOffers from "@/components/user/sections/BusinessOffers";
import StickyBookingFooter from "@/components/user/sections/StickyBookingFooter";

interface BusinessDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, loading, error, refetch } = useBusiness(id);
  const { user } = useAuth();
  const { isFavorite: isFavoriteFn, toggleFavorite } = useFavoriteState();
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const business = data?.business;
  const isFavorite = isFavoriteFn(id);

  // Phase 2.3 (Decision D2) — record the view server-side for signed-in users
  // so it follows them across devices; fall back to the client store otherwise.
  // Fire-and-forget either way: this is bookkeeping, and a failed write must
  // never surface an error toast over a page the customer is trying to read.
  useEffect(() => {
    if (!business) return;
    if (user) {
      api.recordBusinessView(business.id).catch(() => {});
      return;
    }
    recordRecentlyViewed({
      id: business.id,
      name: business.name,
      imageUrl: business.image_url,
      rating: business.rating,
      reviewCount: business.review_count,
      category: business.category_name,
    });
  }, [business, user]);

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  const handleFavoriteToggle = () => toggleFavorite(id);

  const handleContinue = () => {
    const params = new URLSearchParams({ studioId: id, services: selectedServiceIds.join(",") });
    router.push(`/user/book?${params.toString()}`);
  };

  if (loading) {
    return (
      <Container className="py-8">
        <div className="h-96 animate-pulse rounded-2xl bg-surface-container-high" />
      </Container>
    );
  }

  if (error || !business) {
    return (
      <Container className="py-8">
        <ErrorState description={error || "This studio may not exist."} onRetry={refetch} />
      </Container>
    );
  }

  const selectedServices = business.services.filter((s) => selectedServiceIds.includes(s.id));

  return (
    <>
      <Container className="flex flex-col gap-10 py-8 pb-4">
        <BusinessHero business={business} isFavorite={isFavorite} onFavoriteToggle={handleFavoriteToggle} />
        <BusinessTrust business={business} />
        <BusinessInfoBar business={business} />
        <BusinessAbout business={business} />
        {business.offers && business.offers.length > 0 ? (
          <Section title="Offers">
            <BusinessOffers offers={business.offers} services={business.services} />
          </Section>
        ) : null}
        <Section title="Services">
          <ServiceGrid services={business.services} selectedIds={selectedServiceIds} onToggle={toggleService} />
        </Section>
        <Section title="Professionals">
          <ProfessionalCarousel professionals={business.professionals} />
        </Section>
        <BusinessPolicies business={business} />
        <Section title="Reviews">
          <ReviewSection businessId={id} />
        </Section>
      </Container>
      <StickyBookingFooter selectedServices={selectedServices} onContinue={handleContinue} />
    </>
  );
}
