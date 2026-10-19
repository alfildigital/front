import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { matriculadosService } from '@/api/services/matriculadosService';
import type { Matriculado, PagoMatriculaData, Honorario } from '@/types';

// El listado siempre usa la API real: GET {VITE_API_URL}/profesionales.
// VITE_USE_MOCKS no se aplica a este módulo.

export function useMatriculados() {
  return useQuery<Matriculado[]>({
    queryKey: [QUERY_KEYS.matriculados],
    queryFn: matriculadosService.getAll,
  });
}

export function usePagoMatricula() {
  return useQuery<PagoMatriculaData>({
    queryKey: [QUERY_KEYS.pagoMatricula],
    queryFn: matriculadosService.getPagoData,
    // No hacer refetch automático; el usuario inicia la acción de pago
    staleTime: 0,
    gcTime: 0,
  });
}

export function useHonorarios() {
  return useQuery<Honorario[]>({
    queryKey: [QUERY_KEYS.honorarios],
    queryFn: matriculadosService.getHonorarios,
  });
}
