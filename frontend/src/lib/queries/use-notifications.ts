"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { mockNotifications } from "@/lib/mock-data";
import type { Notification, PaginatedResponse } from "@/types";

const NOTIFICATIONS_KEY = ["notifications", "me"];

export function useNotifications() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async () => {
      if (isDemo) return mockNotifications;
      const data = await apiClient.get<Notification[] | PaginatedResponse<Notification>>(
        "/notifications/me/",
        accessToken || undefined,
      );
      return Array.isArray(data) ? data : (data.results ?? []);
    },
    enabled: !!accessToken,
  });
}

export function useUnreadCount() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: [...NOTIFICATIONS_KEY, "unread-count"],
    queryFn: async () => {
      if (isDemo) {
        return { count: mockNotifications.filter((n) => !n.is_read).length };
      }
      return apiClient.get<{ count: number }>(
        "/notifications/me/unread-count/",
        accessToken || undefined,
      );
    },
    enabled: !!accessToken,
  });
}

export function useMarkNotificationRead() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (accessToken === "demo-token") return { id } as Partial<Notification>;
      return apiClient.patch<Notification>(
        `/notifications/me/${id}/read/`,
        {},
        accessToken || undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (accessToken === "demo-token") return { updated: 0 };
      return apiClient.post<{ updated: number }>(
        "/notifications/me/read-all/",
        {},
        accessToken || undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}
