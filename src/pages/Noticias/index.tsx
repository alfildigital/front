import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { Pagination } from '@/components/common/Pagination';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Hook:      useNoticias()        →  src/hooks/queries/useNoticias.ts
// Service:   noticiasService      →  src/api/services/noticiasService.ts
// Endpoint:  GET /api/noticias
// Paginado:  paginateItems()      →  src/utils/paginationUtils.ts
// Nota:      useNoticias también se usa en src/pages/Home/index.tsx (3 noticias)
// ─────────────────────────────────────────────────────────────────────────────
import { useNoticias } from '@/hooks/queries/useNoticias';
import { usePagination } from '@/hooks/usePagination';
import { paginateItems } from '@/utils/paginationUtils';
import { formatDate, truncateText } from '@/utils/formatters';
import type { Noticia } from '@/types';

function NoticiaRow({ noticia }: { noticia: Noticia }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row dark:border-gray-700 dark:bg-gray-800/50">
      {noticia.imagen ? (
        <div className="h-36 w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-48">
          <img src={noticia.imagen} alt={noticia.titulo} className="h-full w-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="flex h-36 w-full flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:w-48 dark:bg-gray-700">
          <span className="text-3xl">📰</span>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div className="mb-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(noticia.fecha)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
            <Tag className="h-3 w-3" aria-hidden="true" />
            {noticia.categoria}
          </span>
        </div>

        <h2 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-100">
          {noticia.titulo}
        </h2>

        <p className="flex-1 text-sm text-gray-600 dark:text-gray-400">
          {truncateText(noticia.resumen, 160)}
        </p>

        <Link
          to={`/noticias/${noticia.id}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          Leer nota completa
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function NoticiasPage() {
  // ── Obtención de datos ──────────────────────────────────────────────────
  const { data, isPending, isError, refetch } = useNoticias();

  // ── Paginación (client-side sobre el total de noticias) ─────────────────
  const { page, pageSize, setPage, setPageSize } = usePagination({ defaultPageSize: 10 });

  const { data: paginatedItems, totalItems, totalPages, from, to } =
    paginateItems(data ?? [], page, pageSize);

  return (
    <Layout>
      <Helmet>
        <title>Noticias — {SITE_NAME}</title>
        <meta name="description" content="Últimas noticias e información de la institución." />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Noticias</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Novedades e información institucional</p>
        </header>

        {isPending && <CardSkeletonGrid count={3} />}
        {isError && <ErrorBanner message="No se pudieron cargar las noticias." onRetry={refetch} />}
        {!isPending && !isError && (data?.length ?? 0) === 0 && (
          <EmptyState title="Sin noticias" description="No hay noticias disponibles por el momento." />
        )}

        {paginatedItems.length > 0 && (
          <>
            <div className="space-y-5">
              {paginatedItems.map((n) => (
                <NoticiaRow key={n.id} noticia={n} />
              ))}
            </div>

            <Pagination
              id="noticias"
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
