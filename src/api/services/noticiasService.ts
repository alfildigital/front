import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Noticia } from '@/types';

export const noticiasService = {
  getAll: async (): Promise<Noticia[]> => {
    const { data } = await apiClient.get<ApiResponse<Noticia[]>>(ENDPOINTS.noticias.list);
    return data.data;
  },

  getById: async (id: number): Promise<Noticia> => {
    const { data } = await apiClient.get<ApiResponse<Noticia>>(ENDPOINTS.noticias.detail(id));
    return data.data;
  },
};
