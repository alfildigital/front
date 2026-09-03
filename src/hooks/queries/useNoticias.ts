import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { noticiasService } from '@/api/services/noticiasService';
import { mockNoticiasService } from '@/mocks/services/mockNoticiasService';
import type { Noticia } from '@/types';

// ─── CONSUMO DE API ──────────────────────────────────────────────────────────
// Endpoint real:  GET /api/noticias       → noticiasService.getAll()
//                 GET /api/noticias/:id   → noticiasService.getById(id)
// Servicio real:  src/api/services/noticiasService.ts
// Servicio mock:  src/mocks/services/mockNoticiasService.ts
// Selección:      config.mocks.enabled (VITE_USE_MOCKS en .env)
//
// Hooks exportados y dónde se usan:
//   useNoticias()       →  src/pages/Home/index.tsx (preview de 3 noticias)
//                          src/pages/Noticias/index.tsx (listado completo)
//   useNoticia(id)      →  src/pages/Noticias/NoticiaDetalle.tsx
// ─────────────────────────────────────────────────────────────────────────────

const service = config.mocks.enabled ? mockNoticiasService : noticiasService;

export function useNoticias() {
  return useQuery<Noticia[]>({
    queryKey: [QUERY_KEYS.noticias],
    queryFn: service.getAll,
  });
}

export function useNoticia(id: number) {
  return useQuery<Noticia>({
    queryKey: [QUERY_KEYS.noticia, id],
    queryFn: () => service.getById(id),
    enabled: id > 0,
  });
}
