// apps/api/src/controllers/projectController.ts
import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/projectService";

export async function createProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name } = req.body;
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const project = await projectService.createProject(organizationId, name);
    res.status(201).json({ message: "Projet créé", project });
  } catch (error) {
    next(error);
  }
}

export async function listProjects(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const projects = await projectService.listProjects(organizationId);
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
}

export async function getProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const project = await projectService.getProject(organizationId, projectId);

    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const { name } = req.body;
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const project = await projectService.updateProject(
      organizationId,
      projectId,
      name
    );

    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json({ message: "Projet mis à jour", project });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const projectId = req.params.projectId as string;
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId manquant" });
    }

    const project = await projectService.deleteProject(
      organizationId,
      projectId
    );

    if (!project) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    res.status(200).json({
      message: "Projet et ses tâches supprimés",
      project,
    });
  } catch (error) {
    next(error);
  }
}
