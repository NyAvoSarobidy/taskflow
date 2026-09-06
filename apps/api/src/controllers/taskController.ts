// apps/api/src/controllers/taskController.ts
import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const { title, description, assignedTo, dueDate } = req.body;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const task = await taskService.createTask({
      projectId,
      title,
      description,
      assignedTo,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json({ message: "Tâche créée", task });
  } catch (error) {
    next(error);
  }
}

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const tasks = await taskService.listTasks(projectId, organizationId);

    if (tasks === null) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
}

export async function getTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const task = await taskService.getTask(projectId, taskId, organizationId);

    if (task === null) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const { title, description, assignedTo, status, dueDate } = req.body;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const task = await taskService.updateTask(
      projectId,
      taskId,
      organizationId,
      {
        title,
        description,
        assignedTo,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      }
    );

    if (task === null) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json({ message: "Tâche mise à jour", task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const taskId = req.params.taskId as string;
    const organizationId = req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const task = await taskService.deleteTask(projectId, taskId, organizationId);

    if (task === null) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json({ message: "Tâche supprimée", task });
  } catch (error) {
    next(error);
  }
}

export async function listMyTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = req.tenant?.organizationId;
    const userId = req.user?.userId;

    if (!organizationId || !userId) {
      return res
        .status(400)
        .json({ message: "organizationId ou userId manquant" });
    }

    const tasks = await taskService.listMyTasks(organizationId, userId);
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
}
