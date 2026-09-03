// ===========================================================================
// CUSTOM HOOK: useObrasSociales
// ===========================================================================
// ARCHIVO: src/hooks/queries/useObrasSociales.ts
//
// PROPÓSITO: Abstrae toda la lógica de fetching, caché y gestión de estados
//   para el recurso "obras sociales". El componente que lo consume solo necesita
//   llamar `useObrasSociales()` y destruturar `{ data, isPending, isError, refetch }`.
//
// TECNOLOGÍA: React Query (@tanstack/react-query v5)
//   Beneficios sobre un useEffect + fetch manual:
//   - Caché automático con clave única (QUERY_KEYS.obrasSociales)
//   - Reintentos automáticos ante fallos de red (3 intentos por defecto)
//   - Estados reactivos: isPending, isError, isSuccess
//   - Función `refetch` para reintentar manualmente desde el UI
//   - Revalidación automática cuando el usuario vuelve a la pestaña (refetchOnWindowFocus)
//
// ENDPOINT REAL:  GET /api/obras-sociales
// SERVICIO REAL:  src/api/services/obrasSocialesService.ts
// SERVICIO MOCK:  src/mocks/services/mockObrasSocialesService.ts
// SELECTOR:       config.mocks.enabled (variable VITE_USE_MOCKS en .env)
//
// DÓNDE SE USA ESTE HOOK:
//   → src/pages/ObrasSociales/index.tsx  (listado completo paginado, 10 por página)
//   → src/pages/Home/index.tsx           (sección destacada, primeras 4 obras sociales)
//
// FLUJO COMPLETO DE DATOS:
//   1. Componente llama useObrasSociales()
//   2. React Query verifica si ['obras-sociales'] está en caché y es fresco
//      → En caché y fresco: retorna los datos inmediatamente (sin petición HTTP)
//      → Caché vencido o vacío: ejecuta queryFn → service.getAll()
//   3. service.getAll() hace GET /api/obras-sociales (o retorna mock)
//   4. React Query guarda el resultado en caché y notifica al componente
//   5. El componente re-renderiza con los nuevos datos
// ===========================================================================

// ORIGEN: Librería de gestión de estado del servidor ('node_modules/@tanstack/react-query')
// CÓMO FUNCIONA: `useQuery` recibe una `queryKey` (clave de caché) y una `queryFn` (función async).
//   Ejecuta la función, gestiona los estados y almacena el resultado en el caché global.
import { useQuery } from '@tanstack/react-query';

// ORIGEN: Constantes de la aplicación ('src/config/constants.ts')
// CÓMO FUNCIONA: QUERY_KEYS.obrasSociales === 'obras-sociales' (string literal).
// POR QUÉ SE HACE: Centralizar las claves de caché evita errores tipográficos y
//   facilita invalidar queries desde cualquier parte de la app (ej: después de un POST).
import { QUERY_KEYS } from '@/config/constants';

// ORIGEN: Módulo de configuración ('src/config/index.ts')
// CÓMO FUNCIONA: Lee variables de entorno VITE_* y las expone como objeto tipado.
//   config.mocks.enabled === true cuando VITE_USE_MOCKS=true en .env.
// POR QUÉ SE HACE: Desacopla el código del entorno. El mismo hook funciona en
//   desarrollo (con mocks) y en producción (con la API real) sin cambios.
import { config } from '@/config';

// ORIGEN: Servicio HTTP real ('src/api/services/obrasSocialesService.ts')
// CÓMO FUNCIONA: Ejecuta GET /api/obras-sociales vía Axios y retorna ObraSocial[].
// SE USA: cuando config.mocks.enabled === false (producción/staging)
import { obrasSocialesService } from '@/api/services/obrasSocialesService';

// ORIGEN: Servicio mock de desarrollo ('src/mocks/services/mockObrasSocialesService.ts')
// CÓMO FUNCIONA: Retorna los datos de 'src/mocks/data/obrasSociales.ts' con delay simulado.
// SE USA: cuando config.mocks.enabled === true (.env.development con VITE_USE_MOCKS=true)
import { mockObrasSocialesService } from '@/mocks/services/mockObrasSocialesService';

// ORIGEN: Tipos TypeScript ('src/types/index.ts')
// POR QUÉ SE IMPORTA: Para tipar el genérico de useQuery<ObraSocial[]>,
//   garantizando que el hook devuelva `data` correctamente tipado como ObraSocial[].
import type { ObraSocial } from '@/types';

// ─── SELECCIÓN DE SERVICIO (REAL vs MOCK) ────────────────────────────────────
// CÓMO FUNCIONA: Expresión ternaria que evalúa config.mocks.enabled en tiempo de ejecución.
//   - true  → usa mockObrasSocialesService (datos estáticos locales, sin red)
//   - false → usa obrasSocialesService (petición HTTP real al backend)
// POR QUÉ SE HACE AQUÍ: Mantiene la selección fuera del cuerpo del hook para que
//   `service` sea constante durante toda la vida del módulo (no cambia entre renders).
const service = config.mocks.enabled ? mockObrasSocialesService : obrasSocialesService;

/**
 * Hook personalizado para obtener las obras sociales adheridas.
 *
 * @returns Objeto de React Query con:
 *   - `data`:      ObraSocial[] | undefined — Array de obras sociales. `undefined` mientras carga.
 *   - `isPending`: boolean — true durante la primera carga sin caché.
 *   - `isError`:   boolean — true si la petición falló (red o API).
 *   - `refetch`:   () => void — Función para volver a ejecutar la petición manualmente.
 *
 * USO TÍPICO:
 * ```tsx
 * const { data, isPending, isError, refetch } = useObrasSociales();
 * ```
 */
export function useObrasSociales() {
  return useQuery<ObraSocial[]>({
    // CLAVE DE CACHÉ: ['obras-sociales']
    // React Query usa este array como identificador único del recurso.
    // Si otro componente llama useObrasSociales() con la misma clave,
    // recibirá los mismos datos cacheados sin hacer otra petición HTTP.
    queryKey: [QUERY_KEYS.obrasSociales],

    // FUNCIÓN DE FETCHING: Llama al método getAll() del servicio seleccionado.
    // React Query espera una función que retorne una Promise.
    // Si la Promise resuelve → data se actualiza, isPending → false.
    // Si la Promise rechaza  → isError → true, React Query reintenta hasta 3 veces.
    queryFn: service.getAll,
  });
}
