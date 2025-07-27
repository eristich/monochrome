// import { useUserStore } from "@/store/user-store";
import axios, {
  type AxiosError,
  type CreateAxiosDefaults,
} from 'axios';
import { useAuthStore } from '@/store/auth-store';

const baseConfig: CreateAxiosDefaults = {
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  withCredentials: true,
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
};

export const instanceWithoutInterceptors = axios.create(baseConfig);

export const instance = axios.create(baseConfig);

instance.interceptors.request.use(
  function (config) {
    const accessToken = useAuthStore.getState().token;
    // console.log('accessToken : ', accessToken);
    // const accessToken = 'fake-token';

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    // Si une erreur 401 est détectée, on déconnecte l'utilisateur et on le redirige vers /auth/login
    if (error.response?.status === 401) {
      // useUserStore.getState().removeCredentials();
      // window.location.href = '/auth/login';
      console.warn('Erreur HTTP 401, le client est invité à se reconnecter dans /app/auth/login');
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
