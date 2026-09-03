import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { tramitesService } from '@/api/services/tramitesService';
import { mockTramitesService } from '@/mocks/services/mockTramitesService';
import type { Tramite } from '@/types';

// ─── CONSUMO DE API ──────────────────────────────────────────────────────────
// Endpoint real:  GET /api/tramites   → tramitesService.getAll()
// Servicio real:  src/api/services/tramitesService.ts
// Servicio mock:  src/mocks/services/mockTramitesService.ts
// Selección:      config.mocks.enabled (VITE_USE_MOCKS en .env)
//
// Hooks exportados y dónde se usan:
//   useTramites()  →  src/pages/Home/index.tsx (sección destacada, primeros 4)
//                     src/pages/Tramites/index.tsx (listado completo)
// ─────────────────────────────────────────────────────────────────────────────

const service = config.mocks.enabled ? mockTramitesService : tramitesService;

export function useTramites() {
  return useQuery<Tramite[]>({
    queryKey: [QUERY_KEYS.tramites],
    queryFn: service.getAll,
  });
}
