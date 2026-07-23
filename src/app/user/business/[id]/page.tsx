"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, ErrorState } from "@/components/ui";
import { useBusiness } from "@/lib/hooks";
import { useAuth } from "@/lib/auth";
import { useFavoriteState } from "@/lib/favorites";
import { api } from "@/lib/api";
import { recordRecentlyViewed } from "@/lib/recently-viewed";
import BusinessAbout from "@/components/user/sections/BusinessAbout";
import BusinessPolicies from "@/components/user/sections/BusinessPolicies";
import ServiceGrid from "@/components/user/sections/ServiceGrid";
import ProfessionalCarousel from "@/components/user/sections/ProfessionalCarousel";
import ReviewSection from "@/components/user/sections/ReviewSection";
import BusinessOffers from "@/components/user/sections/BusinessOffers";
import StickyBookingFooter from "@/components/user/sections/StickyBookingFooter";
import HeroGallery from "@/components/user/business/HeroGallery";
import BookingCard from "@/components/user/business/BookingCard";
import { DetailHeader, SectionNav, LocationSection } from "@/components/user/business/DetailChrome";

interface BusinessDetailPageProps {
  params: Promise<{ id: string }>;
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-32 flex-col gap-4">
      <h2 className="font-headline text-xl font-semibold text-on-surface">{title}</h2>
      {children}
    </section>
  );
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

  // Phase 2.3 (Decision D2) — record the view server-side for signed-in users so
  // it follows them across devices; fall back to the client store otherwise.
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

  const toggleService = (serviceId: string) =>
    setSelectedServiceIds((prev) => (prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]));

  const handleContinue = () => {
    const qs = new URLSearchParams({ studioId: id, services: selectedServiceIds.join(",") });
    router.push(`/user/book?${qs.toString()}`);
  };

  const selectedServices = useMemo(
    () => (business ? business.services.filter((s) => selectedServiceIds.includes(s.id)) : []),
    [business, selectedServiceIds]
  );

  // Uploaded gallery photos are the real source of truth; banner/image/logo
  // are legacy fields most businesses (like ones set up before the gallery
  // manager existed) never populated.
  const heroImages = useMemo(() => {
    if (!business) return [];
    const gallery = business.gallery ?? [];
    if (gallery.length > 0) {
      return [...gallery]
        .sort((a, b) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0) || a.sort_order - b.sort_order)
        .map((g) => g.url);
    }
    return [business.banner_url, business.image_url, business.logo_url];
  }, [business]);

  const sectionNav = useMemo(() => {
    if (!business) return [];
    const items = [{ id: "services", label: "Services" }];
    if (business.professionals?.length) items.push({ id: "professionals", label: "Professionals" });
    if (business.offers?.length) items.push({ id: "offers", label: "Offers" });
    items.push({ id: "reviews", label: "Reviews" }, { id: "about", label: "About" }, { id: "location", label: "Location" });
    return items;
  }, [business]);

  if (loading) {
    return (
      <Container width="lg" className="py-8">
        <div className="h-[420px] animate-pulse rounded-3xl bg-surface-container-high" />
      </Container>
    );
  }

  if (error || !business) {
    return (
      <Container width="lg" className="py-8">
        <ErrorState description={error || "This studio may not exist."} onRetry={refetch} />
      </Container>
    );
  }

  return (
    <>
      <Container width="lg" className="flex flex-col gap-6 py-6">
        <HeroGallery name={business.name} images={heroImages} />
        <DetailHeader business={business} isFavorite={isFavorite} onFavoriteToggle={() => toggleFavorite(id)} />
        <SectionNav sections={sectionNav} />

        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
          {/* Left: content */}
          <div className="flex min-w-0 flex-col gap-10">
            {business.offers && business.offers.length > 0 ? (
              <Block id="offers" title="Offers">
                <BusinessOffers offers={business.offers} services={business.services} />
              </Block>
            ) : null}

            <Block id="services" title="Services">
              <ServiceGrid services={business.services} selectedIds={selectedServiceIds} onToggle={toggleService} />
            </Block>

            {business.professionals?.length ? (
              <Block id="professionals" title="Our team">
                <ProfessionalCarousel professionals={business.professionals} />
              </Block>
            ) : null}

            <section id="about" className="scroll-mt-32">
              <BusinessAbout business={business} />
            </section>

            <Block id="reviews" title="Reviews">
              <ReviewSection businessId={id} />
            </Block>

            <section id="policies" className="scroll-mt-32">
              <BusinessPolicies business={business} />
            </section>

            <Block id="location" title="Where you'll be">
              <LocationSection business={business} />
            </Block>
          </div>

          {/* Right: sticky booking card (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <BookingCard
                services={business.services}
                selectedServices={selectedServices}
                rating={Number(business.rating ?? 0)}
                reviewCount={business.review_count}
                onContinue={handleContinue}
              />
            </div>
          </aside>
        </div>
      </Container>

      {/* Mobile floating Book Now (hidden where the sticky card shows) */}
      <div className="lg:hidden">
        <StickyBookingFooter selectedServices={selectedServices} onContinue={handleContinue} />
      </div>
    </>
  );
}
