import { z } from 'zod';
import { EditUserRequestSchema } from './user';

// Requête pour éditer un utilisateur (PATCH)
export const EditUserAdminRequestSchema = EditUserRequestSchema.extend({
  userId: z.string().uuid(),
});

const isoDate = z.string().refine(
  (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
  { message: 'La date doit être au format AAAA-MM-JJ' }
);

export const ExportStatsCsvRequestSchema = z.object({
  startDate: isoDate,
  endDate: isoDate,
});

export const PaginatedUsersRequestSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type EditUserAdminRequestType = z.infer<typeof EditUserAdminRequestSchema>;
export type ExportStatsCsvRequestType = z.infer<typeof ExportStatsCsvRequestSchema>;
export type PaginatedUsersRequestType = z.infer<typeof PaginatedUsersRequestSchema>;
