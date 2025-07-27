import { api } from '@/lib/api/client-api';
import type {
  PaginatedMusicRequestType,
  EditMusicRequestType,
  RemoveMusicRequestType,
  GetMusicRequestType,
  UploadMusicRequestType,
  MusicType
} from '@/lib/schema/music';

// Récupérer la collection de musiques
const getCollection = api<
  PaginatedMusicRequestType,
  MusicType[]
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/music',
});

// Récupérer une musique par son id
const getOne = api<
  GetMusicRequestType,
  MusicType
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/music/{musicId}',
});

// Upload d'une musique
const upload = api<
  UploadMusicRequestType,
  MusicType
>({
  type: 'private',
  method: 'POST',
  path: '/api/v1/music/upload',
  multipart: true,
});

// Supprimer une musique
const remove = api<
  RemoveMusicRequestType,
  void
>({
  type: 'private',
  method: 'DELETE',
  path: '/api/v1/music/{musicId}',
});

// Modifier une musique
const edit = api<
  EditMusicRequestType,
  MusicType
>({
  type: 'private',
  method: 'PATCH',
  path: '/api/v1/music/{musicId}',
});

// Récupérer une musique aléatoire (fichier audio)
const getRandom = api<
  unknown,
  Blob
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/music/select',
});

export const musicApi = {
  getCollection,
  getOne,
  upload,
  remove,
  edit,
  getRandom,
};
