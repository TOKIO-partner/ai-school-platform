"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient } from "./api-client";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (token: string) => {
    try {
      const res = await apiClient.get<User>("/users/me/", token);
      setUser(res);
    } catch {
      setUser(null);
      setAccessToken(null);
    }
  }, []);

  // Try to refresh token on mount
  useEffect(() => {
    const refreshAuth = async () => {
      try {
        const res = await apiClient.post<{ access: string }>("/auth/token/refresh/", {});
        setAccessToken(res.access);
        await fetchProfile(res.access);
      } catch {
        // Not authenticated — silently ignore (backend may be unavailable)
      } finally {
        setIsLoading(false);
      }
    };
    refreshAuth();
  }, [fetchProfile]);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post<{ access: string; refresh: string }>("/auth/login/", { username: email, password });
    setAccessToken(res.access);
    await fetchProfile(res.access);
  };

  const register = async (data: RegisterData) => {
    const res = await apiClient.post<{ user: User; tokens: { access: string; refresh: string } }>("/auth/register/", data);
    setAccessToken(res.tokens.access);
    setUser(res.user);
  };

  const demoLogin = useCallback(() => {
    setUser({
      id: 1,
      email: "demo@momocri.com",
      username: "demo",
      first_name: "麻子",
      last_name: "長谷川",
      role: "student",
      plan: "pro",
      avatar: null,
      bio: "デモアカウント",
    });
    setAccessToken("demo-token");
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout/", { refresh: "" }, accessToken || undefined);
    } catch {
      // Ignore logout errors
    }
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
