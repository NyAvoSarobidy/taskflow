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
    { name: "Organizations", description: "Gestion des organisations" },
    { name: "Projects", description: "Gestion des projets" },
    { name: "Tasks", description: "Gestion des tâches" },
    { name: "Billing", description: "Abonnements et facturation" },
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
    "/api/organizations": {
      get: {
        tags: ["Organizations"],
        summary: "Lister mes organisations",
        description:
          "Retourne les organisations auxquelles l'utilisateur appartient",
        responses: {
          "200": {
            description: "Liste des organisations",
            content: {
              "application/json": {
                example: {
                  organizations: [
                    {
                      organizationId: "6a9acadb7c875f8f46eaf5a9",
                      name: "Aminata's Organization",
                      role: "admin",
                      createdAt: "2026-09-04T13:38:17.705Z",
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/organizations/{organizationId}": {
      get: {
        tags: ["Organizations"],
        summary: "Obtenir une organisation",
        parameters: [
          {
            name: "organizationId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Organisation" },
          "404": { description: "Non trouvée" },
        },
      },
    },
    "/api/projects": {
      post: {
        tags: ["Projects"],
        summary: "Créer un projet",
        description: "Crée un projet dans l'organisation spécifiée",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "organizationId", in: "query", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: { name: { type: "string" } },
              },
              example: { name: "Lancement produit" },
            },
          },
        },
        responses: {
          "201": { description: "Projet créé" },
          "403": { description: "Limite de plan atteinte" },
        },
      },
      get: {
        tags: ["Projects"],
        summary: "Lister les projets d'une organisation",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Liste des projets" },
        },
      },
    },
    "/api/projects/{projectId}": {
      get: {
        tags: ["Projects"],
        summary: "Obtenir un projet",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Projet" },
          "404": { description: "Non trouvé" },
        },
      },
      put: {
        tags: ["Projects"],
        summary: "Modifier un projet",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { name: { type: "string" } },
              },
            },
          },
        },
        responses: {
          "200": { description: "Projet mis à jour" },
          "404": { description: "Non trouvé" },
        },
      },
      delete: {
        tags: ["Projects"],
        summary: "Supprimer un projet",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Projet supprimé" },
          "404": { description: "Non trouvé" },
        },
      },
    },
    "/api/tasks/my-tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Mes tâches assignées",
        description:
          "Retourne les tâches assignées à l'utilisateur connecté dans l'organisation spécifiée",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Tâches assignées à l'utilisateur connecté" },
        },
      },
    },
    "/api/tasks/projects/{projectId}/tasks": {
      post: {
        tags: ["Tasks"],
        summary: "Créer une tâche",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  assignedTo: { type: "string" },
                  dueDate: { type: "string", format: "date-time" },
                },
              },
              example: {
                title: "Finaliser le design",
                description: "Maquettes Figma",
                dueDate: "2026-09-10T00:00:00Z",
              },
            },
          },
        },
        responses: { "201": { description: "Tâche créée" } },
      },
      get: {
        tags: ["Tasks"],
        summary: "Lister les tâches d'un projet",
        security: [{ cookieAuth: [] }],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "organizationId",
            in: "query",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Liste des tâches" } },
      },
    },
    "/api/tasks/projects/{projectId}/tasks/{taskId}": {
      get: {
        tags: ["Tasks"],
        summary: "Obtenir une tâche",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
          { name: "taskId", in: "path", required: true, schema: { type: "string" } },
          { name: "organizationId", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Tâche" }, "404": { description: "Non trouvée" } },
      },
      put: {
        tags: ["Tasks"],
        summary: "Modifier une tâche",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
          { name: "taskId", in: "path", required: true, schema: { type: "string" } },
          { name: "organizationId", in: "query", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  assignedTo: { type: "string" },
                  status: { type: "string", enum: ["a_faire", "en_cours", "termine"] },
                  dueDate: { type: "string", format: "date-time" },
                },
              },
              example: { status: "en_cours" },
            },
          },
        },
        responses: { "200": { description: "Tâche mise à jour" }, "404": { description: "Non trouvée" } },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Supprimer une tâche",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "projectId", in: "path", required: true, schema: { type: "string" } },
          { name: "taskId", in: "path", required: true, schema: { type: "string" } },
          { name: "organizationId", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "Tâche supprimée" }, "404": { description: "Non trouvée" } },
      },
    },
    "/api/billing/checkout": {
      post: {
        tags: ["Billing"],
        summary: "Créer une session de paiement",
        description: "Redirige vers Stripe Checkout pour souscrire un abonnement",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "organizationId", in: "query", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", required: ["plan"], properties: { plan: { type: "string", enum: ["free", "pro"] } } }, example: { plan: "pro" } } } },
        responses: { "200": { description: "Session créée" } },
      },
    },
    "/api/billing/portal": {
      post: {
        tags: ["Billing"],
        summary: "Portail de gestion",
        description: "Redirige vers le portail Stripe pour gérer l'abonnement",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "organizationId", in: "query", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "URL du portail" } },
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
