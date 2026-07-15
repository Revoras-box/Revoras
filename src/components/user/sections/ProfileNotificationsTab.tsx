"use client";

import { Bell } from "lucide-react";
import { ListItem, EmptyState, CardSkeleton, Button, Badge } from "@/components/ui";
import { useNotifications, useMutation } from "@/lib/hooks";
import { api } from "@/lib/api";

export default function ProfileNotificationsTab() {
  const { data, loading, refetch } = useNotifications({ limit: 30 });
  const { mutate: markRead } = useMutation(api.markNotificationRead);
  const { mutate: markAllRead } = useMutation(api.markAllNotificationsRead);
  const notifications = data?.notifications ?? [];
  const hasUnread = notifications.some((n) => !n.read_at);

  const handleClick = async (id: string, readAt: string | null) => {
    if (readAt) return;
    await markRead(id);
    refetch();
  };

  const handleMarkAll = async () => {
    await markAllRead();
    refetch();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyState icon={<Bell size={32} />} title="No notifications yet" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {hasUnread ? (
        <div className="flex justify-end">
          <Button intent="ghost" size="sm" onClick={handleMarkAll}>
            Mark all as read
          </Button>
        </div>
      ) : null}
      {notifications.map((n) => (
        <ListItem
          key={n.id}
          interactive={!n.read_at}
          onClick={() => handleClick(n.id, n.read_at)}
          title={n.title}
          subtitle={n.message}
          trailing={!n.read_at ? <Badge tone="primary" dot>New</Badge> : undefined}
        />
      ))}
    </div>
  );
}
