// Re-export des enums et constantes depuis les types
export { PLAN_LIMITS, SubscriptionPlan, UserRole, TaskStatus } from "@/types";

// Données factices pour le développement frontend
import {
  User,
  Organization,
  Membership,
  Subscription,
  Project,
  Task,
  UserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  TaskStatus,
} from "@/types";

export const mockOrganization: Organization = {
  _id: "org_1",
  name: "Carrefour Ventures",
  createdAt: "2026-08-15T10:00:00Z",
};

export const mockSubscription: Subscription = {
  _id: "sub_1",
  organizationId: "org_1",
  plan: SubscriptionPlan.FREE,
  status: SubscriptionStatus.ACTIVE,
};

export const mockUsers: User[] = [
  { _id: "user_1", email: "aminata@carrefour.mg", name: "Aminata", role: UserRole.ADMIN, createdAt: "2026-08-15T10:00:00Z" },
  { _id: "user_2", email: "jean@carrefour.mg", name: "Jean", role: UserRole.MEMBRE, createdAt: "2026-08-16T09:00:00Z" },
  { _id: "user_3", email: "lucie@carrefour.mg", name: "Lucie", role: UserRole.MEMBRE, createdAt: "2026-08-17T08:00:00Z" },
];

export const mockProjects: Project[] = [
  { _id: "proj_1", organizationId: "org_1", name: "Lancement appli mobile", createdAt: "2026-08-20T10:00:00Z" },
  { _id: "proj_2", organizationId: "org_1", name: "Refonte site vitrine", createdAt: "2026-08-25T14:00:00Z" },
  { _id: "proj_3", organizationId: "org_1", name: "Campagne fidélité", createdAt: "2026-09-01T09:00:00Z" },
];

export const mockTasks: Task[] = [
  { _id: "task_1", projectId: "proj_1", title: "Rédiger le cahier des charges", assignedTo: "user_1", status: TaskStatus.TERMINE, createdAt: "2026-08-20T10:00:00Z" },
  { _id: "task_2", projectId: "proj_1", title: "Valider les maquettes", assignedTo: "user_2", status: TaskStatus.EN_COURS, createdAt: "2026-08-22T11:00:00Z" },
  { _id: "task_3", projectId: "proj_1", title: "Configurer l'environnement de dev", assignedTo: "user_3", status: TaskStatus.A_FAIRE, createdAt: "2026-08-24T09:00:00Z" },
  { _id: "task_4", projectId: "proj_1", title: "Implémenter l'authentification", assignedTo: "user_1", status: TaskStatus.A_FAIRE, dueDate: "2026-09-10T00:00:00Z", createdAt: "2026-08-26T14:00:00Z" },
  { _id: "task_5", projectId: "proj_2", title: "Audit SEO du site actuel", assignedTo: "user_2", status: TaskStatus.TERMINE, createdAt: "2026-08-25T14:00:00Z" },
  { _id: "task_6", projectId: "proj_2", title: "Nouvelle charte graphique", assignedTo: "user_1", status: TaskStatus.EN_COURS, createdAt: "2026-08-27T10:00:00Z" },
  { _id: "task_7", projectId: "proj_3", title: "Analyser les données clients", assignedTo: "user_3", status: TaskStatus.A_FAIRE, dueDate: "2026-09-08T00:00:00Z", createdAt: "2026-09-01T09:00:00Z" },
  { _id: "task_8", projectId: "proj_3", title: "Rédiger les règles de la campagne", assignedTo: "user_1", status: TaskStatus.EN_COURS, createdAt: "2026-09-02T11:00:00Z" },
];

export const mockCurrentUser: User = mockUsers[0];
