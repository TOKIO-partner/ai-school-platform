"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { mockCourses } from "@/lib/mock-data";
import type { AdminCourse, AdminChapter, AdminLesson, Course } from "@/types";

interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  content_type: string;
}

// DRF list endpoints return a paginated object ({ count, results }) by default,
// but some nested list views return a plain array. Normalize both to an array.
function unwrapList<T>(res: T[] | { results?: T[] } | null | undefined): T[] {
  if (Array.isArray(res)) return res;
  return res?.results ?? [];
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export function useAdminCourses(params?: {
  category?: string;
  difficulty?: string;
  status?: string;
  search?: string;
}) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "courses", params],
    queryFn: async (): Promise<AdminCourse[]> => {
      if (isDemo) {
        let filtered = mockCourses as AdminCourse[];
        if (params?.category)
          filtered = filtered.filter((c) => c.category === params.category);
        if (params?.status)
          filtered = filtered.filter((c) => c.status === params.status);
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter((c) =>
            c.title.toLowerCase().includes(q),
          );
        }
        return filtered;
      }
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.difficulty) query.set("difficulty", params.difficulty);
      if (params?.status) query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      const qs = query.toString();
      const res = await apiClient.get<AdminCourse[] | { results?: AdminCourse[] }>(
        `/admin/courses/${qs ? `?${qs}` : ""}`,
        accessToken || undefined,
      );
      return unwrapList(res);
    },
  });
}

export function useAdminCourse(courseId: number | null) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "course", courseId],
    enabled: !!courseId,
    queryFn: async (): Promise<AdminCourse> => {
      if (isDemo) {
        const course = mockCourses.find((c) => c.id === courseId);
        if (!course) throw new Error("Course not found");
        return course as AdminCourse;
      }
      return apiClient.get<AdminCourse>(
        `/admin/courses/${courseId}/`,
        accessToken || undefined,
      );
    },
  });
}

export function useAdminChapters(courseId: number | null) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "course", courseId, "chapters"],
    enabled: !!courseId,
    queryFn: async (): Promise<AdminChapter[]> => {
      if (isDemo) {
        const course = mockCourses.find((c) => c.id === courseId);
        return (course?.chapters ?? []) as AdminChapter[];
      }
      const res = await apiClient.get<AdminChapter[] | { results?: AdminChapter[] }>(
        `/admin/courses/${courseId}/chapters/`,
        accessToken || undefined,
      );
      return unwrapList(res);
    },
  });
}

export function useAdminLessons(courseId: number | null, chapterId: number | null) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "course", courseId, "chapter", chapterId, "lessons"],
    enabled: !!courseId && !!chapterId,
    queryFn: async (): Promise<AdminLesson[]> => {
      if (isDemo) {
        const course = mockCourses.find((c) => c.id === courseId);
        const chapter = course?.chapters?.find((ch) => ch.id === chapterId);
        return (chapter?.lessons ?? []) as AdminLesson[];
      }
      const res = await apiClient.get<AdminLesson[] | { results?: AdminLesson[] }>(
        `/admin/courses/${courseId}/chapters/${chapterId}/lessons/`,
        accessToken || undefined,
      );
      return unwrapList(res);
    },
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useCreateCourse() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) =>
      apiClient.post<AdminCourse>("/admin/courses/", data, accessToken || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function useUpdateCourse() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Course> & { id: number }) =>
      apiClient.patch<AdminCourse>(`/admin/courses/${id}/`, data, accessToken || undefined),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.id] });
    },
  });
}

export function useDeleteCourse() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/admin/courses/${id}/`, accessToken || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function useCreateChapter() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, ...data }: { courseId: number; title: string; order: number }) =>
      apiClient.post<AdminChapter>(
        `/admin/courses/${courseId}/chapters/`,
        data,
        accessToken || undefined,
      ),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId, "chapters"] });
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId] });
    },
  });
}

export function useUpdateChapter() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      id,
      ...data
    }: { courseId: number; id: number } & Partial<AdminChapter>) =>
      apiClient.patch<AdminChapter>(
        `/admin/courses/${courseId}/chapters/${id}/`,
        data,
        accessToken || undefined,
      ),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId, "chapters"] });
    },
  });
}

export function useDeleteChapter() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, id }: { courseId: number; id: number }) =>
      apiClient.delete(
        `/admin/courses/${courseId}/chapters/${id}/`,
        accessToken || undefined,
      ),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId, "chapters"] });
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId] });
    },
  });
}

export function useCreateLesson() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      chapterId,
      ...data
    }: { courseId: number; chapterId: number } & Partial<AdminLesson>) =>
      apiClient.post<AdminLesson>(
        `/admin/courses/${courseId}/chapters/${chapterId}/lessons/`,
        data,
        accessToken || undefined,
      ),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["admin", "course", variables.courseId, "chapter", variables.chapterId, "lessons"],
      });
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId] });
    },
  });
}

export function useUpdateLesson() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      chapterId,
      id,
      ...data
    }: { courseId: number; chapterId: number; id: number } & Partial<AdminLesson>) =>
      apiClient.patch<AdminLesson>(
        `/admin/courses/${courseId}/chapters/${chapterId}/lessons/${id}/`,
        data,
        accessToken || undefined,
      ),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["admin", "course", variables.courseId, "chapter", variables.chapterId, "lessons"],
      });
    },
  });
}

export function useDeleteLesson() {
  const { accessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      chapterId,
      id,
    }: { courseId: number; chapterId: number; id: number }) =>
      apiClient.delete(
        `/admin/courses/${courseId}/chapters/${chapterId}/lessons/${id}/`,
        accessToken || undefined,
      ),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: ["admin", "course", variables.courseId, "chapter", variables.chapterId, "lessons"],
      });
      qc.invalidateQueries({ queryKey: ["admin", "course", variables.courseId] });
    },
  });
}

// ---------------------------------------------------------------------------
// Media upload
// ---------------------------------------------------------------------------

export function useMediaUpload() {
  const { accessToken } = useAuth();

  return useMutation({
    mutationFn: (file: File) =>
      apiClient.upload<UploadResult>(
        "/admin/media/upload/",
        file,
        accessToken || undefined,
      ),
  });
}
