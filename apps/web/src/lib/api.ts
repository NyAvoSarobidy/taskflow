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
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur API");
  }

  return data as T;
}

// Types de réponse
export interface AuthResponse {
  message: string;
  user: {
    _id: string;
    email: string;
    name: string;
    isVerified?: boolean;
  };
  otpCode?: string;
}

export interface UserResponse {
  user: {
    userId: string;
    email: string;
    name: string;
  };
}

export interface OrganizationResponse {
  organizations: Array<{
    organizationId: string;
    name: string;
    role: string;
    createdAt: string;
  }>;
}

export interface ProjectResponse {
  projects: Array<{
    _id: string;
    organizationId: string;
    name: string;
    createdAt: string;
  }>;
}

export interface SingleProjectResponse {
  project: {
    _id: string;
    organizationId: string;
    name: string;
    createdAt: string;
  };
}

export interface TaskResponse {
  tasks: Array<{
    _id: string;
    projectId: string;
    title: string;
    description?: string;
    assignedTo?: string;
    status: string;
    dueDate?: string;
    createdAt: string;
  }>;
}

export interface MessageResponse {
  message: string;
}

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/register", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: data }),

  logout: () => apiFetch<MessageResponse>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<UserResponse>("/api/auth/me"),

  verifyOtp: (data: { email: string; otpCode: string }) =>
    apiFetch<AuthResponse>("/api/auth/verify-otp", { method: "POST", body: data }),

  resendOtp: (data: { email: string }) =>
    apiFetch<MessageResponse>("/api/auth/resend-otp", { method: "POST", body: data }),

  refresh: () => apiFetch<MessageResponse>("/api/auth/refresh", { method: "POST" }),
};

// Organizations API
export const organizationsApi = {
  list: () => apiFetch<OrganizationResponse>("/api/organizations"),

  get: (organizationId: string) =>
    apiFetch<OrganizationResponse>(`/api/organizations/${organizationId}`),
};

// Projects API
export const projectsApi = {
  list: (organizationId: string) =>
    apiFetch<ProjectResponse>(`/api/projects?organizationId=${organizationId}`),

  get: (projectId: string, organizationId: string) =>
    apiFetch<SingleProjectResponse>(
      `/api/projects/${projectId}?organizationId=${organizationId}`
    ),

  create: (data: { name: string; organizationId: string }) =>
    apiFetch<SingleProjectResponse>("/api/projects", {
      method: "POST",
      body: data,
    }),

  update: (projectId: string, data: { name: string; organizationId: string }) =>
    apiFetch<SingleProjectResponse>(`/api/projects/${projectId}`, {
      method: "PUT",
      body: data,
    }),

  delete: (projectId: string, organizationId: string) =>
    apiFetch<MessageResponse>(
      `/api/projects/${projectId}?organizationId=${organizationId}`,
      { method: "DELETE" }
    ),
};

// Tasks API
export const tasksApi = {
  listByProject: (projectId: string, organizationId: string) =>
    apiFetch<TaskResponse>(
      `/api/tasks/projects/${projectId}/tasks?organizationId=${organizationId}`
    ),

  get: (projectId: string, taskId: string, organizationId: string) =>
    apiFetch<TaskResponse>(
      `/api/tasks/projects/${projectId}/tasks/${taskId}?organizationId=${organizationId}`
    ),

  create: (projectId: string, data: { title: string; description?: string; assignedTo?: string; dueDate?: string }) =>
    apiFetch<TaskResponse>(`/api/tasks/projects/${projectId}/tasks`, {
      method: "POST",
      body: data,
    }),

  update: (projectId: string, taskId: string, data: { title?: string; description?: string; assignedTo?: string; status?: string; dueDate?: string }) =>
    apiFetch<TaskResponse>(`/api/tasks/projects/${projectId}/tasks/${taskId}`, {
      method: "PUT",
      body: data,
    }),

  delete: (projectId: string, taskId: string, organizationId: string) =>
    apiFetch<MessageResponse>(
      `/api/tasks/projects/${projectId}/tasks/${taskId}?organizationId=${organizationId}`,
      { method: "DELETE" }
    ),

  myTasks: (organizationId: string) =>
    apiFetch<TaskResponse>(`/api/tasks/my-tasks?organizationId=${organizationId}`),
};

// Billing API
export const billingApi = {
  checkout: (data: { plan: string; organizationId: string }) =>
    apiFetch<{ sessionId: string; url: string }>("/api/billing/checkout", {
      method: "POST",
      body: data,
    }),

  portal: (data: { organizationId: string }) =>
    apiFetch<{ url: string }>("/api/billing/portal", {
      method: "POST",
      body: data,
    }),
};

// Invitations API
export const invitationsApi = {
  create: (data: { email: string; role: string; organizationId: string }) =>
    apiFetch<any>("/api/invitations", {
      method: "POST",
      body: data,
    }),

  list: (organizationId: string) =>
    apiFetch<any>(`/api/invitations?organizationId=${organizationId}`),

  accept: (token: string) =>
    apiFetch<any>(`/api/invitations/accept?token=${token}`),

  revoke: (invitationId: string) =>
    apiFetch<any>(`/api/invitations/${invitationId}/revoke`, { method: "POST" }),

  resend: (invitationId: string) =>
    apiFetch<any>(`/api/invitations/${invitationId}/resend`, { method: "POST" }),
};

// Members API
export const membersApi = {
  list: (organizationId: string) =>
    apiFetch<any>(`/api/members?organizationId=${organizationId}`),
};
