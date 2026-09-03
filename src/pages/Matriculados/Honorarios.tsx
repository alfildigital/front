import { Helmet } from 'react-helmet-async';
import { FileText, ImageIcon, Download, Calendar } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { useHonorarios } from '@/hooks/queries/useMatriculados';
import { formatDate } from '@/utils/formatters';
import type { Honorario } from '@/types';

function HonorarioItem({ h }: { h: Honorario }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
      {h.tipo === 'imagen' ? (
        <>
          <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={h.url}
              alt={h.titulo}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{h.titulo}</h2>
            {h.descripcion && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{h.descripcion}</p>
            )}
            {h.fecha && (
              <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {formatDate(h.fecha)}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/20">
            <FileText className="h-6 w-6 text-red-500" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{h.titulo}</h2>
            {h.descripcion && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{h.descripcion}</p>
            )}
            {h.fecha && (
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {formatDate(h.fecha)}
              </p>
            )}
          </div>
          <a
            href={h.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            aria-label={`Descargar ${h.titulo}`}
            className="flex items-center gap-1.5 rounded-lg bg-primary-100 px-3 py-2 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-400"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar
          </a>
        </div>
      )}
    </article>
  );
}

export default function HonorariosPage() {
  const { data, isPending, isError, refetch } = useHonorarios();

  return (
    <Layout>
      <Helmet>
        <title>Honorarios — {SITE_NAME}</title>
        <meta name="description" content="Tabla de honorarios mínimos vigentes para los profesionales matriculados." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Honorarios</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Tablas de honorarios mínimos vigentes
          </p>
        </header>

        {isPending && <CardSkeletonGrid count={3} />}
        {isError && <ErrorBanner message="No se pudieron cargar los honorarios." onRetry={refetch} />}
        {data?.length === 0 && (
          <EmptyState
            title="Sin honorarios"
            description="No hay documentos de honorarios disponibles."
            icon={<ImageIcon className="h-8 w-8 text-primary-400" />}
          />
        )}

        {data && data.length > 0 && (
          <div className="space-y-4">
            {data.map((h) => (
              <HonorarioItem key={h.id} h={h} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
