import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { administrationApi } from '../administration-api';
import type {
  PaginatedUsersRequestType,
} from '@/lib/schema/administration';
import type { UserType } from '@/lib/schema/user';

export function useUserList(params: PaginatedUsersRequestType) {
  return useQuery<UserType[]>({
    queryKey: ['admin', 'users', params],
    queryFn: () => administrationApi.getUsers(params),
  });
}

export function useEditUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: administrationApi.editUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// export function useExportStatsCsv(params: ExportStatsCsvRequestType) {
//   return useQuery<Blob>({
//     queryKey: ['admin', 'export-csv', params],
//     queryFn: () => administrationApi.exportStatsCsv(params),
//   });
// }

export function useExportStatsCsv() {

  return useMutation({
    mutationFn: administrationApi.exportStatsCsv,
  });
}
