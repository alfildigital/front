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
// Endpoint:  GET {VITE_API_URL}/profesionales (API real, sin mocks)
// Filtrado:  filterMatriculados()    →  src/utils/matriculadosUtils.ts
// Paginado:  paginateItems()         →  src/utils/paginationUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
import { useMatriculados } from '@/hooks/queries/useMatriculados';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { filterMatriculados, sortMatriculados } from '@/utils/matriculadosUtils';
import { paginateItems } from '@/utils/paginationUtils';
import type { Matriculado } from '@/types';
import { Reveal } from '@/components/common/Reveal';

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
    <article className="group flex items-start gap-4 rounded-2xl border border-secondary-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl dark:border-primary-700 dark:bg-gray-900 dark:hover:border-primary-500 dark:hover:bg-gray-800">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-secondary-200 bg-primary-50 text-primary-700 shadow-inner dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
        <User className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="truncate text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-400">
            {nombreCompleto}
          </p>
          <span className="rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
            {m.nro_matricula}
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {m.telefono && (
            <a
              href={`tel:${m.telefono}`}
              className="flex items-center gap-2 text-xs text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{m.telefono}</span>
            </a>
          )}
          {m.email && (
            <a
              href={`mailto:${m.email}`}
              className="flex items-center gap-2 text-xs text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{m.email}</span>
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
  // useMatriculados trae todos los matriculados desde la API.
  // La paginación se aplica en el cliente sobre el array resultante.
  const { data, isPending, isError, refetch } = useMatriculados();

  // ── Paginación ────────────────────────────────────────────────────────────
  const { page, pageSize, setPage, setPageSize, resetPage } = usePagination({defaultPageSize: 10});

  // Volver a la página 1 cada vez que cambia el filtro de búsqueda
  useEffect(() => {
    resetPage();
  }, [debouncedQuery, resetPage]);

  // ── Ordenamiento + filtrado + paginación ──────────────────────────────────
  // Primero ordena por apellido y luego nombre (ascendente, reglas de español);
  // después filtra y pagina para que el orden sea consistente entre páginas.
  const ordered = sortMatriculados(data ?? []);
  const filtered = filterMatriculados(ordered, debouncedQuery);
  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(filtered, page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Profesionales Matriculados — {SITE_NAME}</title>
        <meta name="description" content="Listado de profesionales habilitados por la institución." />
      </Helmet>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 shadow-sm dark:border-primary-800 dark:bg-primary-900/20">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              Directorio institucional
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Profesionales Matriculados
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300">
            Buscá por nombre o número de matrícula y contactá directamente con el profesional.
          </p>
        </Reveal>

        {/* ── Buscador ── */}
        <div className="relative mx-auto mb-8 max-w-2xl">
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
            className="w-full rounded-2xl border border-secondary-200 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
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
