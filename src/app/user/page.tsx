"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCollections } from "@/lib/hooks";
import { Container, Section } from "@/components/ui";
import HomeHero from "@/components/user/sections/HomeHero";
import UpcomingBookingCard from "@/components/user/sections/UpcomingBookingCard";
import CategoryRail from "@/components/user/sections/CategoryRail";
import NearbyBusinesses from "@/components/user/sections/NearbyBusinesses";
import DiscoveryRail from "@/components/user/sections/DiscoveryRail";
import CollectionRail from "@/components/user/sections/CollectionRail";
import RecentlyViewedRail from "@/components/user/sections/RecentlyViewedRail";
import FavoritesRail from "@/components/user/sections/FavoritesRail";

export default function DiscoverPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [recentCount, setRecentCount] = useState(0);
  const { data: collectionsData } = useCollections();
  const collections = collectionsData?.collections ?? [];

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation(undefined),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return (
    <Container className="flex flex-col gap-10 py-8">
      <HomeHero />

      <Section title="Upcoming booking">
        <UpcomingBookingCard />
      </Section>

      <Section title="Categories">
        <CategoryRail />
      </Section>

      <Section
        title="Featured Businesses"
        action={<Link href="/user/search?featuredOnly=true" className="text-sm font-medium text-primary hover:underline">See all</Link>}
      >
        <DiscoveryRail
          params={{ sortBy: "recommended", featuredOnly: "true" }}
          emptyTitle="Nothing featured right now"
          emptyDescription="Check back soon."
        />
      </Section>

      <Section
        title="Recommended for you"
        action={<Link href="/user/search?sortBy=recommended" className="text-sm font-medium text-primary hover:underline">See all</Link>}
      >
        <DiscoveryRail
          params={{ sortBy: "recommended", ...(location ? { lat: String(location.lat), lng: String(location.lng) } : {}) }}
          emptyTitle="Nothing recommended yet"
          emptyDescription="Explore by category or search to get started."
        />
      </Section>

      <Section
        title="Offers for you"
        action={<Link href="/user/search?hasOffers=true" className="text-sm font-medium text-primary hover:underline">See all</Link>}
      >
        <DiscoveryRail
          params={{ hasOffers: "true", sortBy: "recommended" }}
          emptyTitle="No offers right now"
          emptyDescription="Check back soon for deals from studios near you."
        />
      </Section>

      <Section title="Nearby studios" action={<Link href="/user/search" className="text-sm font-medium text-primary hover:underline">See all</Link>}>
        <NearbyBusinesses lat={location?.lat} lng={location?.lng} />
      </Section>

      <Section
        title="Trending now"
        action={<Link href="/user/search?sortBy=trending" className="text-sm font-medium text-primary hover:underline">See all</Link>}
      >
        <DiscoveryRail params={{ sortBy: "trending" }} emptyTitle="Nothing trending yet" emptyDescription="Check back soon." />
      </Section>

      <Section
        title="Top rated"
        action={<Link href="/user/search?sortBy=rating" className="text-sm font-medium text-primary hover:underline">See all</Link>}
      >
        <DiscoveryRail params={{ sortBy: "rating" }} emptyTitle="No top-rated studios yet" />
      </Section>

      <Section
        title="New on Revoras"
        action={<Link href="/user/search?sortBy=newest" className="text-sm font-medium text-primary hover:underline">See all</Link>}
      >
        <DiscoveryRail params={{ sortBy: "newest" }} emptyTitle="No new studios yet" />
      </Section>

      {collections.map((c) => (
        <Section
          key={c.id}
          title={c.title}
          description={c.subtitle ?? undefined}
          action={
            <Link href={`/user/collections/${c.slug}`} className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          }
        >
          <CollectionRail slug={c.slug} />
        </Section>
      ))}

      {/* Phase 2.3 - "Continue Browsing" is the recently-viewed strip framed as a
          resume-where-you-left-off prompt.
          The rail is mounted in ONE fixed position and only the heading is
          conditional. Swapping the rail between two branches (the previous
          shape) unmounted and remounted it on every flip: the remounted rail
          reported its pre-fetch length of 0, which flipped the branch back,
          which remounted it again — an infinite remount/refetch loop that
          hammered /profile/recently-viewed until the rate limiter cut it off.
          Section already omits the title row when title/action are undefined,
          and the rail renders nothing when empty, so this leaves no stranded
          heading while keeping the mount stable. */}
      <Section
        title={recentCount > 0 ? "Continue browsing" : undefined}
        action={
          recentCount > 0 ? (
            <Link href="/user/recently-viewed" className="text-sm font-medium text-primary hover:underline">
              See all
            </Link>
          ) : undefined
        }
      >
        <RecentlyViewedRail onItemsChange={setRecentCount} />
      </Section>

      <Section title="Your favorites" action={<Link href="/user/saved" className="text-sm font-medium text-primary hover:underline">See all</Link>}>
        <FavoritesRail />
      </Section>
    </Container>
  );
}
