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
  estado_matricula: string;
  fecha_matriculacion: string;
  observaciones: string | null;
  usuario_abm: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfesionalesPageResponse extends ApiResponse<ProfesionalDto[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const PAGE_SIZE = 100;

const mapProfesional = (profesional: ProfesionalDto): Matriculado => ({
  id: profesional.id,
  nro_matricula: profesional.nro_matricula,
  dni: profesional.dni,
  nombre: profesional.nombre,
  apellido: profesional.apellido,
  email: profesional.email,
  telefono: profesional.telefono,
  localidad: profesional.localidad,
  direccion: profesional.direccion,
  estado_matricula: profesional.estado_matricula,
  fecha_matriculacion: profesional.fecha_matriculacion,
  observaciones: profesional.observaciones,
  usuario_abm: profesional.usuario_abm,
  created_at: profesional.created_at,
  updated_at: profesional.updated_at,
});

const normalizarMatricula = (matricula: string) => matricula.trim().toUpperCase();

/**
 * ALINEACIÓN (4.1 + 4.4):
 * El endpoint real es /api/v1/profesionales (recurso "profesionales" del backend).
 * Antes el frontend apuntaba a /users (placeholder de JSONPlaceholder) con un
 * formato de campos distinto (name/username/website). Ahora se consume el
 * backend real y se mapea su DTO al tipo de dominio Matriculado.
 */
export const matriculadosService = {
  getAll: async (): Promise<Matriculado[]> => {
    const getPage = async (page: number): Promise<ProfesionalesPageResponse> => {
      const { data } = await apiClient.get<ProfesionalesPageResponse>(
        ENDPOINTS.matriculados.list,
        { params: { page, limit: PAGE_SIZE } },
      );

      if (!data.success) {
        throw new Error(data.message ?? 'No se pudo cargar el listado de matriculados.');
      }
      if (!Array.isArray(data.data)) {
        throw new Error('La API devolvió un listado de matriculados inválido.');
      }
      if (
        !Number.isInteger(data.meta?.pages) ||
        data.meta.pages < 1 ||
        data.meta.page !== page
      ) {
        throw new Error('La API devolvió metadata de paginación inválida.');
      }

      return data;
    };

    const firstPage = await getPage(1);
    const remainingPages = await Promise.all(
      Array.from({ length: firstPage.meta.pages - 1 }, (_, index) =>
        getPage(index + 2),
      ),
    );
    const profesionales = [
      ...firstPage.data,
      ...remainingPages.flatMap((page) => page.data),
    ];

    // El backend ordena por apellido y nombre; concatenar las páginas conserva ese orden.
    return profesionales.map(mapProfesional);
  },

  getByMatricula: async (nroMatricula: string): Promise<Matriculado | null> => {
    const matriculaBuscada = normalizarMatricula(nroMatricula);
    if (!matriculaBuscada) return null;

    const { data } = await apiClient.get<ProfesionalesPageResponse>(
      ENDPOINTS.matriculados.list,
      { params: { page: 1, limit: PAGE_SIZE, q: nroMatricula.trim() } },
    );

    if (!data.success) {
      throw new Error(data.message ?? 'No se pudo buscar la matrícula.');
    }
    if (!Array.isArray(data.data)) {
      throw new Error('La API devolvió un listado de matriculados inválido.');
    }

    const profesional = data.data.find(
      (item) => normalizarMatricula(item.nro_matricula) === matriculaBuscada,
    );
    return profesional ? mapProfesional(profesional) : null;
  },

  getPagoData: async (): Promise<PagoMatriculaData> => {
    throw new Error('Not implemented yet');
  },

  getHonorarios: async (): Promise<Honorario[]> => {
    throw new Error('Not implemented yet');
  },
};
