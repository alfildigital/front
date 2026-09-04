import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { Matriculado, PagoMatriculaData, Honorario } from '@/types';

/**
 * DTO del backend (GET /api/v1/profesionales).
 * Los campos coinciden EXACTAMENTE con lo que devuelve
 * app/Controllers/Api/ProfesionalesController::map().
 */
export interface ProfesionalDto {
  id: number;
  nro_matricula: string;
  dni: string | null;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  localidad: string | null;
  direccion: string | null;
  estado: string;
  fecha_matriculacion: string;
  observaciones: string | null;
  foto: string | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * ALINEACIÓN (4.1 + 4.4):
 * El endpoint real es /api/v1/profesionales (recurso "profesionales" del backend).
 * Antes el frontend apuntaba a /users (placeholder de JSONPlaceholder) con un
 * formato de campos distinto (name/username/website). Ahora se consume el
 * backend real y se mapea su DTO al tipo de dominio Matriculado.
 */
export const matriculadosService = {
  getAll: async (): Promise<Matriculado[]> => {
    const { data } = await apiClient.get<ApiResponse<ProfesionalDto[]>>(
      ENDPOINTS.matriculados.list,
    );

    // El backend devuelve el DTO dentro del wrapper { data: [...] }.
    // Mapeamos cada DTO al tipo de dominio Matriculado (mismos nombres de campo).
    return data.data.map((p) => ({
      id: p.id,
      nro_matricula: p.nro_matricula,
      dni: p.dni,
      nombre: p.nombre,
      apellido: p.apellido,
      email: p.email,
      telefono: p.telefono,
      localidad: p.localidad,
      direccion: p.direccion,
      estado: p.estado,
      fecha_matriculacion: p.fecha_matriculacion,
      observaciones: p.observaciones,
      foto: p.foto,
      usuario_abm: p.usuario_abm,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));
  },

  getPagoData: async (): Promise<PagoMatriculaData> => {
    throw new Error('Not implemented yet');
  },

  getHonorarios: async (): Promise<Honorario[]> => {
    throw new Error('Not implemented yet');
  },
};
