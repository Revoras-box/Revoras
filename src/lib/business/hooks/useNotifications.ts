import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessApi } from "../api";
import type { NotificationRow, Pagination } from "../types";

export function useNotifications(params: { unreadOnly?: boolean; page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["business", "notifications", params],
    queryFn: () =>
      businessApi.listNotifications(params).then((r) => r as { notifications: NotificationRow[]; pagination: Pagination }),
    staleTime: 15_000,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["business", "notifications", "unread-count"],
    queryFn: () => businessApi.getUnreadNotificationCount().then((r) => r.count),
    staleTime: 15_000,
    refetchInterval: 60_000,
  });
}

const invalidateNotifications = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["business", "notifications"] });

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessApi.markNotificationRead(id),
    onSuccess: () => invalidateNotifications(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => businessApi.markAllNotificationsRead(),
    onSuccess: () => invalidateNotifications(queryClient),
  });
}
