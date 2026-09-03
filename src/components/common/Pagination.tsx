import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PageSize } from '@/hooks/usePagination';
import { PAGE_SIZE_OPTIONS } from '@/hooks/usePagination';

// ===========================================================================
// TIPOS INTERNOS
// ===========================================================================

/**
 * Representa cada elemento que se dibujará en la barra de números.
 * Puede ser un botón numerado de página ('page') o un indicador de salto ('ellipsis').
 */
type PageItem =
  | { kind: 'page'; value: number }
  | { kind: 'ellipsis'; key: string };

// ===========================================================================
// FUNCIONES AUXILIARES (ALGORITMO)
// ===========================================================================

/**
 * Genera el arreglo de botones y elipses que se renderizarán.
 *
 * @param current - Número de página activa actual (basado en índice 1).
 * @param total - Cantidad total de páginas disponibles.
 * @returns Un arreglo de objetos `PageItem`.
 */
function getPageItems(current: number, total: number): PageItem[] {
  // CASO 1: Si hay 7 o menos páginas, mostramos todos los números sin elipses.
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => ({
      kind: 'page' as const,
      value: i + 1,
    }));
  }

  const items: PageItem[] = [];

  // CASO 2: Siempre se muestra la página 1.
  items.push({ kind: 'page', value: 1 });

  // Si la página actual está más allá de la 3, agregamos '...' a la izquierda.
  if (current > 3) {
    items.push({ kind: 'ellipsis', key: 'left' });
  }

  // Calculamos el rango central (la página actual y su vecina anterior y siguiente).
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  // Agregamos las páginas del rango central.
  for (let i = start; i <= end; i++) {
    items.push({ kind: 'page', value: i });
  }

  // Si faltan más de 2 páginas para llegar al final, agregamos '...' a la derecha.
  if (current < total - 2) {
    items.push({ kind: 'ellipsis', key: 'right' });
  }

  // Siempre se muestra la última página (siempre que total > 1).
  if (total > 1) {
    items.push({ kind: 'page', value: total });
  }

  return items;
}

// ===========================================================================
// INTERFAZ DE PROPIEDADES (PROPS)
// ===========================================================================

interface PaginationProps {
  /** Página actual activa (basada en índice 1) */
  page: number;
  /** Cantidad de registros por página */
  pageSize: PageSize;
  /** Cantidad total de registros sin paginar */
  totalItems: number;
  /** Cantidad total de páginas calculadas */
  totalPages: number;
  /** Índice (1-based) del primer elemento visible en la página actual */
  from: number;
  /** Índice (1-based) del último elemento visible en la página actual */
  to: number;
  /** Callback para notificar cuando el usuario cambia de página */
  onPageChange: (page: number) => void;
  /** Callback para notificar cuando se cambia el tamaño de página */
  onPageSizeChange: (size: PageSize) => void;
  /** Prefijo opcional para asociar de manera única el label y el select HTML */
  id?: string;
}

// ===========================================================================
// COMPONENTE PRINCIPAL
// ===========================================================================

export function Pagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  from,
  to,
  onPageChange,
  onPageSizeChange,
  id = 'pagination',
}: PaginationProps) {
  // 1. Si no hay elementos en la lista, no se renderiza nada en el DOM.
  if (totalItems === 0) return null;

  // 2. Generamos la estructura de la botonera de páginas basada en los datos actuales.
  const pageItems = getPageItems(page, totalPages);

  return (
    <nav
      aria-label="Paginación"
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* ── SECCIÓN 1: Resumen informativo del estado actual ── */}
      <p className="order-2 text-sm text-gray-500 dark:text-gray-400 sm:order-1">
        Mostrando{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {from}–{to}
        </span>{' '}
        de{' '}
        <span className="font-medium text-gray-700 dark:text-gray-300">{totalItems}</span>{' '}
        resultado{totalItems !== 1 ? 's' : ''}
      </p>

      {/* ── SECCIÓN 2: Controles de navegación y tamaño de página ── */}
      <div className="order-1 flex flex-wrap items-center gap-3 sm:order-2">
        {/* ── Botones de Paginación ── */}
        <div className="flex items-center gap-1" role="group" aria-label="Páginas">
          {/* Botón «Página Anterior» */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1} // Se deshabilita si estamos en la primera página
            aria-label="Página anterior"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Renderizado dinámico de la lista de páginas y elipses */}
          {pageItems.map((item) =>
            item.kind === 'ellipsis' ? (
              // Elemento no interactivo para representar salto de rango (...)
              <span
                key={item.key}
                className="flex h-8 w-6 items-center justify-center text-sm text-gray-400 select-none"
                aria-hidden="true"
              >
                …
              </span>
            ) : (
              // Botón numérico de página
              <button
                key={item.value}
                onClick={() => onPageChange(item.value)}
                aria-label={`Ir a página ${item.value}`}
                // Informa a tecnología asistencial (lectores de pantalla) qué página está activa
                aria-current={item.value === page ? 'page' : undefined}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                  item.value === page
                    ? 'bg-primary-500 text-white shadow-sm' // Estilo de página activa
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-primary-50 hover:border-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700', // Estilo inactivo
                ].join(' ')}
              >
                {item.value}
              </button>
            )
          )}

          {/* Botón «Página Siguiente» */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages} // Se deshabilita si estamos en la última página
            aria-label="Página siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* ── Selector de tamaño de página (Items per page) ── */}
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={`${id}-page-size`}
            className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
          >
            Por página:
          </label>
          <select
            id={`${id}-page-size`}
            value={pageSize}
            // Mapeamos el string del event HTML a número y forzamos el tipo `PageSize`
            onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
            className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 shadow-sm transition-colors focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}