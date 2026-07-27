"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container, Tabs, TabsPanel } from "@/components/ui";
import FavoritesRail from "@/components/user/sections/FavoritesRail";
import ProfileBookingsTab from "@/components/user/sections/ProfileBookingsTab";
import ProfileNotificationsTab from "@/components/user/sections/ProfileNotificationsTab";
import ProfileSettingsTab from "@/components/user/sections/ProfileSettingsTab";
import ProfilePaymentHistoryTab from "@/components/user/sections/ProfilePaymentHistoryTab";

const TAB_ITEMS = [
  { value: "bookings", label: "Bookings" },
  { value: "favorites", label: "Favorites" },
  { value: "notifications", label: "Notifications" },
  { value: "settings", label: "Settings" },
  { value: "payments", label: "Payment history" },
];

function ProfilePageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "bookings");

  // Keep the active tab in sync with the URL so navigating to
  // `/user/profile?tab=favorites` (e.g. the account menu's "Favorites" link)
  // switches tabs even when we're already on the profile page and React reuses
  // this component instead of remounting it.
  const tabParam = searchParams.get("tab");
  useEffect(() => {
    if (tabParam && tabParam !== activeTab) setActiveTab(tabParam);
    // Only react to the URL changing, not to in-page tab clicks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  return (
    <Container className="flex flex-col gap-6 py-8">
      <h1 className="font-headline text-2xl font-bold text-on-surface">Profile</h1>
      <Tabs items={TAB_ITEMS} value={activeTab} onValueChange={setActiveTab}>
        <TabsPanel value="bookings">
          <ProfileBookingsTab />
        </TabsPanel>
        <TabsPanel value="favorites">
          <FavoritesRail />
        </TabsPanel>
        <TabsPanel value="notifications">
          <ProfileNotificationsTab />
        </TabsPanel>
        <TabsPanel value="settings">
          <ProfileSettingsTab />
        </TabsPanel>
        <TabsPanel value="payments">
          <ProfilePaymentHistoryTab />
        </TabsPanel>
      </Tabs>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<Container className="py-8 text-sm text-muted">Loading profile...</Container>}>
      <ProfilePageContent />
    </Suspense>
  );
}
