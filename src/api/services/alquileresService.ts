import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Alquiler } from '@/types';

export const alquileresService = {
  getAll: async (): Promise<Alquiler[]> => {
    const { data } = await apiClient.get<ApiResponse<Alquiler[]>>(ENDPOINTS.alquileres.list);
    return data.data;
  },
};
