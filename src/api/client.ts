import axios, { AxiosError } from 'axios';
import { config } from '@/config';
import type { ApiError } from '@/types/api';

/**
 * Instancia de Axios compartida por todos los servicios.
 *
 * Responsabilidades:
 * - baseURL y timeout centralizados
 * - headers comunes
 * - normalización de errores
 * - logging en desarrollo
 *
 * NOTA: No contiene lógica de autenticación.
 * Si en una fase futura se agrega un panel administrativo,
 * se podrá agregar un interceptor de request con JWT aquí.
 */
const apiClient = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Interceptor de respuesta — normalización de errores
// ---------------------------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'Error desconocido',
      status: null,
    };

    if (error.response) {
      // El servidor respondió con un código de error
      apiError.status = error.response.status;

      const responseData = error.response.data as Record<string, unknown>;
      apiError.message =
        typeof responseData?.message === 'string'
          ? responseData.message
          : `Error del servidor (${error.response.status})`;
    } else if (error.request) {
      // La petición se realizó pero no hubo respuesta
      apiError.message = 'No se pudo conectar con el servidor. Verificá tu conexión.';
      apiError.code = 'NETWORK_ERROR';
    }

    if (config.logs.enabled) {
      console.error('[API Error]', apiError, error);
    }

    return Promise.reject(apiError);
  },
);

export { apiClient };
