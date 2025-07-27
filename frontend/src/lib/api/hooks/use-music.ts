import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { musicApi } from '../music-api';
import type {
  PaginatedMusicRequestType,
  MusicType,
  GetMusicRequestType,
  UploadMusicRequestType,
} from '@/lib/schema/music';

export function useMusicList(params: PaginatedMusicRequestType) {
  return useQuery<MusicType[]>({
    queryKey: ['music', 'list', params],
    queryFn: () => musicApi.getCollection(params),
  });
}

export function useMusic(params: GetMusicRequestType) {
  return useQuery<MusicType>({
    queryKey: ['music', 'detail', params],
    queryFn: () => musicApi.getOne(params),
    enabled: !!params.musicId,
  });
}

export function useUploadMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadMusicRequestType) => musicApi.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music', 'list'] });
    },
  });
}

export function useRemoveMusic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: musicApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music', 'list'] });
    },
  });
}

export function useEditMusic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: musicApi.edit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['music', 'list'] });
    },
  });
}

export function useRandomMusic() {
  return useQuery<Blob>({
    queryKey: ['music', 'random'],
    queryFn: () => musicApi.getRandom(undefined),
  });
}
