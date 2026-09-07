// Types métier TaskFlow (miroir du backend)
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

export interface User {
  _id: string;
  email: string;
  name: string;
  role?: UserRole;
  createdAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  createdAt: string;
}

export interface Membership {
  _id: string;
  userId: string;
  organizationId: string;
  role: UserRole;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  organizationId: string;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  status: SubscriptionStatus;
}

export interface Project {
  _id: string;
  organizationId: string;
  name: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
}

export const PLAN_LIMITS = {
  [SubscriptionPlan.FREE]: { maxProjects: 1, maxMembers: 3 },
  [SubscriptionPlan.PRO]: { maxProjects: Infinity, maxMembers: Infinity },
} as const;
