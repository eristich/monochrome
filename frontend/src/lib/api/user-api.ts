import { api } from '@/lib/api/client-api';
import type {
  UserType,
  CreateUserRequestType,
  LoginUserRequestType,
  LoginUserResponseType,
  ChangePasswordRequestType,
  AskPasswordRecoveryRequestType,
  ValidPasswordRecoveryRequestType,
} from '@/lib/schema/user';

const current = api<
  unknown,
  UserType
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/user/me',
});

const register = api<
  CreateUserRequestType,
  UserType
>({
  type: 'public',
  method: 'POST',
  path: '/api/v1/user/register',
});

const login = api<
  LoginUserRequestType,
  LoginUserResponseType
>({
  type: 'public',
  method: 'POST',
  path: '/api/v1/login_check',
});

const changePassword = api<
  ChangePasswordRequestType,
  UserType
>({
  type: 'private',
  method: 'POST',
  path: '/api/v1/user/change-password',
});

const askPasswordRecovery = api<
  AskPasswordRecoveryRequestType,
  unknown
>({
  type: 'public',
  method: 'POST',
  path: '/api/v1/user/request-password-recovery',
});

const validPasswordRecovery = api<
  ValidPasswordRecoveryRequestType,
  unknown
>({
  type: 'public',
  method: 'POST',
  path: '/api/v1/user/valid-password-recovery',
});

const exportData = api<
  unknown,
  unknown
>({
  type: 'private',
  method: 'GET',
  path: '/api/v1/user/export-data',
});

const remove = api<
  unknown,
  unknown
>({
  type: 'private',
  method: 'DELETE',
  path: '/api/v1/user',
});

export const userApi = {
  current,
  register,
  login,
  changePassword,
  askPasswordRecovery,
  validPasswordRecovery,
  exportData,
  remove
};
