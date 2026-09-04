import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Noticia } from '@/types';

/**
 * DTO del backend (GET /api/v1/novedades).
 * Coincide EXACTAMENTE con lo que devuelve
 * app/Controllers/Api/NovedadesController::map().
 */
export interface NovedadDto {
  id: number;
  usuario_id: number | null;
  titulo: string;
  contenido: string;
  publicado: boolean;
  fecha_publicacion: string;
  archivo_nombre: string | null;
  archivo_contenido: string | null;
  archivo_ruta: string | null;
  archivo_tipo: string | null;
  archivo_tamano: number | null;
  autor: string | null;
  roles_nombres: string | null;
  roles: number[] | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * ALINEACIÓN (4.1 + 4.4):
 * Recurso real del backend: /api/v1/novedades (antes /noticias).
 * Los campos del tipo de dominio Noticia ya coinciden con el DTO del backend.
 */
export const noticiasService = {
  getAll: async (): Promise<Noticia[]> => {
    const { data } = await apiClient.get<ApiResponse<NovedadDto[]>>(ENDPOINTS.noticias.list);
    return data.data;
  },

  getById: async (id: number): Promise<Noticia> => {
    const { data } = await apiClient.get<ApiResponse<NovedadDto>>(ENDPOINTS.noticias.detail(id));
    return data.data;
  },
};
