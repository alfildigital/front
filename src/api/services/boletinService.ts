import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { BoletinPublicacion } from '@/types';

export const boletinService = {
  getAll: async (): Promise<BoletinPublicacion[]> => {
    const { data } = await apiClient.get<ApiResponse<BoletinPublicacion[]>>(ENDPOINTS.boletin.list);
    return data.data;
  },
};
