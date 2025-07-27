import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/lib/api/user-api';
import type {
  CreateUserRequestType,
  ChangePasswordRequestType,
  AskPasswordRecoveryRequestType,
  ValidPasswordRecoveryRequestType,
  LoginUserRequestType,
} from '@/lib/schema/user';

// Clés de cache pour les requêtes utilisateur
export const userKeys = {
  all: ['user'] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

// Hook pour récupérer l'utilisateur connecté
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: () => userApi.current({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginData: LoginUserRequestType) => userApi.login(loginData),
    onSuccess: () => {
      // Invalider le cache de l'utilisateur courant après changement de mot de passe
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
};

// Hook pour l'inscription
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequestType) => userApi.register(userData),
    onSuccess: () => {
      // Invalider le cache de l'utilisateur courant après inscription
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
};

// Hook pour le changement de mot de passe
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (passwordData: ChangePasswordRequestType) => userApi.changePassword(passwordData),
    onSuccess: () => {
      // Invalider le cache de l'utilisateur courant après changement de mot de passe
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
    },
  });
};

// Hook pour la demande de récupération de mot de passe
export const useRequestPasswordRecovery = () => {
  return useMutation({
    mutationFn: (recoveryData: AskPasswordRecoveryRequestType) => userApi.askPasswordRecovery(recoveryData),
  });
};

// Hook pour la validation de récupération de mot de passe
export const useValidPasswordRecovery = () => {
  return useMutation({
    mutationFn: (validData: ValidPasswordRecoveryRequestType) => userApi.validPasswordRecovery(validData),
  });
};

// Hook pour l'export des données
export const useExportData = () => {
  return useMutation({
    mutationFn: () => userApi.exportData({}),
  });
};

// Hook pour la suppression du compte
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userApi.remove({}),
    onSuccess: () => {
      // Nettoyer le cache après suppression du compte
      queryClient.clear();
    },
  });
};
