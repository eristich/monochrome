import { z } from 'zod';
import { SimpleUserSchema } from './user';

export const UploadMusicRequestSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Le fichier est requis',
    })
    .refine((file) => file.size <= 25 * 1024 * 1024, {
      message: 'Le fichier est trop volumineux (max 25 Mo)',
    })
    .refine((file) => ['audio/mpeg', 'audio/mp3'].includes(file.type), {
      message: 'Le fichier doit être au format MP3',
    }),
});

export const EditMusicRequestSchema = z.object({
  name: z.string().min(1, { message: 'Le nom est requis' }),
  artist: z.string().nullable(),
});

export const PaginatedMusicRequestSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  order: z.string().optional(),
});

export const MusicSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  owner: SimpleUserSchema.nullable(),
  artist: z.string().nullable(),
  originalFilename: z.string(),
  updatedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export const RemoveMusicRequestSchema = z.object({
  musicId: z.string().uuid(),
});

export const GetMusicRequestSchema = z.object({
  musicId: z.string().uuid(),
});

export type PaginatedMusicRequestType = z.infer<typeof PaginatedMusicRequestSchema>;
export type EditMusicRequestType = z.infer<typeof EditMusicRequestSchema>;
export type MusicType = z.infer<typeof MusicSchema>;
export type RemoveMusicRequestType = z.infer<typeof RemoveMusicRequestSchema>;
export type GetMusicRequestType = z.infer<typeof GetMusicRequestSchema>;
export type UploadMusicRequestType = z.infer<typeof UploadMusicRequestSchema>;
