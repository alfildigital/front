import { describe, it, expect } from 'vitest';
import { filterMatriculados } from '@/utils/matriculadosUtils';
import type { Matriculado } from '@/types';

const items: Matriculado[] = [
  {
    id: 1,
    nombre: 'Dra. María González',
    matricula: 'MP-1234',
    especialidad: 'Medicina General',
    telefono: null,
    email: null,
    foto: null,
  },
  {
    id: 2,
    nombre: 'Dr. Carlos Fernández',
    matricula: 'MP-5678',
    especialidad: 'Cardiología',
    telefono: null,
    email: null,
    foto: null,
  },
];

describe('filterMatriculados', () => {
  it('devuelve todos los ítems cuando el query está vacío', () => {
    expect(filterMatriculados(items, '')).toHaveLength(2);
    expect(filterMatriculados(items, '   ')).toHaveLength(2);
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
