"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import {
  mockEnrollments,
  mockStats,
  mockSkills,
  mockBadges,
} from "@/lib/mock-data";
import type {
  Enrollment,
  StudentStats,
  SkillPoint,
  UserBadge,
  LessonProgress,
  PaginatedResponse,
} from "@/types";

export function useMyEnrollments() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["enrollments", "me"],
    queryFn: async () => {
      if (isDemo) {
        return { count: mockEnrollments.length, next: null, previous: null, results: mockEnrollments };
      }
      return apiClient.get<PaginatedResponse<Enrollment>>(
        "/enrollments/me/",
        accessToken || undefined,
      );
    },
    enabled: !!accessToken,
  });
}

export function useMyStats() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["enrollments", "me", "stats"],
    queryFn: async () => {
      if (isDemo) return mockStats;
      return apiClient.get<StudentStats>(
        "/enrollments/me/stats/",
        accessToken || undefined,
      );
    },
    enabled: !!accessToken,
  });
}

export function useMySkills() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["enrollments", "me", "skills"],
    queryFn: async () => {
      if (isDemo) return mockSkills;
      const data = await apiClient.get<SkillPoint[] | PaginatedResponse<SkillPoint>>(
        "/enrollments/me/skills/",
        accessToken || undefined,
      );
      return Array.isArray(data) ? data : (data.results ?? []);
    },
    enabled: !!accessToken,
  });
}

export function useMyBadges() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["enrollments", "me", "badges"],
    queryFn: async () => {
      if (isDemo) return mockBadges;
      const data = await apiClient.get<UserBadge[] | PaginatedResponse<UserBadge>>(
        "/enrollments/me/badges/",
        accessToken || undefined,
      );
      return Array.isArray(data) ? data : (data.results ?? []);
    },
    enabled: !!accessToken,
  });
}

export function useUpdateLessonProgress() {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lessonId,
      data,
    }: {
      lessonId: number;
      data: { is_completed?: boolean; watch_time_seconds?: number };
    }) => {
      if (accessToken === "demo-token") {
        return { id: 0, lesson: lessonId, is_completed: true, watch_time_seconds: 0 } as LessonProgress;
      }
      return apiClient.patch<LessonProgress>(
        `/enrollments/me/lessons/${lessonId}/progress/`,
        data,
        accessToken || undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}
