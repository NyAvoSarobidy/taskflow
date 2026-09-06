// apps/api/src/services/projectService.ts
import Project from "../models/Project";
import Task from "../models/Task";
import Subscription from "../models/Subscription";
import Membership from "../models/Membership";
import { PLAN_LIMITS, SubscriptionPlan } from "../types";

export class PlanLimitError extends Error {
  statusCode = 403;
  constructor(message: string) {
    super(message);
  }
}

export async function createProject(
  organizationId: string,
  name: string
) {
  // Vérifier le plan
  const subscription = await Subscription.findOne({ organizationId });
  const plan = subscription?.plan || SubscriptionPlan.FREE;

  if (plan === SubscriptionPlan.FREE) {
    const projectCount = await Project.countDocuments({ organizationId });
    const maxProjects = PLAN_LIMITS[SubscriptionPlan.FREE].maxProjects;
    if (projectCount >= maxProjects) {
      throw new PlanLimitError(
        `Plan gratuit : maximum ${maxProjects} projet(s). Passez au plan Pro.`
      );
    }
  }

  const project = await Project.create({
    organizationId,
    name,
  });

  return project;
}

export async function listProjects(organizationId: string) {
  return Project.find({ organizationId }).sort({ createdAt: -1 });
}

export async function getProject(organizationId: string, projectId: string) {
  return Project.findOne({ _id: projectId, organizationId });
}

export async function updateProject(
  organizationId: string,
  projectId: string,
  name: string
) {
  return Project.findOneAndUpdate(
    { _id: projectId, organizationId },
    { name },
    { new: true }
  );
}

export async function deleteProject(
  organizationId: string,
  projectId: string
) {
  // Supprimer aussi les tâches associées
  await Task.deleteMany({ projectId });
  return Project.findOneAndDelete({ _id: projectId, organizationId });
}
