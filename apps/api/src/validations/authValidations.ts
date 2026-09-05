// apps/api/src/validations/authValidations.ts
import { z } from "zod";

// Pour Zod v4 : required via .min(1) + message d'erreur explicite

export const registerSchema = z.object({
  email: z
    .string({ error: "L'email est requis" })
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string({ error: "Le mot de passe est requis" })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  name: z
    .string({ error: "Le nom est requis" })
    .min(2, "Le nom doit contenir au moins 2 caractères"),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "L'email est requis" })
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string({ error: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis"),
});

// Types inférés pour TypeScript
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
