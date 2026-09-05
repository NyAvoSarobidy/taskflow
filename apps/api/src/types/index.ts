
export enum UserRole {
  ADMIN = "admin",
  MEMBRE = "membre",
}

export enum SubscriptionPlan {
  FREE = "free",
  PRO = "pro",
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  TRIALING = "trialing",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
}

export enum TaskStatus {
  A_FAIRE = "a_faire",
  EN_COURS = "en_cours",
  TERMINE = "termine",
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface IOrganization {
  _id: string;
  name: string;
  createdAt: Date;
}

export interface IMembership {
  _id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: Date;
}

export interface ISubscription {
  _id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: SubscriptionStatus;
}

export interface IProject {
  _id: string;
  organizationId: string;
  name: string;
  createdAt: Date;
}

export interface ITask {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: Omit<IUser, "password">;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: {
    maxProjects: 1,
    maxMembers: 3,
  },
  [SubscriptionPlan.PRO]: {
    maxProjects: Infinity,
    maxMembers: Infinity,
  },
} as const;
