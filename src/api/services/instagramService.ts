import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { InstagramPost } from '@/types';

export const instagramService = {
  getPosts: async (): Promise<InstagramPost[]> => {
    const { data } = await apiClient.get<ApiResponse<InstagramPost[]>>(ENDPOINTS.instagram.list);
    return data.data;
  },
};
