/**
 * Tipos base para respuestas de la API PHP.
 * Todos los servicios deben utilizar estas estructuras.
 */

/** Respuesta estándar de la API */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** Respuesta paginada */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

/** Error normalizado del interceptor de Axios */
export interface ApiError {
  message: string;
  status: number | null;
  code?: string;
}
