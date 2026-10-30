import { describe, it, expect } from 'vitest';
import { filterMatriculados, sortMatriculados } from '@/utils/matriculadosUtils';
import type { Matriculado } from '@/types';

// ALINEADO CON BACKEND (4.4): fixture con los campos del DTO de
// GET /api/v1/profesionales (nro_matricula, nombre + apellido separados).
const items: Matriculado[] = [
  {
    id: 1,
    nro_matricula: 'MP-1234',
    dni: '28765432',
    nombre: 'María',
    apellido: 'González',
    email: null,
    telefono: null,
    localidad: null,
    direccion: null,
    estado: 'Activa',
    fecha_matriculacion: '2015-03-10',
    observaciones: null,
    foto: null,
    usuario_abm: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    nro_matricula: 'MP-5678',
    dni: '30112233',
    nombre: 'Carlos',
    apellido: 'Fernández',
    email: null,
    telefono: null,
    localidad: null,
    direccion: null,
    estado: 'Activa',
    fecha_matriculacion: '2012-07-22',
    observaciones: null,
    foto: null,
    usuario_abm: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

describe('filterMatriculados', () => {
  it('devuelve todos los ítems cuando el query está vacío', () => {
    expect(filterMatriculados(items, '')).toHaveLength(2);
    expect(filterMatriculados(items, '   ')).toHaveLength(2);
  });

  describe('sortMatriculados', () => {
    it('ordena por apellido y luego nombre ignorando mayúsculas y tildes', () => {
      const result = sortMatriculados([
        { ...items[0], id: 3, apellido: 'álvarez', nombre: 'Zoe' },
        { ...items[0], id: 2, apellido: 'González', nombre: 'María' },
        { ...items[0], id: 4, apellido: 'Alvarez', nombre: 'Ana' },
        { ...items[0], id: 1, apellido: 'González', nombre: 'Carlos' },
      ]);

      expect(result.map(({ id }) => id)).toEqual([4, 3, 1, 2]);
    });

    it('no modifica el array original', () => {
      const unordered = [items[0], items[1]];

      sortMatriculados(unordered);

      expect(unordered.map(({ id }) => id)).toEqual([1, 2]);
    });
  });

  it('filtra por nombre (case-insensitive)', () => {
    const result = filterMatriculados(items, 'maría');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('filtra por número de matrícula', () => {
    const result = filterMatriculados(items, 'MP-5678');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('filtra por matrícula parcial', () => {
    const result = filterMatriculados(items, '1234');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('devuelve array vacío cuando no hay coincidencias', () => {
    expect(filterMatriculados(items, 'xyz999')).toHaveLength(0);
  });

  it('no modifica el array original', () => {
    filterMatriculados(items, 'maría');
    expect(items).toHaveLength(2);
  });
});
