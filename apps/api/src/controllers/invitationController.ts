// apps/api/src/controllers/invitationController.ts
import { Request, Response, NextFunction } from "express";
import * as invitationService from "../services/invitationService";

export async function createInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, role } = req.body;
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;
    const invitedBy = req.user?.userId;

    if (!email || !role) {
      return res.status(400).json({ message: "Email et rôle requis" });
    }

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId requis" });
    }

    if (!invitedBy) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { invitation } = await invitationService.createInvitation({
      organizationId,
      email,
      role,
      invitedBy,
    });

    res.status(201).json({
      message: "Invitation envoyée avec succès",
      invitation: {
        _id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function acceptInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.query;
    const userId = req.user?.userId;

    if (!token) {
      return res.status(400).json({ message: "Token requis" });
    }

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const result = await invitationService.acceptInvitation(token as string, userId);

    res.status(200).json({
      message: "Invitation acceptée avec succès",
      membership: result.membership,
    });
  } catch (error) {
    next(error);
  }
}

export async function listInvitations(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const organizationId = (req.query.organizationId as string) || req.tenant?.organizationId;

    if (!organizationId) {
      return res.status(400).json({ message: "organizationId requis" });
    }

    const invitations = await invitationService.listInvitations(organizationId);
    res.status(200).json({ invitations });
  } catch (error) {
    next(error);
  }
}

export async function revokeInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invitationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    await invitationService.revokeInvitation(invitationId, userId);

    res.status(200).json({ message: "Invitation révoquée" });
  } catch (error) {
    next(error);
  }
}

export async function resendInvitation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { invitationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const result = await invitationService.resendInvitation(invitationId, userId);

    res.status(200).json({
      message: "Invitation renvoyée avec succès",
    });
  } catch (error) {
    next(error);
  }
}
