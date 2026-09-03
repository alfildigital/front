import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Tramite } from '@/types';

export const tramitesService = {
  getAll: async (): Promise<Tramite[]> => {
    const { data } = await apiClient.get<ApiResponse<Tramite[]>>(ENDPOINTS.tramites.list);
    return data.data;
  },
};
