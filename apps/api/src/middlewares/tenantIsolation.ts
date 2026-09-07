// apps/api/src/middlewares/tenantIsolation.ts
import { Request, Response, NextFunction } from "express";
import Membership from "../models/Membership";
import Project from "../models/Project";

/**
 * Vérifie que l'utilisateur authentifié appartient à l'organizationId demandé.
 * L'organizationId peut venir du body, des params, des query params,
 * ou être résolu depuis le projet (via projectId).
 * Attache req.tenant = { organizationId, role } si OK.
 */
export async function tenantIsolation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupérer l'organizationId depuis body, params ou query
    let organizationId =
      req.body?.organizationId ||
      req.params?.organizationId ||
      req.query?.organizationId;

    // Si pas d'organizationId, essayer de le résoudre depuis le projet
    if (!organizationId && req.params?.projectId) {
      const project = await Project.findById(req.params.projectId).select("organizationId");
      if (project) {
        organizationId = project.organizationId.toString();
      }
    }

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId requis" });
    }

    // Vérifier que l'utilisateur est membre de cette organisation
    const membership = await Membership.findOne({
      userId: req.user?.userId,
      organizationId,
    });

    if (!membership) {
      return res
        .status(403)
        .json({ message: "Accès interdit à cette organisation" });
    }

    // Attacher le tenant à la requête
    req.tenant = {
      organizationId: organizationId as string,
      role: membership.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
