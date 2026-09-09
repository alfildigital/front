import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/config/constants';
import { mockTramitesService } from '@/mocks/services/mockTramitesService';
import type { Tramite } from '@/types';

export function useTramites() {
  return useQuery<Tramite[]>({
    queryKey: [QUERY_KEYS.tramites],
    queryFn: mockTramitesService.getAll,
  });
}
