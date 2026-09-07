// apps/api/src/services/invitationService.ts
import crypto from "crypto";
import Invitation, { IInvitation } from "../models/Invitation";
import Membership from "../models/Membership";
import User from "../models/User";
import Organization from "../models/Organization";
import { UserRole } from "../types";
import { sendInvitationEmail } from "./emailService";

const INVITATION_EXPIRY_DAYS = 7;

export class InvitationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createInvitation(data: {
  organizationId: string;
  email: string;
  role: UserRole;
  invitedBy: string;
}): Promise<{ invitation: IInvitation; token: string }> {
  // Vérifier que l'inviteur est membre de l'organisation
  const membership = await Membership.findOne({
    userId: data.invitedBy,
    organizationId: data.organizationId,
  });

  if (!membership) {
    throw new InvitationError(
      "Vous n'êtes pas membre de cette organisation",
      403
    );
  }

  // Vérifier que l'inviteur est admin
  if (membership.role !== UserRole.ADMIN) {
    throw new InvitationError(
      "Seuls les administrateurs peuvent inviter des membres",
      403
    );
  }

  // Vérifier si l'utilisateur est déjà membre
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const existingMembership = await Membership.findOne({
      userId: existingUser._id,
      organizationId: data.organizationId,
    });
    if (existingMembership) {
      throw new InvitationError("Cet utilisateur est déjà membre", 409);
    }
  }

  // Vérifier s'il y a une invitation en attente
  const existingInvitation = await Invitation.findOne({
    organizationId: data.organizationId,
    email: data.email,
    status: "pending",
  });

  if (existingInvitation) {
    throw new InvitationError("Une invitation a déjà été envoyée à cet email", 409);
  }

  // Créer le token
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  const invitation = await Invitation.create({
    organizationId: data.organizationId,
    email: data.email,
    role: data.role,
    invitedBy: data.invitedBy,
    token,
    expiresAt,
  });

  // Envoyer l'email d'invitation
  const organization = await Organization.findById(data.organizationId);
  const inviter = await User.findById(data.invitedBy);

  if (organization && inviter) {
    const acceptUrl = `${process.env.CLIENT_URL}/invitations/accept?token=${token}`;
    sendInvitationEmail(data.email, inviter.name, organization.name, acceptUrl).catch(
      (err) => console.error("Erreur envoi email invitation:", err)
    );

    // En mode dev, logger le lien
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n📧 Lien d'invitation pour ${data.email} : ${acceptUrl}\n`);
    }
  }

  return { invitation, token };
}

export async function acceptInvitation(
  token: string,
  userId: string
): Promise<{ membership: any }> {
  const invitation = await Invitation.findOne({
    token,
    status: "pending",
  });

  if (!invitation) {
    throw new InvitationError("Invitation invalide ou expirée", 404);
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = "expired";
    await invitation.save();
    throw new InvitationError("Cette invitation a expiré", 410);
  }

  // Vérifier que l'utilisateur correspond à l'email
  const user = await User.findById(userId);
  if (!user || user.email !== invitation.email) {
    throw new InvitationError("Cette invitation ne vous est pas destinée", 403);
  }

  // Vérifier qu'il n'est pas déjà membre
  const existingMembership = await Membership.findOne({
    userId,
    organizationId: invitation.organizationId,
  });

  if (existingMembership) {
    throw new InvitationError("Vous êtes déjà membre de cette organisation", 409);
  }

  // Créer le membership
  const membership = await Membership.create({
    userId,
    organizationId: invitation.organizationId,
    role: invitation.role,
  });

  // Marquer l'invitation comme acceptée
  invitation.status = "accepted";
  await invitation.save();

  return { membership };
}

export async function listInvitations(organizationId: string) {
  return Invitation.find({ organizationId })
    .populate("invitedBy", "name email")
    .sort({ createdAt: -1 });
}

export async function revokeInvitation(
  invitationId: string,
  userId: string
): Promise<void> {
  const invitation = await Invitation.findById(invitationId);
  if (!invitation) {
    throw new InvitationError("Invitation non trouvée", 404);
  }

  // Vérifier que l'utilisateur est admin de l'organisation
  const membership = await Membership.findOne({
    userId,
    organizationId: invitation.organizationId,
    role: UserRole.ADMIN,
  });

  if (!membership) {
    throw new InvitationError("Seuls les administrateurs peuvent révoquer une invitation", 403);
  }

  invitation.status = "expired";
  await invitation.save();
}

export async function resendInvitation(
  invitationId: string,
  userId: string
): Promise<{ token: string }> {
  const invitation = await Invitation.findById(invitationId);
  if (!invitation) {
    throw new InvitationError("Invitation non trouvée", 404);
  }

  // Vérifier que l'utilisateur est admin
  const membership = await Membership.findOne({
    userId,
    organizationId: invitation.organizationId,
    role: UserRole.ADMIN,
  });

  if (!membership) {
    throw new InvitationError("Seuls les administrateurs peuvent renvoyer une invitation", 403);
  }

  // Générer un nouveau token
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  invitation.token = token;
  invitation.expiresAt = expiresAt;
  invitation.status = "pending";
  await invitation.save();

  // Renvoyer l'email
  const organization = await Organization.findById(invitation.organizationId);
  const inviter = await User.findById(userId);

  if (organization && inviter) {
    const acceptUrl = `${process.env.CLIENT_URL}/invitations/accept?token=${token}`;
    sendInvitationEmail(invitation.email, inviter.name, organization.name, acceptUrl).catch(
      (err) => console.error("Erreur envoi email invitation:", err)
    );

    if (process.env.NODE_ENV !== "production") {
      console.log(`\n📧 Lien d'invitation renvoyé pour ${invitation.email} : ${acceptUrl}\n`);
    }
  }

  return { token };
}
