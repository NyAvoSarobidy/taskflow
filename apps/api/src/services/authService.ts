// apps/api/src/services/authService.ts
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/User";
import Organization, { IOrganization } from "../models/Organization";
import Membership, { IMembership } from "../models/Membership";
import Subscription, { ISubscription } from "../models/Subscription";
import { UserRole, SubscriptionPlan, SubscriptionStatus } from "../types";
import { RegisterInput, LoginInput } from "../validations/authValidations";
import { createOTP } from "./emailService";

const SALT_ROUNDS = 10;

export class AuthError extends Error {
  statusCode: number;
  details?: unknown;
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function register(
  data: RegisterInput
): Promise<{ user: IUser; organization: IOrganization; otpCode: string }> {
  const { email, password, name } = data;

  // Vérifier si l'email existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AuthError("Un compte avec cet email existe déjà", 409);
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Générer OTP
  const { code: otpCode, expiresAt: otpExpires } = createOTP();

  // Transaction : User + Organization + Membership + Subscription
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Créer l'utilisateur avec OTP
    const [user] = await User.create(
      [
        {
          email,
          password: hashedPassword,
          name,
          otpCode,
          otpExpires,
          isVerified: false,
        },
      ],
      { session }
    );

    // 2. Créer l'organisation (nom par défaut = nom de l'utilisateur)
    const [organization] = await Organization.create(
      [{ name: `${name}'s Organization` }],
      { session }
    );

    // 3. Créer le membership (admin)
    await Membership.create(
      [
        {
          userId: user._id,
          organizationId: organization._id,
          role: UserRole.ADMIN,
        },
      ],
      { session }
    );

    // 4. Créer l'abonnement (plan free)
    await Subscription.create(
      [
        {
          organizationId: organization._id,
          plan: SubscriptionPlan.FREE,
          status: SubscriptionStatus.ACTIVE,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return { user, organization, otpCode };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

export async function login(
  data: LoginInput
): Promise<{ user: IUser }> {
  const { email, password } = data;

  // Trouver l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError("Email ou mot de passe incorrect", 401);
  }

  // Vérifier si le compte est vérifié
  if (!user.isVerified) {
    throw new AuthError("Compte non vérifié. Veuillez vérifier votre email.", 403);
  }

  // Comparer le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password as string);
  if (!isPasswordValid) {
    throw new AuthError("Email ou mot de passe incorrect", 401);
  }

  return { user };
}

export async function verifyOTP(
  email: string,
  otpCode: string
): Promise<{ user: IUser }> {
  // Trouver l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError("Utilisateur non trouvé", 404);
  }

  if (user.isVerified) {
    throw new AuthError("Ce compte est déjà vérifié", 400);
  }

  // Vérifier le code
  if (user.otpCode !== otpCode) {
    throw new AuthError("Code OTP invalide", 400);
  }

  // Vérifier l'expiration
  if (!user.otpExpires || user.otpExpires < new Date()) {
    throw new AuthError("Code OTP expiré. Veuillez demander un nouveau code.", 400);
  }

  // Marquer comme vérifié
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  return { user };
}

export async function resendOTP(email: string): Promise<{ otpCode: string }> {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthError("Utilisateur non trouvé", 404);
  }

  if (user.isVerified) {
    throw new AuthError("Ce compte est déjà vérifié", 400);
  }

  // Générer un nouveau code
  const { code: otpCode, expiresAt: otpExpires } = createOTP();
  user.otpCode = otpCode;
  user.otpExpires = otpExpires;
  await user.save();

  return { otpCode };
}
