import { Request, Response, NextFunction } from "express";
import Membership from "../models/Membership";

/**
 * Vérifie que l'utilisateur authentifié appartient à l'organizationId demandé.
 * L'organizationId peut venir du body, des params, ou des query params.
 * Attache req.tenant = { organizationId, role } si OK.
 */
export async function tenantIsolation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Récupérer l'organizationId depuis body, params ou query
    const organizationId =
      req.body?.organizationId ||
      req.params?.organizationId ||
      req.query?.organizationId;

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
