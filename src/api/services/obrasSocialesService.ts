// ===========================================================================
// SERVICIO REAL: OBRAS SOCIALES
// ===========================================================================
// ARCHIVO: src/api/services/obrasSocialesService.ts
//
// PROPÓSITO: Encapsula la lógica de comunicación HTTP con el backend para el
//   recurso "obras sociales". Es el único lugar de la aplicación que conoce
//   la URL exacta del endpoint y la forma del payload de respuesta.
//
// CUÁNDO SE ACTIVA: Cuando config.mocks.enabled === false (modo producción o staging).
//   El selector está en 'src/hooks/queries/useObrasSociales.ts'.
//
// ENDPOINT: GET /api/obras-sociales
//   Respuesta esperada del backend:
//   {
//     "data": ObraSocial[],   ← array de obras sociales
//     "meta": { ... }         ← metadatos opcionales (paginación, etc.)
//   }
//   → Esta forma está definida en el tipo `ApiResponse<T>` de 'src/types/api.ts'.
//
// FLUJO HTTP COMPLETO:
//   obrasSocialesService.getAll()
//     → apiClient.get('/obras-sociales')        [Axios con baseURL configurada]
//     → Axios agrega headers Content-Type y Accept automáticamente
//     → El interceptor de `client.ts` normaliza errores si el status es 4xx/5xx
//     → Se desestructura `{ data }` de la respuesta de Axios (response.data)
//     → Se retorna `data.data` que es el array ObraSocial[] del cuerpo del backend
// ===========================================================================

// ORIGEN: Instancia compartida de Axios ('src/api/client.ts')
// CÓMO FUNCIONA: Tiene configurada la `baseURL` (VITE_API_URL del .env),
//   el timeout y un interceptor que normaliza todos los errores HTTP.
import { apiClient } from '@/api/client';

// ORIGEN: Mapa centralizado de URLs ('src/api/endpoints.ts')
// CÓMO FUNCIONA: ENDPOINTS.obrasSociales.list === '/obras-sociales'
// POR QUÉ SE HACE: Evita strings duplicados en el código. Si el endpoint cambia,
//   se actualiza en un solo lugar.
import { ENDPOINTS } from '@/api/endpoints';

// ORIGEN: Tipos de respuesta de la API ('src/types/api.ts')
// CÓMO FUNCIONA: ApiResponse<T> define el wrapper genérico: { data: T, ... }
// POR QUÉ SE HACE: Tipado seguro para la respuesta del backend.
import type { ApiResponse } from '@/types/api';

// ORIGEN: Tipos de dominio ('src/types/index.ts')
// CÓMO FUNCIONA: Define la interfaz ObraSocial con todos sus campos.
// POR QUÉ SE HACE: TypeScript valida en compilación que el retorno del servicio
//   cumple la interfaz que espera la UI.
import type { ObraSocial } from '@/types';

/**
 * Servicio de obras sociales para el entorno de producción/staging.
 *
 * Implementa el mismo contrato que `mockObrasSocialesService`:
 *   { getAll: () => Promise<ObraSocial[]> }
 *
 * Esto permite que `useObrasSociales` intercambie ambos servicios sin
 * necesidad de modificar la lógica del hook o del componente.
 */
export const obrasSocialesService = {
  /**
   * Obtiene todas las obras sociales adheridas desde el backend.
   *
   * FLUJO DETALLADO:
   *   1. apiClient.get<ApiResponse<ObraSocial[]>>('/obras-sociales')
   *      → Axios construye el request con baseURL + '/obras-sociales'
   *      → Agrega headers: Content-Type: application/json, Accept: application/json
   *   2. El backend responde con { data: ObraSocial[], status: 200, ... }
   *   3. Axios desestructura la respuesta como `{ data }` (response.data = el body completo)
   *   4. Se retorna `data.data` que es el array de ObraSocial[] del payload
   *
   * @returns Promise<ObraSocial[]> — Lista completa de obras sociales.
   * @throws ApiError — Si el servidor responde con error, el interceptor de client.ts lo normaliza.
   */
  getAll: async (): Promise<ObraSocial[]> => {
    // `apiClient.get<ApiResponse<ObraSocial[]>>` tipea el retorno esperado de Axios.
    // La desestructuración `{ data }` extrae `response.data` (el body del HTTP response).
    // Luego `data.data` accede al array de ObraSocial[] dentro del wrapper ApiResponse.
    const { data } = await apiClient.get<ApiResponse<ObraSocial[]>>(ENDPOINTS.obrasSociales.list);
    return data.data;
  },
};
