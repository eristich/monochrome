import { api } from '@/lib/api/client-api';
import type {
  EditUserAdminRequestType,
  PaginatedUsersRequestType,
  ExportStatsCsvRequestType
} from '@/lib/schema/administration';
import type { UserType } from '@/lib/schema/user';

// Récupérer la liste paginée des utilisateurs
const getUsers = api<
  PaginatedUsersRequestType,
  UserType[]
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/administration/users',
});

// Modifier un utilisateur
const editUser = api<
  EditUserAdminRequestType,
  UserType
>({
  type: 'private',
  method: 'PATCH',
  path: '/api/v1/administration/user/{userId}',
});

// Exporter les stats de diffusion en CSV
const exportStatsCsv = api<
  ExportStatsCsvRequestType,
  Blob
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/administration/stats/export-csv'
});

export const administrationApi = {
  getUsers,
  editUser,
  exportStatsCsv,
};
