// apps/api/src/controllers/organizationController.ts
import { Request, Response, NextFunction } from "express";
import * as organizationService from "../services/organizationService";

export async function listOrganizations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const organizations = await organizationService.listUserOrganizations(userId);
    res.status(200).json({ organizations });
  } catch (error) {
    next(error);
  }
}

export async function getOrganization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = req.params.organizationId as string;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const organization = await organizationService.getOrganization(
      organizationId,
      userId
    );

    if (!organization) {
      return res.status(404).json({ message: "Organisation non trouvée" });
    }

    res.status(200).json({ organization });
  } catch (error) {
    next(error);
  }
}
