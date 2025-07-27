import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps avant que les données soient considérées comme périmées
      staleTime: 5 * 60 * 1000, // 5 minutes par défaut

      // Temps de cache des données
      gcTime: 10 * 60 * 1000, // 10 minutes par défaut

      // Nombre de tentatives en cas d'échec
      retry: (failureCount, error) => {
        // Ne pas réessayer pour les erreurs 4xx (sauf 408, 429)
        if (error instanceof Error && error.message.includes('HTTP error! status:')) {
          const status = parseInt(error.message.match(/status: (\d+)/)?.[1] || '0');
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return false;
          }
        }

        // Maximum 3 tentatives
        return failureCount < 3;
      },

      // Délai entre les tentatives (backoff exponentiel)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch automatique quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,

      // Refetch automatique quand la connexion reprend
      refetchOnReconnect: true,
    },
    mutations: {
      // Nombre de tentatives pour les mutations
      retry: 0,
      // retry: 1,

      // Délai entre les tentatives pour les mutations
      retryDelay: 1000,
    },
  },
});
