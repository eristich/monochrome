import { z } from 'zod';

// Schéma de base pour les rôles utilisateur
export const UserRolesSchema = z.array(
  z.enum(['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN'], { message: 'Le rôle est invalide' })
);

// Schéma pour la création d'un utilisateur (User4)
export const CreateUserRequestSchema = z.object({
  name: z.string().min(3, { message: 'Le nom doit contenir au moins 3 caractères' }).max(30, { message: 'Le nom ne doit pas dépasser 30 caractères' }),
  email: z.string().email({ message: 'L\'adresse e-mail est invalide' }),
  password: z.string().min(3, { message: 'Le mot de passe doit contenir au moins 3 caractères' }).max(80, { message: 'Le mot de passe ne doit pas dépasser 80 caractères' }),
});

// Schéma pour la connexion d'un utilisateur (User1)
export const LoginUserRequestSchema = z.object({
  email: z.string().email({ message: 'L\'adresse e-mail est invalide' }),
  password: z.string().min(3, { message: 'Le mot de passe doit contenir au moins 3 caractères' }).max(80, { message: 'Le mot de passe ne doit pas dépasser 80 caractères' }),
});

export const LoginUserResponseSchema = z.object({
  token: z.string(),
});

// Schéma pour la demande de récupération de mot de passe (User5)
export const AskPasswordRecoveryRequestSchema = z.object({
  email: z.string().email({ message: 'L\'adresse e-mail est invalide' }),
});

// Schéma pour la validation de récupération de mot de passe
export const ValidPasswordRecoveryRequestSchema = z.object({
  code: z.string().length(5, { message: 'Le code de récupération doit contenir 5 caractères' }),
  password: z.string().min(3, { message: 'Le mot de passe doit contenir au moins 3 caractères' }).max(80, { message: 'Le mot de passe ne doit pas dépasser 80 caractères' }),
  email: z.string().email({ message: 'L\'adresse e-mail est invalide' }),
});

// Schéma pour le changement de mot de passe
export const ChangePasswordRequestSchema = z.object({
  password: z.string().min(3, { message: 'Le mot de passe doit contenir au moins 3 caractères' }).max(80, { message: 'Le mot de passe ne doit pas dépasser 80 caractères' }),
  newPassword: z.string().min(3, { message: 'Le nouveau mot de passe doit contenir au moins 3 caractères' }).max(80, { message: 'Le nouveau mot de passe ne doit pas dépasser 80 caractères' }),
});

// Schéma pour l'édition d'un utilisateur (User)
export const EditUserRequestSchema = z.object({
  roles: UserRolesSchema,
  isBanned: z.boolean(),
  isUploadEnable: z.boolean(),
});

// Schéma pour un utilisateur simplifié (User6, User7)
export const SimpleUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// Schéma pour un utilisateur complet (User2, User3)
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  roles: UserRolesSchema,
  recoveryCodeExpiration: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  lastLoginAt: z.string().datetime().nullable(),
  isBanned: z.boolean().nullable(),
  isUploadEnable: z.boolean(),
  lastActivityAt: z.string().datetime().nullable(),
});

export type CreateUserRequestType = z.infer<typeof CreateUserRequestSchema>;
export type LoginUserRequestType = z.infer<typeof LoginUserRequestSchema>;
export type LoginUserResponseType = z.infer<typeof LoginUserResponseSchema>;
export type AskPasswordRecoveryRequestType = z.infer<typeof AskPasswordRecoveryRequestSchema>;
export type ValidPasswordRecoveryRequestType = z.infer<typeof ValidPasswordRecoveryRequestSchema>;
export type ChangePasswordRequestType = z.infer<typeof ChangePasswordRequestSchema>;
export type EditUserRequestType = z.infer<typeof EditUserRequestSchema>;
export type SimpleUserType = z.infer<typeof SimpleUserSchema>;
export type UserType = z.infer<typeof UserSchema>;
