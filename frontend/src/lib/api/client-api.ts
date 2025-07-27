import {
  instance,
  instanceWithoutInterceptors
} from '@/lib/api/axios';
import {
  type AxiosRequestConfig,
  type Method,
} from 'axios';

// Utilitaire pour injecter les paramètres du path
function injectPathParams(path: string, params: Record<string, unknown>): { url: string, rest: Record<string, unknown> } {
  const rest: Record<string, unknown> = { ...params };
  const url = path.replace(/\{(\w+)\}/g, (_, key) => {
    if (rest[key] === undefined) throw new Error(`Missing param: ${key}`);
    const value = rest[key];
    delete rest[key];
    return encodeURIComponent(String(value));
  });
  return { url, rest };
}

type APICallPayload = {
  method: Method;
  path: string;
  type?: 'private' | 'public';
  multipart?: boolean;
};

export function api<Request = Record<string, unknown>, Response = unknown>({
  type = 'private',
  method,
  path,
  multipart = false,
}: APICallPayload) {
  return async (requestData: Request) => {
    let url = path;
    let data: unknown = null;
    const headers: Record<string, string> = {};
    let rest: Record<string, unknown> = {};

    if (requestData && typeof requestData === 'object') {
      // Injecte les paramètres du path et récupère le reste
      const injected = injectPathParams(path, requestData as Record<string, unknown>);
      url = injected.url;
      rest = injected.rest;
    }

    if (method === 'GET' || method === 'DELETE') {
      if (Object.keys(rest).length > 0) {
        url += `?${new URLSearchParams(rest as Record<string, string>).toString()}`;
      }
    } else if (multipart) {
      data = new FormData();
      Object.entries(rest).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => (data as FormData).append(key, v));
        } else if (value !== undefined) {
          (data as FormData).append(key, value as Blob | string);
        }
      });
      // Axios gère le header Content-Type automatiquement pour FormData
    } else if (Object.keys(rest).length > 0) {
      data = rest;
      headers['Content-Type'] = 'application/json';
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      headers
    };

    const response =
      type === 'private'
        ? await instance(config)
        : await instanceWithoutInterceptors(config);

    return response.data as Response;
  };
}
