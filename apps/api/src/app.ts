import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();

//Middlewares globaux
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//Route de santé (health check)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

//Routes métier
app.use("/api/auth", authRoutes);

//Swagger UI
setupSwagger(app);

//Gestion d'erreurs centralisée
app.use(
  (
    err: Error & { statusCode?: number; details?: unknown },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Erreur :", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: err.message || "Erreur interne du serveur",
      statusCode,
      details: err.details,
    });
  }
);

export default app;
