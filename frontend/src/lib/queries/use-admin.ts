"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import {
  mockAdminDashboard,
  mockAdminUsers,
  mockBillingOverview,
  mockPayments,
  mockRefunds,
} from "@/lib/mock-data";
import type {
  AdminDashboardData,
  AdminBillingOverview,
  PaymentRecord,
  RefundRequestRecord,
  PaginatedResponse,
  User,
} from "@/types";

export function useAdminDashboard() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      if (isDemo) return mockAdminDashboard;
      return apiClient.get<AdminDashboardData>(
        "/admin/dashboard/",
        accessToken || undefined,
      );
    },
  });
}

export function useAdminUsers(params?: {
  role?: string;
  plan?: string;
  is_active?: string;
  search?: string;
  page?: number;
}) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      if (isDemo) {
        let filtered = mockAdminUsers.results;
        if (params?.role) {
          filtered = filtered.filter((u) => u.role === params.role);
        }
        if (params?.plan) {
          filtered = filtered.filter((u) => u.plan === params.plan);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (u) =>
              u.username.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              `${u.last_name}${u.first_name}`.includes(q),
          );
        }
        return { ...mockAdminUsers, results: filtered, count: filtered.length };
      }
      const query = new URLSearchParams();
      if (params?.role) query.set("role", params.role);
      if (params?.plan) query.set("plan", params.plan);
      if (params?.is_active) query.set("is_active", params.is_active);
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", String(params.page));
      const qs = query.toString();
      return apiClient.get<PaginatedResponse<User>>(
        `/admin/users/${qs ? `?${qs}` : ""}`,
        accessToken || undefined,
      );
    },
  });
}

export function useAdminBillingOverview() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "billing", "overview"],
    queryFn: async () => {
      if (isDemo) return mockBillingOverview;
      return apiClient.get<AdminBillingOverview>(
        "/admin/billing/overview/",
        accessToken || undefined,
      );
    },
  });
}

export function useAdminPayments(params?: {
  status?: string;
  search?: string;
  page?: number;
}) {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "billing", "payments", params],
    queryFn: async () => {
      if (isDemo) {
        let filtered = mockPayments.results;
        if (params?.status) {
          filtered = filtered.filter((p) => p.status === params.status);
        }
        return { ...mockPayments, results: filtered, count: filtered.length };
      }
      const query = new URLSearchParams();
      if (params?.status) query.set("status", params.status);
      if (params?.search) query.set("search", params.search);
      if (params?.page) query.set("page", String(params.page));
      const qs = query.toString();
      return apiClient.get<PaginatedResponse<PaymentRecord>>(
        `/admin/billing/payments/${qs ? `?${qs}` : ""}`,
        accessToken || undefined,
      );
    },
  });
}

export function useAdminRefunds() {
  const { accessToken } = useAuth();
  const isDemo = accessToken === "demo-token";

  return useQuery({
    queryKey: ["admin", "billing", "refunds"],
    queryFn: async () => {
      if (isDemo) return mockRefunds;
      return apiClient.get<PaginatedResponse<RefundRequestRecord>>(
        "/admin/billing/refunds/",
        accessToken || undefined,
      );
    },
  });
}
