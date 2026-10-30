import type { Matriculado } from '@/types';

/**
 * Ordena los matriculados por apellido y luego por nombre, ambos ascendente.
 * Usa reglas de español ignorando mayúsculas y tildes, y no modifica el array original.
 */
export function sortMatriculados(items: Matriculado[]): Matriculado[] {
  const collator = new Intl.Collator('es', { sensitivity: 'base' });
  return [...items].sort((a, b) => {
    const porApellido = collator.compare(a.apellido, b.apellido);
    return porApellido || collator.compare(a.nombre, b.nombre);
  });
}

/**
 * Filtra la lista de matriculados por nombre o número de matrícula.
 *
 * Separado de la presentación para:
 * 1. Permitir testeo unitario sin montar componentes.
 * 2. Facilitar migración a filtrado server-side cuando el volumen lo requiera.
 *    En ese caso, esta función deja de usarse y el hook recibe el query como parámetro.
 *
 * @param items  - Lista completa de matriculados
 * @param query  - Texto de búsqueda (vacío = sin filtro)
 */
export function filterMatriculados(items: Matriculado[], query: string): Matriculado[] {
  const q = query.toLowerCase().trim();
  if (!q) return items;
  return items.filter(
    (m) =>
      `${m.nombre} ${m.apellido}`.toLowerCase().includes(q) ||
      m.nro_matricula.toLowerCase().includes(q),
  );
}
