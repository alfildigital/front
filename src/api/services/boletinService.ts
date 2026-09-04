import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { BoletinPublicacion } from '@/types';

/**
 * DTO del backend (GET /api/v1/boletines-oficiales).
 * Coincide EXACTAMENTE con lo que devuelve
 * app/Controllers/Api/BoletinesOficialesController::map().
 */
export interface BoletinDto {
  id: number;
  titulo: string;
  resumen: string | null;
  archivo_nombre: string | null;
  archivo_ruta: string | null;
  archivo_tipo: string | null;
  archivo_tamano: number | null;
  archivo_contenido: string | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * ALINEACIÓN (4.1 + 4.4):
 * Recurso real del backend: /api/v1/boletines-oficiales (antes /boletin-oficial).
 * Los campos del tipo de dominio BoletinPublicacion ya coinciden con el DTO.
 */
export const boletinService = {
  getAll: async (): Promise<BoletinPublicacion[]> => {
    const { data } = await apiClient.get<ApiResponse<BoletinDto[]>>(ENDPOINTS.boletin.list);
    return data.data;
  },
};
