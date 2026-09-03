// ===========================================================================
// MOCK SERVICE: OBRAS SOCIALES
// ===========================================================================
// ARCHIVO: src/mocks/services/mockObrasSocialesService.ts
//
// PROPÓSITO: Implementa el mismo contrato de interfaz que `obrasSocialesService`
//   (la versión real), pero en lugar de hacer una petición HTTP al backend,
//   devuelve los datos estáticos de 'src/mocks/data/obrasSociales.ts' con
//   un retraso artificial que simula la latencia de red.
//
// CUÁNDO SE ACTIVA: Cuando config.mocks.enabled === true.
//   Esto se controla con la variable VITE_USE_MOCKS=true en el archivo .env.development.
//   El selector está en 'src/hooks/queries/useObrasSociales.ts'.
//
// CONTRATO: Debe exportar un objeto con el mismo shape que `obrasSocialesService`:
//   { getAll: () => Promise<ObraSocial[]> }
//   Esto garantiza que el hook puede intercambiar ambos servicios sin modificar su lógica.
//
// POR QUÉ SE USA DELAY: Simula la latencia de una llamada HTTP real para que los
//   estados de carga (skeleton, error) sean visibles y testeables en desarrollo.
// ===========================================================================

// ORIGEN: Datos estáticos de obras sociales de prueba ('src/mocks/data/obrasSociales.ts')
// CÓMO FUNCIONA: Array de ObraSocial[] con 12 entradas que cubren todos los casos
//   de renderizado posibles (con logo, sin contacto, con todos los campos, etc.).
import { mockObrasSociales } from '@/mocks/data/obrasSociales';

// ORIGEN: Definición de tipos TypeScript ('src/types/index.ts')
// POR QUÉ SE IMPORTA: Para que la función `getAll` devuelva el tipo correcto
//   y TypeScript valide que los datos mock cumplen la interfaz ObraSocial.
import type { ObraSocial } from '@/types';

/**
 * Helper de delay asíncrono.
 * CÓMO FUNCIONA: Crea una promesa que resuelve después de `ms` milisegundos.
 *   Se usa con `await` antes de retornar los datos para simular latencia de red.
 * @param ms - Milisegundos a esperar (600ms replica una latencia de red moderada)
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Servicio mock para obras sociales.
 *
 * Implementa el mismo contrato que `obrasSocialesService` real:
 *   { getAll: () => Promise<ObraSocial[]> }
 *
 * FLUJO:
 *   1. useObrasSociales() (hook) selecciona este servicio cuando mocks están activos.
 *   2. React Query llama a `mockObrasSocialesService.getAll()`.
 *   3. El delay de 600ms mantiene visible el estado de skeleton en la UI.
 *   4. Retorna mockObrasSociales[] → React Query lo guarda en caché con key ['obras-sociales'].
 *   5. La página recibe los datos y renderiza la grilla de tarjetas.
 */
export const mockObrasSocialesService = {
  /**
   * Retorna todas las obras sociales mock después de un delay simulado.
   * @returns Promise<ObraSocial[]> — Array de obras sociales para poblar la grilla.
   */
  getAll: async (): Promise<ObraSocial[]> => {
    // Simula la latencia de una llamada HTTP real (600ms ≈ conexión moderada).
    // Sin este delay, el skeleton de carga no sería visible en desarrollo.
    await delay(600);
    return mockObrasSociales;
  },
};
