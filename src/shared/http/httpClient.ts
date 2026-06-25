import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

/**
 * Cliente HTTP central (adaptador de red).
 * Toda la app habla con APIs externas a traves de aqui: un solo lugar
 * para baseURL, headers, token de auth y manejo de errores.
 */
export interface HttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export function createHttpClient(baseURL: string, defaultHeaders: Record<string, string> = {}): HttpClient {
  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json', ...defaultHeaders },
  });

  // Inyecta el token guardado (si existe) en cada peticion.
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    async get<T>(url: string, config?: AxiosRequestConfig) {
      const { data } = await instance.get<T>(url, config);
      return data;
    },
    async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
      const { data } = await instance.post<T>(url, body, config);
      return data;
    },
    async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig) {
      const { data } = await instance.put<T>(url, body, config);
      return data;
    },
    async delete<T>(url: string, config?: AxiosRequestConfig) {
      const { data } = await instance.delete<T>(url, config);
      return data;
    },
  };
}
