// apps/web/src/lib/api.ts
// Client API pour communiquer avec le backend Express

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown>;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const config: RequestInit = {
    ...rest,
    credentials: "include",
    headers: {
      ...(body && typeof body !== "string" ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur API");
  }

  return data as T;
}

export interface AuthResponse {
  message: string;
  user: {
    _id: string;
    email: string;
    name: string;
    isVerified?: boolean;
  };
}

export interface UserResponse {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/register", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: data }),

  logout: () => apiFetch<{ message: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<UserResponse>("/api/auth/me"),

  verifyOtp: (data: { email: string; otpCode: string }) =>
    apiFetch<AuthResponse>("/api/auth/verify-otp", { method: "POST", body: data }),

  resendOtp: (data: { email: string }) =>
    apiFetch<{ message: string }>("/api/auth/resend-otp", { method: "POST", body: data }),
};
