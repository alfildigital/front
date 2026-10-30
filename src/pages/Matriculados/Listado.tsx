import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Phone, Mail, MapPin, ArrowDownWideNarrow, ChevronDown, Check } from 'lucide-react';
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
import {
  filterMatriculados,
  sortMatriculados,
  type MatriculadosSortOrder,
} from '@/utils/matriculadosUtils';
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
  const telefono = m.telefono?.trim();
  const email = m.email?.trim();
  const direccion = m.direccion?.trim();
  const mostrarTelefono = telefono && telefono.replace(/\D/g, '').length >= 10;
  const estado = m.estado_matricula?.trim().toLowerCase();
  const estadoClassName = estado === 'activa'
    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300'
    : estado === 'suspendida'
      ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      : estado === 'inactiva'
        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300'
        : 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300';

  return (
    <article className="group relative isolate flex items-start gap-4 overflow-hidden rounded-2xl border border-secondary-300 bg-gradient-to-br from-white via-white to-primary-50/80 p-4 shadow-md shadow-gray-900/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl dark:border-primary-700 dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:shadow-black/10 dark:hover:border-primary-500 dark:hover:bg-gray-800">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 z-0 h-36 w-36 rounded-full bg-primary-300/25 blur-2xl transition-colors duration-300 group-hover:bg-primary-400/35 dark:bg-primary-500/10 dark:group-hover:bg-primary-400/20"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 right-1/3 z-0 h-28 w-28 rounded-full bg-secondary-300/20 blur-2xl dark:bg-secondary-400/5"
      />
      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-400">
              {nombreCompleto}
            </p>
            {m.estado_matricula?.trim() && (
              <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${estadoClassName}`}>
                {estado}
              </span>
            )}
          </div>
          <span className="rounded-full border border-primary-300 bg-primary-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-800 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
            {m.nro_matricula}
          </span>
        </div>

        {(mostrarTelefono || email || direccion) && (
          <div className="mt-3 space-y-2">
            {mostrarTelefono && (
              <a
                href={`tel:${telefono}`}
                className="flex items-center gap-2 text-xs text-gray-700 transition-colors hover:text-primary-700 dark:text-gray-300 dark:hover:text-primary-400"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{telefono}</span>
              </a>
            )}
            {email && (
              <div className="flex min-w-0 items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${email}`}
                  title={email}
                  className="truncate transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {email}
                </a>
              </div>
            )}
            {direccion && (
              <div className="flex min-w-0 items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate" title={direccion}>{direccion}</span>
              </div>
            )}
          </div>
        )}
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
  const [sortOrder, setSortOrder] = useState<MatriculadosSortOrder>('fecha_desc');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [activeSortOption, setActiveSortOption] = useState(0);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const sortTriggerRef = useRef<HTMLButtonElement>(null);
  const sortListRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 350);
  const sortOptions: { value: MatriculadosSortOrder; label: string }[] = [
    { value: 'fecha_desc', label: 'Más recientes primero' },
    { value: 'matricula_asc', label: 'Matrícula: más antigua primero' },
    { value: 'nombre_asc', label: 'Nombre: A a Z' },
  ];

  // ── Obtención de datos ────────────────────────────────────────────────────
  // useMatriculados trae todos los matriculados desde la API.
  // La paginación se aplica en el cliente sobre el array resultante.
  const { data, isPending, isError, refetch } = useMatriculados();

  // ── Paginación ────────────────────────────────────────────────────────────
  const { page, pageSize, setPage, setPageSize, resetPage } = usePagination({defaultPageSize: 10});

  // Volver a la página 1 cuando cambia el filtro o el criterio de orden.
  useEffect(() => {
    resetPage();
  }, [debouncedQuery, sortOrder, resetPage]);

  useEffect(() => {
    if (!sortMenuOpen) return;

    sortListRef.current?.focus();
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setSortMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [sortMenuOpen]);

  // ── Ordenamiento + filtrado + paginación ──────────────────────────────────
  // Ordena primero (por fecha reciente a antigua por defecto, o alfabéticamente);
  // después filtra y pagina para mantener el criterio en todas las páginas.
  const ordered = sortMatriculados(data ?? [], sortOrder);
  const filtered = filterMatriculados(ordered, debouncedQuery);
  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(filtered, page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Profesionales Matriculados — {SITE_NAME}</title>
        <meta name="description" content="Listado de profesionales habilitados por la institución." />
      </Helmet>

      <div className="bg-primary-100/10 mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
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
        <div className="mx-auto mb-8 flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full flex-1">
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
              className="w-full rounded-2xl border border-secondary-300 bg-white py-3.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/30"
            />
          </div>
          <div
            ref={sortMenuRef}
            className="group relative w-fit max-w-full self-end rounded-xl border border-primary-200/80 bg-white p-px shadow-sm shadow-primary-950/5 transition-colors duration-200 hover:border-primary-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 sm:self-auto dark:border-primary-800 dark:bg-gray-900 dark:shadow-black/20 dark:hover:border-primary-600 dark:focus-within:border-primary-600 dark:focus-within:ring-primary-900/50"
          >
            <div className="flex items-center gap-2 rounded-[11px] px-2 py-1.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                <ArrowDownWideNarrow className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span id="orden-matriculados-label" className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  Ordenar por
                </span>
                <button
                  ref={sortTriggerRef}
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={sortMenuOpen}
                  aria-labelledby="orden-matriculados-label orden-matriculados-value"
                  aria-controls="orden-matriculados-listbox"
                  onClick={() => {
                    const selectedIndex = sortOptions.findIndex((option) => option.value === sortOrder);
                    setActiveSortOption(selectedIndex < 0 ? 0 : selectedIndex);
                    setSortMenuOpen((open) => !open);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                      event.preventDefault();
                      const selectedIndex = sortOptions.findIndex((option) => option.value === sortOrder);
                      setActiveSortOption(selectedIndex < 0 ? 0 : selectedIndex);
                      setSortMenuOpen(true);
                    }
                  }}
                  className="flex w-full min-w-52 items-center justify-between gap-3 text-left text-xs font-semibold text-gray-900 outline-none dark:text-gray-100"
                >
                  <span id="orden-matriculados-value" className="truncate">
                    {sortOptions.find((option) => option.value === sortOrder)?.label}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 shrink-0 text-primary-600 transition-transform dark:text-primary-400 ${sortMenuOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
            {sortMenuOpen && (
              <div
                ref={sortListRef}
                id="orden-matriculados-listbox"
                role="listbox"
                aria-labelledby="orden-matriculados-label"
                aria-activedescendant={`orden-opcion-${sortOptions[activeSortOption].value}`}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setSortMenuOpen(false);
                    sortTriggerRef.current?.focus();
                  } else if (event.key === 'Tab') {
                    setSortMenuOpen(false);
                  } else if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setActiveSortOption((index) => (index + 1) % sortOptions.length);
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    setActiveSortOption((index) => (index - 1 + sortOptions.length) % sortOptions.length);
                  } else if (event.key === 'Home') {
                    event.preventDefault();
                    setActiveSortOption(0);
                  } else if (event.key === 'End') {
                    event.preventDefault();
                    setActiveSortOption(sortOptions.length - 1);
                  } else if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const option = sortOptions[activeSortOption];
                    setSortOrder(option.value);
                    setSortMenuOpen(false);
                    sortTriggerRef.current?.focus();
                  }
                }}
                className="absolute right-0 top-full z-30 mt-2 w-64 rounded-2xl border border-primary-100 bg-white/95 p-1.5 shadow-xl shadow-gray-950/15 ring-1 ring-black/5 backdrop-blur-xl focus:outline-none dark:border-primary-800 dark:bg-gray-900/95 dark:shadow-black/50 dark:ring-white/10"
              >
                {sortOptions.map((option, index) => {
                  const selected = sortOrder === option.value;
                  const active = activeSortOption === index;
                  return (
                    <div
                      key={option.value}
                      id={`orden-opcion-${option.value}`}
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActiveSortOption(index)}
                      onClick={() => {
                        setSortOrder(option.value);
                        setSortMenuOpen(false);
                        sortTriggerRef.current?.focus();
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                        selected
                          ? 'bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-primary-200'
                          : active
                            ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                            : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                      {selected && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
