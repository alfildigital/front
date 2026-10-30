import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { matriculadosService, type ProfesionalDto } from '@/api/services/matriculadosService';

vi.mock('@/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const profesional = (id: number): ProfesionalDto => ({
  id,
  nro_matricula: `MP-${id}`,
  dni: null,
  nombre: `Nombre ${id}`,
  apellido: `Apellido ${id}`,
  email: null,
  telefono: null,
  localidad: null,
  direccion: null,
  estado_matricula: 'Activa',
  fecha_matriculacion: '2020-01-01',
  observaciones: null,
  usuario_abm: null,
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2020-01-01T00:00:00Z',
});

const response = (page: number, items: ProfesionalDto[], pages: number) => ({
  success: true,
  data: items,
  meta: { page, limit: 100, total: 101, pages },
});

describe('matriculadosService.getAll', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it('recorre todas las páginas y conserva su orden', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: response(1, [profesional(1)], 2) } as never)
      .mockResolvedValueOnce({ data: response(2, [profesional(2)], 2) } as never);

    const result = await matriculadosService.getAll();

    expect(apiClient.get).toHaveBeenNthCalledWith(1, ENDPOINTS.matriculados.list, {
      params: { page: 1, limit: 100 },
    });
    expect(apiClient.get).toHaveBeenNthCalledWith(2, ENDPOINTS.matriculados.list, {
      params: { page: 2, limit: 100 },
    });
    expect(result.map(({ id }) => id)).toEqual([1, 2]);
    expect(result[0].estado_matricula).toBe('Activa');
  });

  it('falla explícitamente si la API devuelve metadata de paginación inválida', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { ...response(1, [], 1), meta: { page: 1, limit: 100, total: 0, pages: 0 } },
    } as never);

    await expect(matriculadosService.getAll()).rejects.toThrow(
      'La API devolvió metadata de paginación inválida.',
    );
  });
});
