import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { boletinService } from '@/api/services/boletinService';
import { mockBoletinService } from '@/mocks/services/mockBoletinService';
import type { BoletinPublicacion } from '@/types';

// ─── CONSUMO DE API ──────────────────────────────────────────────────────────
// Endpoint real:  GET /api/boletin-oficial   → boletinService.getAll()
// Servicio real:  src/api/services/boletinService.ts
// Servicio mock:  src/mocks/services/mockBoletinService.ts
// Selección:      config.mocks.enabled (VITE_USE_MOCKS en .env)
//
// Hooks exportados y dónde se usan:
//   useBoletin()  →  src/pages/BoletinOficial/index.tsx (listado paginado,
//                    ordenado por fecha descendente)
// ─────────────────────────────────────────────────────────────────────────────

const service = config.mocks.enabled ? mockBoletinService : boletinService;

export function useBoletin() {
  return useQuery<BoletinPublicacion[]>({
    queryKey: [QUERY_KEYS.boletin],
    queryFn: service.getAll,
  });
}
