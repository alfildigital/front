import { Helmet } from 'react-helmet-async';
import { Calendar, Paperclip, Download } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/Skeleton';
import { Pagination } from '@/components/common/Pagination';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Hook:      useBoletin()          →  src/hooks/queries/useBoletin.ts
// Service:   boletinService        →  src/api/services/boletinService.ts
// Endpoint:  GET /api/boletin-oficial
// Paginado:  paginateItems()       →  src/utils/paginationUtils.ts
// Nota:      los ítems se ordenan por fecha descendente antes de paginar
// ─────────────────────────────────────────────────────────────────────────────
import { useBoletin } from '@/hooks/queries/useBoletin';
import { usePagination } from '@/hooks/usePagination';
import { paginateItems } from '@/utils/paginationUtils';
import { formatDate, formatFileSize } from '@/utils/formatters';
import type { BoletinPublicacion } from '@/types';

function PublicacionItem({ pub }: { pub: BoletinPublicacion }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{pub.titulo}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(pub.fecha)}
          </p>
        </div>
        {pub.adjuntos.length > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            <Paperclip className="h-3 w-3" aria-hidden="true" />
            {pub.adjuntos.length}
          </span>
        )}
      </div>

      {pub.descripcion && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{pub.descripcion}</p>
      )}

      {pub.adjuntos.length > 0 && (
        <div className="mt-4 space-y-2">
          {pub.adjuntos.map((adj) => (
            <a
              key={adj.id}
              href={adj.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-900/10"
            >
              <span className="truncate font-medium text-gray-800 dark:text-gray-200">{adj.nombre}</span>
              <span className="ml-3 flex flex-shrink-0 items-center gap-2 text-xs text-gray-400">
                {formatFileSize(adj.tamanio)}
                <Download className="h-4 w-4 text-primary-500" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function BoletinOficialPage() {
  // ── Obtención de datos ──────────────────────────────────────────────────
  const { data, isPending, isError, refetch } = useBoletin();

  // ── Ordenamiento por fecha descendente ──────────────────────────────────
  // Se ordena antes de paginar para que la página 1 siempre muestre lo más nuevo
  const sorted = data
    ? [...data].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    : [];

  // ── Paginación ──────────────────────────────────────────────────────────
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(sorted, page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Boletín Oficial — {SITE_NAME}</title>
        <meta name="description" content="Publicaciones oficiales, resoluciones y comunicados institucionales." />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Boletín Oficial</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Publicaciones, resoluciones y comunicados oficiales
          </p>
        </header>

        {isPending && (
          <div className="space-y-4">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        )}
        {isError && <ErrorBanner message="No se pudo cargar el boletín oficial." onRetry={refetch} />}
        {!isPending && !isError && sorted.length === 0 && (
          <EmptyState title="Sin publicaciones" description="No hay publicaciones disponibles por el momento." />
        )}

        {paginatedItems.length > 0 && (
          <>
            <div className="space-y-4">
              {paginatedItems.map((pub) => (
                <PublicacionItem key={pub.id} pub={pub} />
              ))}
            </div>

            <Pagination
              id="boletin"
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
