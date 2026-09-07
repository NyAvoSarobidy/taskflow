// apps/web/src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, organizationsApi, UserResponse } from "@/lib/api";

interface AuthContextType {
  user: UserResponse["user"] | null;
  organizationId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, otpCode: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse["user"] | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((data) => {
        setUser(data.user);
        // Récupérer l'organizationId de l'utilisateur
        return organizationsApi.list();
      })
      .then((data) => {
        if (data.organizations.length > 0) {
          setOrganizationId(data.organizations[0].organizationId);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await authApi.login({ email, password });
    const userData = await authApi.me();
    setUser(userData.user);
    // Récupérer l'organizationId
    const orgData = await organizationsApi.list();
    if (orgData.organizations.length > 0) {
      setOrganizationId(orgData.organizations[0].organizationId);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authApi.register({ name, email, password });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setOrganizationId(null);
  }, []);

  const verifyOtp = useCallback(async (email: string, otpCode: string) => {
    await authApi.verifyOtp({ email, otpCode });
    const userData = await authApi.me();
    setUser(userData.user);
    // Récupérer l'organizationId
    const orgData = await organizationsApi.list();
    if (orgData.organizations.length > 0) {
      setOrganizationId(orgData.organizations[0].organizationId);
    }
  }, []);

  const resendOtp = useCallback(async (email: string) => {
    await authApi.resendOtp({ email });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        organizationId,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
      }}
    >
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
