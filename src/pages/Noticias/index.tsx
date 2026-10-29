import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
// Endpoint:  GET /api/v1/novedades            (alineado en 4.1)
// Paginado:  paginateItems()      →  src/utils/paginationUtils.ts
// Nota:      useNoticias también se usa en src/pages/Home/index.tsx (3 noticias)
// ─────────────────────────────────────────────────────────────────────────────
import { useNoticias } from '@/hooks/queries/useNoticias';
import { usePagination } from '@/hooks/usePagination';
import { paginateItems } from '@/utils/paginationUtils';
import { formatDate, truncateText } from '@/utils/formatters';
import { noticiaImagen, noticiaResumen } from '@/utils/fileUtils';
import type { Noticia } from '@/types';
import { Reveal } from '@/components/common/Reveal';

function NoticiaRow({ noticia }: { noticia: Noticia }) {
  const imagen = noticiaImagen(noticia);
  const resumen = noticiaResumen(noticia);

  return (
    <article className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-secondary-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl sm:flex-row dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-primary-500 dark:hover:bg-gray-800">
      {imagen ? (
        <div className="h-36 w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-48">
          <img src={imagen} alt={noticia.titulo} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </div>
      ) : (
        <div className="flex h-36 w-full flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-3xl shadow-inner sm:w-48 dark:bg-primary-900/20">
          <span aria-hidden="true">📰</span>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <div className="mb-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(noticia.fecha_publicacion)}
          </span>
          {noticia.autor && (
            <span className="flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {noticia.autor}
            </span>
          )}
        </div>

        <h2 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-400">
          {noticia.titulo}
        </h2>

        <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {truncateText(resumen, 160)}
        </p>

        <Link
          to={`/noticias/${noticia.id}`}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
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
        <title>Noticias del Colegio de Educación Especial en Posadas | Novedades institucionales</title>
        <meta
          name="description"
          content="Novedades, comunicados y noticias del Colegio de Profesionales en Educación Especial de Posadas, Misiones. Información institucional, publicaciones y actualizaciones para profesionales."
        />
        <link rel="canonical" href="https://colegioedespecial.org.ar/noticias" />
      </Helmet>

      <div className="mx-auto bg-secondary-100/10 dark:bg-gray-900 max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Noticias</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Novedades e información institucional</p>
        </Reveal>

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
