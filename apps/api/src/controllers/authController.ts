// apps/api/src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import {
  register as registerService,
  login as loginService,
  verifyOTP as verifyOTPService,
  resendOTP as resendOTPService,
  AuthError,
} from "../services/authService";
import { sendOTPEmail } from "../services/emailService";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { registerSchema, loginSchema } from "../validations/authValidations";

// Configuration des cookies
const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";
const COOKIE_PATH = "/";

const isProduction = process.env.NODE_ENV === "production";

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000,
    path: COOKIE_PATH,
  });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: COOKIE_PATH,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE_NAME, { path: COOKIE_PATH });
  res.clearCookie(REFRESH_COOKIE_NAME, { path: COOKIE_PATH });
}

//Controllers 

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validation Zod
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AuthError("Données invalides", 400, parsed.error.issues);
    }

    const { user, otpCode } = await registerService(parsed.data);

    // Envoyer l'email OTP (en arrière-plan — ne bloque pas la réponse)
    sendOTPEmail(user.email, user.name, otpCode).catch((err) =>
      console.error("⚠️ Erreur envoi OTP :", err)
    );

    // Réponse
    res.status(201).json({
      message:
        "Inscription réussie. Vérifiez votre email pour le code OTP (valable 10 minutes).",
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AuthError("Données invalides", 400, parsed.error.issues);
    }

    const { user } = await loginService(parsed.data);

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      throw new AuthError("Email et otpCode requis", 400);
    }

    const { user } = await verifyOTPService(email, otpCode);

    res.status(200).json({
      message: "Compte vérifié avec succès",
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function resendOTP(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AuthError("Email requis", 400);
    }

    const { otpCode } = await resendOTPService(email);

    // Envoyer le nouvel OTP
    const user = await (await import("../models/User")).default.findOne({ email });
    if (user) {
      sendOTPEmail(user.email, user.name, otpCode).catch((err) =>
        console.error(" Erreur envoi OTP :", err)
      );
    }

    res.status(200).json({
      message: "Nouveau code OTP envoyé. Vérifiez votre email.",
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      throw new AuthError("Refresh token manquant", 401);
    }

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    });

    res.cookie(ACCESS_COOKIE_NAME, newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 15 * 60 * 1000,
      path: COOKIE_PATH,
    });

    res.status(200).json({ message: "Token rafraîchi" });
  } catch (error) {
    clearAuthCookies(res);
    next(new AuthError("Refresh token invalide ou expiré", 401));
  }
}

export async function logout(_req: Request, res: Response, _next: NextFunction) {
  clearAuthCookies(res);
  res.status(200).json({ message: "Déconnexion réussie" });
}

export async function me(req: Request, res: Response, _next: NextFunction) {
  res.status(200).json({
    user: req.user,
  });
}
