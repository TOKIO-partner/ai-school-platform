"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { mockCourses } from "@/lib/mock-data";
import type { Course, PaginatedResponse } from "@/types";

export function useCourses(params?: { category?: string; difficulty?: string; search?: string }) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["courses", params],
    queryFn: async () => {
      if (isDemo) {
        let filtered = mockCourses;
        if (params?.category) {
          filtered = filtered.filter((c) => c.category === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter((c) => c.title.toLowerCase().includes(q));
        }
        return { count: filtered.length, next: null, previous: null, results: filtered };
      }
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.difficulty) query.set("difficulty", params.difficulty);
      if (params?.search) query.set("search", params.search);
      const qs = query.toString();
      return apiClient.get<PaginatedResponse<Course>>(
        `/courses/${qs ? `?${qs}` : ""}`,
        accessToken || undefined,
      );
    },
  });
}

export function useCourse(id: number | string) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      if (isDemo) {
        const course = mockCourses.find((c) => c.id === Number(id));
        if (!course) throw new Error("Course not found");
        return course;
      }
      return apiClient.get<Course>(`/courses/${id}/`, accessToken || undefined);
    },
    enabled: !!id,
  });
}
