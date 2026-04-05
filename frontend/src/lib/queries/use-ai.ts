"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import type { AIChatMessage, AILessonComment } from "@/types";

export function useAIChatHistory(lessonId: number | string | undefined) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["ai-chat-history", lessonId],
    queryFn: async () => {
      if (isDemo) return [];
      return apiClient.get<AIChatMessage[]>(
        `/ai/chat/${lessonId}/history/`,
        accessToken || undefined,
      );
    },
    enabled: !!lessonId && !isDemo,
  });
}

export function useAILessonComments(lessonId: number | string | undefined) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["ai-lesson-comments", lessonId],
    queryFn: async () => {
      if (isDemo) return [];
      return apiClient.get<AILessonComment[]>(
        `/ai/lessons/${lessonId}/comments/`,
        accessToken || undefined,
      );
    },
    enabled: !!lessonId && !isDemo,
    staleTime: 60 * 60 * 1000, // 1 hour cache
  });
}
