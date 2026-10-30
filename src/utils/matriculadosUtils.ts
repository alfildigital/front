import type { Matriculado } from '@/types';

export type MatriculadosSortOrder = 'fecha_desc' | 'matricula_asc' | 'nombre_asc';

/**
 * Ordena por fecha de matriculación de más reciente a más antigua por defecto,
 * por número de matrícula de menor a mayor, o por nombre y apellido de A a Z.
 * La matrícula se compara de forma natural para ordenar correctamente sus números;
 * los demás empates se resuelven por ID descendente. No modifica el array original.
 */
export function sortMatriculados(
  items: Matriculado[],
  order: MatriculadosSortOrder = 'fecha_desc',
): Matriculado[] {
  const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });
  return [...items].sort((a, b) => {
    if (order === 'fecha_desc') {
      const porFecha = b.fecha_matriculacion.localeCompare(a.fecha_matriculacion);
      return porFecha || b.id - a.id;
    }

    if (order === 'matricula_asc') {
      return collator.compare(a.nro_matricula, b.nro_matricula) || b.id - a.id;
    }

    const porNombre = collator.compare(a.nombre, b.nombre);
    return porNombre || collator.compare(a.apellido, b.apellido) || b.id - a.id;
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
