import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { Pagination } from '@/components/common/Pagination';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Hook:      useAlquileres()      →  src/hooks/queries/useAlquileres.ts
// Service:   alquileresService    →  src/api/services/alquileresService.ts
// Endpoint:  GET /api/alquileres
// Paginado:  paginateItems()      →  src/utils/paginationUtils.ts
// ─────────────────────────────────────────────────────────────────────────────
import { useAlquileres } from '@/hooks/queries/useAlquileres';
import { usePagination } from '@/hooks/usePagination';
import { paginateItems } from '@/utils/paginationUtils';
import { formatMoney } from '@/utils/formatters';
import type { Alquiler } from '@/types';

function AlquilerCard({ a }: { a: Alquiler }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {a.imagen ? (
          <img src={a.imagen} alt={a.titulo} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center"><span className="text-4xl">🏢</span></div>
        )}
        <span className={[
          'absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
          a.disponible
            ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400'
            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
        ].join(' ')}>
          {a.disponible
            ? <><CheckCircle className="h-3 w-3" aria-hidden="true" /> Disponible</>
            : <><XCircle className="h-3 w-3" aria-hidden="true" /> No disponible</>}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">{a.titulo}</h2>
        <p className="mb-3 flex-1 text-sm text-gray-600 dark:text-gray-400">{a.descripcion}</p>

        <div className="mb-4 space-y-1.5">
          {a.direccion && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {a.direccion}
            </div>
          )}
          {a.precio !== null && (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {formatMoney(a.precio, a.moneda)} / mes
            </div>
          )}
        </div>

        {(a.contactoNombre ?? a.contactoTelefono ?? a.contactoEmail) && (
          <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
            {a.contactoNombre && (
              <p className="mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">{a.contactoNombre}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {a.contactoTelefono && (
                <a href={`tel:${a.contactoTelefono}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400">
                  <Phone className="h-3 w-3" aria-hidden="true" />{a.contactoTelefono}
                </a>
              )}
              {a.contactoEmail && (
                <a href={`mailto:${a.contactoEmail}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 dark:text-gray-400">
                  <Mail className="h-3 w-3" aria-hidden="true" />{a.contactoEmail}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function AlquileresPage() {
  // ── Obtención de datos ──────────────────────────────────────────────────
  const { data, isPending, isError, refetch } = useAlquileres();

  // ── Paginación ──────────────────────────────────────────────────────────
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(data ?? [], page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Alquileres — {SITE_NAME}</title>
        <meta name="description" content="Inmuebles y espacios disponibles para alquiler en la institución." />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Alquileres</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Espacios y consultorios disponibles</p>
        </header>

        {isPending && <CardSkeletonGrid count={4} />}
        {isError && <ErrorBanner message="No se pudieron cargar los alquileres." onRetry={refetch} />}
        {!isPending && !isError && (data?.length ?? 0) === 0 && (
          <EmptyState title="Sin alquileres" description="No hay espacios disponibles por el momento." />
        )}

        {paginatedItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedItems.map((a) => (
                <AlquilerCard key={a.id} a={a} />
              ))}
            </div>

            <Pagination
              id="alquileres"
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
