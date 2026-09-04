import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Phone, Mail, User } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { Pagination } from '@/components/common/Pagination';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Hook:      useMatriculados()       →  src/hooks/queries/useMatriculados.ts
// Service:   matriculadosService     →  src/api/services/matriculadosService.ts
// Endpoint:  GET /api/matriculados
// Filtrado:  filterMatriculados()    →  src/utils/matriculadosUtils.ts
// Paginado:  paginateItems()         →  src/utils/paginationUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
import { useMatriculados } from '@/hooks/queries/useMatriculados';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { filterMatriculados } from '@/utils/matriculadosUtils';
import { paginateItems } from '@/utils/paginationUtils';
import type { Matriculado } from '@/types';

// ---------------------------------------------------------------------------
// Componente de tarjeta individual
// Responsabilidad: PRESENTACIÓN de un único matriculado.
// No accede a datos externos; recibe todo por props.
// ---------------------------------------------------------------------------

function MatriculadoCard({ m }: { m: Matriculado }) {
  // ALINEACIÓN (4.4): el backend usa "nro_matricula" + "nombre"/"apellido" separados,
  // y no expone "especialidad" en esta versión.
  const nombreCompleto = [m.nombre, m.apellido].filter(Boolean).join(' ');
  return (
    <article className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
        {m.foto ? (
          <img src={m.foto} alt={nombreCompleto} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-7 w-7 text-gray-400" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{nombreCompleto}</p>
        <p className="mt-0.5 font-mono text-xs text-primary-600 dark:text-primary-400">{m.nro_matricula}</p>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {m.telefono && (
            <a
              href={`tel:${m.telefono}`}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Phone className="h-3 w-3" aria-hidden="true" />
              {m.telefono}
            </a>
          )}
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              className="flex items-center gap-1 truncate text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Mail className="h-3 w-3" aria-hidden="true" />
              {m.email}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Página principal
// Responsabilidad: obtener datos, filtrar, paginar y componer la UI.
// La lógica de filtrado está en utils/matriculadosUtils.ts.
// La lógica de paginación está en utils/paginationUtils.ts + hooks/usePagination.ts.
// ---------------------------------------------------------------------------

export default function ListadoPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 350);

  // ── Obtención de datos ────────────────────────────────────────────────────
  // useMatriculados trae TODOS los matriculados desde la API (o mock).
  // La paginación se aplica en el cliente sobre el array resultante.
  const { data, isPending, isError, refetch } = useMatriculados();

  // ── Paginación ────────────────────────────────────────────────────────────
  const { page, pageSize, setPage, setPageSize, resetPage } = usePagination({defaultPageSize: 10});

  // Volver a la página 1 cada vez que cambia el filtro de búsqueda
  useEffect(() => {
    resetPage();
  }, [debouncedQuery, resetPage]);

  // ── Filtrado + paginación ─────────────────────────────────────────────────
  // 1. filterMatriculados filtra por nombre o matrícula
  // 2. paginateItems recorta el array según página y tamaño
  const filtered = data ? filterMatriculados(data, debouncedQuery) : [];
  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(filtered, page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Profesionales Matriculados — {SITE_NAME}</title>
        <meta name="description" content="Listado de profesionales habilitados por la institución." />
      </Helmet>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Profesionales Matriculados
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Buscá por nombre o número de matrícula
          </p>
        </header>

        {/* ── Buscador ── */}
        <div className="relative mb-8">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="search-matriculados"
            type="search"
            placeholder="Buscar por nombre o matrícula..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar profesional"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-500"
          />
        </div>

        {/* ── Estados de carga / error ── */}
        {isPending && <CardSkeletonGrid count={6} />}
        {isError && <ErrorBanner message="No se pudo cargar el listado." onRetry={refetch} />}

        {/* ── Sin resultados ── */}
        {!isPending && !isError && filtered.length === 0 && (
          <EmptyState
            title="Sin resultados"
            description={
              debouncedQuery
                ? `No se encontraron profesionales para "${debouncedQuery}".`
                : 'No hay profesionales registrados.'
            }
          />
        )}

        {/* ── Listado paginado ── */}
        {paginatedItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {paginatedItems.map((m) => (
                <MatriculadoCard key={m.id} m={m} />
              ))}
            </div>

            {/* ── Paginación ── */}
            <Pagination
              id="matriculados"
              page={page}
              pageSize={pageSize}
              totalItems={totalItems}
              totalPages={totalPages}
              from={from}
              to={to}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
