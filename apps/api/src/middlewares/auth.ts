// apps/api/src/middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

const ACCESS_COOKIE_NAME = "access_token";

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Essayer de lire le cookie httpOnly
    let token = req.cookies?.[ACCESS_COOKIE_NAME];

    // 2. Fallback : header Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Vérifier le token
    const payload = verifyAccessToken(token);

    // Attacher l'utilisateur à la requête
    req.user = {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}
