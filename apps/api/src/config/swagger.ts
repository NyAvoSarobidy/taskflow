// apps/api/src/config/swagger.ts
import swaggerUi from "swagger-ui-express";

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description:
      "API de TaskFlow — mini-SaaS de gestion de tâches collaborative (projet d'apprentissage)",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Développement",
    },
  ],
  tags: [
    { name: "Health", description: "Santé du serveur" },
    { name: "Auth", description: "Authentification" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Serveur opérationnel",
            content: {
              "application/json": {
                example: { status: "ok", timestamp: "2026-09-04T13:38:17.705Z" },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Inscription",
        description:
          "Crée un utilisateur + une organisation + membership admin + abonnement free. Un code OTP à 6 chiffres est envoyé par email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password", "name"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                  name: { type: "string", minLength: 2 },
                },
              },
              example: {
                email: "aminata@example.com",
                password: "password123",
                name: "Aminata",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Inscription réussie — OTP envoyé par email",
            content: {
              "application/json": {
                example: {
                  message:
                    "Inscription réussie. Vérifiez votre email pour le code OTP (valable 10 minutes).",
                  user: {
                    _id: "6a9acadb7c875f8f46eaf5a9",
                    email: "aminata@example.com",
                    name: "Aminata",
                    isVerified: false,
                  },
                },
              },
            },
          },
          "409": { description: "Email déjà utilisé" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Connexion",
        description:
          "Le compte doit être vérifié (isVerified=true) pour se connecter",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
              example: {
                email: "aminata@example.com",
                password: "password123",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Connexion réussie",
            content: {
              "application/json": {
                example: {
                  message: "Connexion réussie",
                  user: {
                    _id: "6a9acadb7c875f8f46eaf5a9",
                    email: "aminata@example.com",
                    name: "Aminata",
                  },
                },
              },
            },
          },
          "401": { description: "Email ou mot de passe incorrect" },
          "403": { description: "Compte non vérifié" },
        },
      },
    },
    "/api/auth/verify-otp": {
      post: {
        tags: ["Auth"],
        summary: "Vérifier le code OTP",
        description:
          "Valide le compte avec le code reçu par email (valable 10 min)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otpCode"],
                properties: {
                  email: { type: "string", format: "email" },
                  otpCode: {
                    type: "string",
                    pattern: "^[0-9]{6}$",
                    description: "Code à 6 chiffres",
                  },
                },
              },
              example: {
                email: "aminata@example.com",
                otpCode: "123456",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Compte vérifié",
            content: {
              "application/json": {
                example: {
                  message: "Compte vérifié avec succès",
                  user: {
                    _id: "6a9acadb7c875f8f46eaf5a9",
                    email: "aminata@example.com",
                    name: "Aminata",
                    isVerified: true,
                  },
                },
              },
            },
          },
          "400": { description: "Code OTP invalide ou expiré" },
          "404": { description: "Utilisateur non trouvé" },
        },
      },
    },
    "/api/auth/resend-otp": {
      post: {
        tags: ["Auth"],
        summary: "Renvoyer le code OTP",
        description:
          "Génère un nouveau code OTP et l'envoie par email (l'ancien code est invalidé)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string", format: "email" },
                },
              },
              example: { email: "aminata@example.com" },
            },
          },
        },
        responses: {
          "200": {
            description: "Nouveau code envoyé",
            content: {
              "application/json": {
                example: {
                  message: "Nouveau code OTP envoyé. Vérifiez votre email.",
                },
              },
            },
          },
          "404": { description: "Utilisateur non trouvé" },
        },
      },
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Rafraîchir le token",
        description:
          "Utilise le refresh_token (cookie) pour générer un nouvel access_token",
        responses: {
          "200": {
            description: "Token rafraîchi",
            content: {
              "application/json": {
                example: { message: "Token rafraîchi" },
              },
            },
          },
          "401": { description: "Refresh token manquant ou invalide" },
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Déconnexion",
        description: "Supprime les cookies d'authentification",
        responses: {
          "200": {
            description: "Déconnexion réussie",
            content: {
              "application/json": {
                example: { message: "Déconnexion réussie" },
              },
            },
          },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Utilisateur connecté",
        description:
          "Retourne les informations de l'utilisateur authentifié",
        responses: {
          "200": {
            description: "Utilisateur",
            content: {
              "application/json": {
                example: {
                  user: {
                    userId: "6a9acadb7c875f8f46eaf5a9",
                    email: "aminata@example.com",
                    name: "Aminata",
                  },
                },
              },
            },
          },
          "401": { description: "Non authentifié" },
        },
      },
    },
  },
};

export function setupSwagger(app: any): void {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "TaskFlow API Docs",
    })
  );
}
