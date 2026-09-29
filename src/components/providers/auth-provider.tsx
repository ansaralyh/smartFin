"use client";

import { api } from "@/lib/api";
import type { User } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: current } = await api.auth.me();
      setUser(current);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const goToDashboard = useCallback(() => {
    window.location.assign("/dashboard");
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: loggedIn } = await api.auth.login(email, password);
      setUser(loggedIn);
      goToDashboard();
    },
    [goToDashboard],
  );

  const register = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      const { user: created } = await api.auth.register(data);
      setUser(created);
      goToDashboard();
    },
    [goToDashboard],
  );

  const logout = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
