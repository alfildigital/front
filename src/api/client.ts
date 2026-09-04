import axios, { AxiosError } from 'axios';
import { config } from '@/config';
import type { ApiError } from '@/types/api';

/**
 * Instancia de Axios compartida por todos los servicios.
 *
 * Responsabilidades:
 * - baseURL y timeout centralizados
 * - headers comunes (incluida la autenticación Bearer)
 * - normalización de errores
 * - logging en desarrollo
 *
 * AUTENTICACIÓN (4.2):
 * El backend (cpee) protege TODA su API REST bajo /api/v1 con un token Bearer.
 * Se exige el header "Authorization: Bearer <API_API_KEY>" en cada petición,
 * validado por ApiController::requireAuth(). La clave se lee desde el .env
 * (VITE_APP_API_KEY) vía config.api.apiKey y se inyecta de forma global aquí,
 * de modo que TODOS los servicios la envían sin repetir código.
 *
 * NOTA DE SEGURIDAD: al ser una SPA pública, la clave queda visible en el bundle.
 * Si en el futuro se restringen recursos de lectura pública, conviene mover la
 * autenticación a un proxy inverso / BFF en el servidor.
 */
const apiClient = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${config.api.apiKey}`,
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
