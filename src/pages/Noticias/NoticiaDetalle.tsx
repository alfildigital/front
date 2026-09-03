import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag, Paperclip, Download } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Skeleton } from '@/components/common/Skeleton';
import { useNoticia } from '@/hooks/queries/useNoticias';
import { formatDate, formatFileSize } from '@/utils/formatters';

export default function NoticiaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? '0', 10);
  const { data, isPending, isError, refetch } = useNoticia(numericId);

  return (
    <Layout>
      <Helmet>
        <title>{data?.titulo ?? 'Noticia'} — {SITE_NAME}</title>
        {data?.resumen && <meta name="description" content={data.resumen} />}
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/noticias"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a noticias
        </Link>

        {isPending && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" count={5} />
          </div>
        )}

        {isError && (
          <ErrorBanner
            message="No se pudo cargar la noticia. Es posible que no exista o haya sido eliminada."
            onRetry={refetch}
          />
        )}

        {data && (
          <article>
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {formatDate(data.fecha)}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                <Tag className="h-3 w-3" aria-hidden="true" />
                {data.categoria}
              </span>
            </div>

            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              {data.titulo}
            </h1>

            {data.imagen && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={data.imagen}
                  alt={data.titulo}
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
            )}

            <div
              className="prose prose-gray max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: data.contenido }}
            />

            {data.adjuntos.length > 0 && (
              <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/30">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Paperclip className="h-4 w-4" aria-hidden="true" />
                  Adjuntos ({data.adjuntos.length})
                </h2>
                <ul className="space-y-2">
                  {data.adjuntos.map((adj) => (
                    <li key={adj.id}>
                      <a
                        href={adj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-900/10"
                      >
                        <span className="font-medium text-gray-800 dark:text-gray-200">{adj.nombre}</span>
                        <span className="flex items-center gap-2 text-xs text-gray-400">
                          {formatFileSize(adj.tamanio)}
                          <Download className="h-4 w-4 text-primary-500" aria-hidden="true" />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        )}
      </div>
    </Layout>
  );
}
