import { useState, useCallback } from 'react';

/** Opciones de cantidad de ítems por página disponibles en la UI */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface UsePaginationOptions {
  /** Tamaño de página inicial. Por defecto: 10 */
  defaultPageSize?: PageSize;
}

export interface UsePaginationResult {
  /** Página actual (1-based) */
  page: number;
  /** Cantidad de ítems por página */
  pageSize: PageSize;
  /** Cambiar a una página específica */
  setPage: (page: number) => void;
  /** Cambiar el tamaño de página y volver a la página 1 */
  setPageSize: (size: PageSize) => void;
  /** Volver a la página 1. Llamar cuando cambia un filtro externo. */
  resetPage: () => void;
}

/**
 * Gestiona el estado de paginación: página actual y tamaño de página.
 *
 * Uso típico:
 * ```tsx
 * const { page, pageSize, setPage, setPageSize, resetPage } = usePagination();
 * const { data: paginatedData, totalPages } = paginateItems(allData, page, pageSize);
 * ```
 *
 * Cuando un filtro externo cambia (ej: búsqueda), llamar resetPage() para
 * evitar que el usuario quede en una página inexistente.
 */
export function usePagination({
  defaultPageSize = 10,
}: UsePaginationOptions = {}): UsePaginationResult {
  const [page, setPageRaw] = useState(1);
  const [pageSize, setPageSizeRaw] = useState<PageSize>(defaultPageSize);

  const setPage = useCallback((p: number) => setPageRaw(p), []);

  const setPageSize = useCallback((size: PageSize) => {
    setPageSizeRaw(size);
    setPageRaw(1); // al cambiar el tamaño siempre volver a la página 1
  }, []);

  const resetPage = useCallback(() => setPageRaw(1), []);

  return { page, pageSize, setPage, setPageSize, resetPage };
}
