"use client";

import { Bell } from "lucide-react";
import { Card, ListItem, EmptyState, CardSkeleton, Button, Badge } from "@/components/ui";
import { useNotifications, useMutation } from "@/lib/hooks";
import { api } from "@/lib/api";
import { ICON_SIZE } from "@/lib/design-tokens";
import { ProfileSection } from "./ProfileSection";

export default function ProfileNotificationsTab() {
  const { data, loading, refetch } = useNotifications({ limit: 30 });
  const { mutate: markRead } = useMutation(api.markNotificationRead);
  const { mutate: markAllRead } = useMutation(api.markAllNotificationsRead);
  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleClick = async (id: string, readAt: string | null) => {
    if (readAt) return;
    await markRead(id);
    refetch();
  };

  const handleMarkAll = async () => {
    await markAllRead();
    refetch();
  };

  return (
    <ProfileSection
      title="Notifications"
      description={
        unreadCount > 0
          ? `${unreadCount} unread of your ${notifications.length} most recent.`
          : "Updates about your bookings and payments."
      }
      actions={
        unreadCount > 0 ? (
          <Button intent="ghost" size="sm" onClick={handleMarkAll}>
            Mark all as read
          </Button>
        ) : null
      }
    >
      {loading ? (
        <div className="flex flex-col gap-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : notifications.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={<Bell size={ICON_SIZE.lg} />}
            title="No notifications yet"
            description="Booking confirmations, reminders and payment receipts will show up here."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <ListItem
              key={n.id}
              interactive={!n.read_at}
              onClick={() => handleClick(n.id, n.read_at)}
              title={n.title}
              subtitle={n.message}
              trailing={
                !n.read_at ? (
                  <Badge tone="primary" dot>
                    New
                  </Badge>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </ProfileSection>
  );
}
