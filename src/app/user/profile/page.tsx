"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as RadixTabs from "@radix-ui/react-tabs";
import { Bell, CalendarDays, Heart, Receipt, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Button, Container, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks";
import { ICON_SIZE } from "@/lib/design-tokens";
import { ProfileHeader } from "@/components/user/sections/ProfileHeader";
import { ProfileSection } from "@/components/user/sections/ProfileSection";
import FavoritesRail from "@/components/user/sections/FavoritesRail";
import ProfileBookingsTab from "@/components/user/sections/ProfileBookingsTab";
import ProfileNotificationsTab from "@/components/user/sections/ProfileNotificationsTab";
import ProfileSettingsTab from "@/components/user/sections/ProfileSettingsTab";
import ProfilePaymentHistoryTab from "@/components/user/sections/ProfilePaymentHistoryTab";

const TAB_ITEMS = [
  { value: "bookings", label: "Bookings", icon: CalendarDays },
  { value: "favorites", label: "Favorites", icon: Heart },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "payments", label: "Payment history", icon: Receipt },
  { value: "settings", label: "Settings", icon: SettingsIcon },
];

const VALID_TABS = new Set(TAB_ITEMS.map((t) => t.value));

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  // An unrecognised ?tab= would otherwise select nothing and render a page with
  // a header and no content below it.
  const [activeTab, setActiveTab] = useState(tabParam && VALID_TABS.has(tabParam) ? tabParam : "bookings");

  const { data, loading } = useProfile();

  // Keep the active tab in sync with the URL so navigating to
  // `/user/profile?tab=favorites` (e.g. the account menu's "Favorites" link)
  // switches tabs even when we're already on the profile page and React reuses
  // this component instead of remounting it.
  useEffect(() => {
    if (tabParam && VALID_TABS.has(tabParam) && tabParam !== activeTab) setActiveTab(tabParam);
    // Only react to the URL changing, not to in-page tab clicks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  return (
    <Container className="flex flex-col gap-6 py-8">
      <ProfileHeader user={data?.user} stats={data?.stats} loading={loading} onEdit={() => setActiveTab("settings")} />

      {/*
        Radix Tabs is used directly rather than through components/ui/Tabs,
        which hardcodes a horizontal underline strip. Five destinations in a
        strip reads as an afterthought at desktop width; a rail is the shape an
        account page is expected to have. The shared component is left alone
        because the booking filters and the admin queue depend on exactly the
        look it has.
      */}
      <RadixTabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start"
      >
        {/* Horizontal and scrollable on small screens, a rail from lg up. */}
        <RadixTabs.List
          className={cn(
            "flex gap-1 overflow-x-auto border-b border-border pb-px",
            "lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-none lg:pb-0",
            "lg:sticky lg:top-24"
          )}
        >
          {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
            <RadixTabs.Trigger
              key={value}
              value={value}
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium text-muted",
                "transition-colors duration-(--duration-fast) ease-(--ease-out)",
                "border-b-2 border-transparent hover:text-on-surface",
                "data-[state=active]:border-primary data-[state=active]:text-on-surface",
                // The rail marks the active item with a filled pill instead of
                // the underline, which has nothing to sit under once vertical.
                "lg:w-full lg:justify-start lg:rounded-lg lg:border-b-0 lg:px-3 lg:py-2.5",
                "lg:hover:bg-surface-container-low",
                "lg:data-[state=active]:bg-primary-container lg:data-[state=active]:text-on-primary-container"
              )}
            >
              <Icon size={ICON_SIZE.sm} />
              {label}
            </RadixTabs.Trigger>
          ))}
        </RadixTabs.List>

        <div className="min-w-0">
          <RadixTabs.Content value="bookings" className="focus:outline-none">
            <ProfileBookingsTab />
          </RadixTabs.Content>
          <RadixTabs.Content value="favorites" className="focus:outline-none">
            {/* Framed here rather than inside FavoritesRail, which is shared
                with /user where a Section already supplies the heading. */}
            <ProfileSection
              title="Favorites"
              description="Studios you've saved. Tap the heart on any studio to add it."
              actions={
                <Button asChild intent="outline" size="sm">
                  <Link href="/user/saved">See all saved</Link>
                </Button>
              }
            >
              <FavoritesRail />
            </ProfileSection>
          </RadixTabs.Content>
          <RadixTabs.Content value="notifications" className="focus:outline-none">
            <ProfileNotificationsTab />
          </RadixTabs.Content>
          <RadixTabs.Content value="payments" className="focus:outline-none">
            <ProfilePaymentHistoryTab />
          </RadixTabs.Content>
          <RadixTabs.Content value="settings" className="focus:outline-none">
            <ProfileSettingsTab />
          </RadixTabs.Content>
        </div>
      </RadixTabs.Root>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <Container className="flex flex-col gap-6 py-8">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </Container>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
