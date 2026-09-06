
import Task from "../models/Task";

export async function createTask(data: {
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: Date;
}) {
  return Task.create({
    projectId: data.projectId,
    title: data.title,
    description: data.description,
    assignedTo: data.assignedTo,
    dueDate: data.dueDate,
  });
}

export async function listTasks(
  projectId: string,
  organizationId: string
) {
  // Vérifier que le projet appartient à l'organisation
  const Project = (await import("../models/Project")).default;
  const project = await Project.findOne({
    _id: projectId,
    organizationId,
  });

  if (!project) return null;

  return Task.find({ projectId }).sort({ createdAt: -1 });
}

export async function getTask(
  projectId: string,
  taskId: string,
  organizationId: string
) {
  const Project = (await import("../models/Project")).default;
  const project = await Project.findOne({
    _id: projectId,
    organizationId,
  });

  if (!project) return null;

  return Task.findOne({ _id: taskId, projectId });
}

export async function updateTask(
  projectId: string,
  taskId: string,
  organizationId: string,
  data: {
    title?: string;
    description?: string;
    assignedTo?: string;
    status?: string;
    dueDate?: Date;
  }
) {
  const Project = (await import("../models/Project")).default;
  const project = await Project.findOne({
    _id: projectId,
    organizationId,
  });

  if (!project) return null;

  return Task.findOneAndUpdate(
    { _id: taskId, projectId },
    { $set: data },
    { new: true }
  );
}

export async function deleteTask(
  projectId: string,
  taskId: string,
  organizationId: string
) {
  const Project = (await import("../models/Project")).default;
  const project = await Project.findOne({
    _id: projectId,
    organizationId,
  });

  if (!project) return null;

  return Task.findOneAndDelete({ _id: taskId, projectId });
}

export async function listMyTasks(organizationId: string, userId: string) {
  // Récupérer les projets de l'organisation
  const Project = (await import("../models/Project")).default;
  const projects = await Project.find({ organizationId });
  const projectIds = projects.map((p) => p._id);

  // Tâches assignées à l'utilisateur dans ces projets
  return Task.find({
    projectId: { $in: projectIds },
    assignedTo: userId,
  })
    .populate("projectId", "name")
    .sort({ dueDate: 1 });
}
