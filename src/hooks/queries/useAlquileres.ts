import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { alquileresService } from '@/api/services/alquileresService';
import { mockAlquileresService } from '@/mocks/services/mockAlquileresService';
import type { Alquiler } from '@/types';

// ─── CONSUMO DE API ──────────────────────────────────────────────────────────
// Endpoint real:  GET /api/alquileres   → alquileresService.getAll()
// Servicio real:  src/api/services/alquileresService.ts
// Servicio mock:  src/mocks/services/mockAlquileresService.ts
// Selección:      config.mocks.enabled (VITE_USE_MOCKS en .env)
//
// Hooks exportados y dónde se usan:
//   useAlquileres()  →  src/pages/Alquileres/index.tsx (listado con paginación)
// ─────────────────────────────────────────────────────────────────────────────

const service = config.mocks.enabled ? mockAlquileresService : alquileresService;

export function useAlquileres() {
  return useQuery<Alquiler[]>({
    queryKey: [QUERY_KEYS.alquileres],
    queryFn: service.getAll,
  });
}
