/**
 * Utilidad de paginación en el cliente.
 *
 * Implementación actual: client-side (todos los ítems llegan de la API y se
 * pagina localmente). Si el backend incorpora paginación server-side en el
 * futuro, esta función deja de usarse en el flujo de datos y se reemplazan los
 * parámetros en el service y el hook correspondiente.
 */

export interface PaginationResult<T> {
  /** Ítems de la página actual */
  data: T[];
  /** Total de ítems sin paginar */
  totalItems: number;
  /** Total de páginas */
  totalPages: number;
  /** Índice 1-based del primer ítem visible */
  from: number;
  /** Índice 1-based del último ítem visible */
  to: number;
}

/**
 * Pagina un array en el cliente.
 *
 * @param items    - Array completo de ítems
 * @param page     - Página actual (1-based)
 * @param pageSize - Cantidad de ítems por página
 */
// En este flujo, `items` suele ser el array completo de obras sociales obtenido por `useObrasSociales()`.
// La página actual y el tamaño por página vienen del hook `usePagination`, y esta función retorna
// solo el subconjunto visible de la página actual para renderizar en la vista.
export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginationResult<T> {
  // totalItems = cantidad total de elementos sin paginar.
  const totalItems = items.length;
  // totalPages = cantidad de páginas necesarias según el tamaño elegido.
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Normalizar la página para evitar índices fuera de rango si el usuario cambia la cantidad
  // de elementos por página o si la lista queda vacía después de un filtro.
  const safePage = Math.min(Math.max(1, page), totalPages);

  // start/end definen el rango de elementos que corresponden a la página actual.
  const start = (safePage - 1) * pageSize;
  const end = Math.min(start + pageSize, totalItems);

  return {
    // El array recortado se usa en la vista: `paginatedItems.map((os) => ...)`.
    data: items.slice(start, end),
    totalItems,
    totalPages,
    from: totalItems === 0 ? 0 : start + 1,
    to: end,
  };
}
