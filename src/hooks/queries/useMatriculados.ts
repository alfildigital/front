import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { config } from '@/config';
import { matriculadosService } from '@/api/services/matriculadosService';
import { mockMatriculadosService } from '@/mocks/services/mockMatriculadosService';
import type { Matriculado, PagoMatriculaData, Honorario } from '@/types';

// ─── CONSUMO DE API ──────────────────────────────────────────────────────────
// Endpoint real:  GET /api/matriculados         → matriculadosService.getAll()
//                 GET /api/matriculados/pago    → matriculadosService.getPagoData()
//                 GET /api/honorarios           → matriculadosService.getHonorarios()
// Servicio real:  src/api/services/matriculadosService.ts
// Servicio mock:  src/mocks/services/mockMatriculadosService.ts
// Selección:      config.mocks.enabled (VITE_USE_MOCKS en .env)
//
// Hooks exportados y dónde se usan:
//   useMatriculados()  →  src/pages/Matriculados/Listado.tsx
//   usePagoMatricula() →  src/pages/Matriculados/Pago.tsx
//   useHonorarios()    →  src/pages/Matriculados/Honorarios.tsx
// ─────────────────────────────────────────────────────────────────────────────

const service = config.mocks.enabled ? mockMatriculadosService : matriculadosService;

export function useMatriculados() {
  return useQuery<Matriculado[]>({
    queryKey: [QUERY_KEYS.matriculados],
    queryFn: service.getAll,
  });
}

export function usePagoMatricula() {
  return useQuery<PagoMatriculaData>({
    queryKey: [QUERY_KEYS.pagoMatricula],
    queryFn: service.getPagoData,
    // No hacer refetch automático; el usuario inicia la acción de pago
    staleTime: 0,
    gcTime: 0,
  });
}

export function useHonorarios() {
  return useQuery<Honorario[]>({
    queryKey: [QUERY_KEYS.honorarios],
    queryFn: service.getHonorarios,
  });
}
