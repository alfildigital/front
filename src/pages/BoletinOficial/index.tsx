import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Download, FileText } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeleton } from '@/components/common/Skeleton';
import { Pagination } from '@/components/common/Pagination';

// ─── DATOS DE ESTA PÁGINA ────────────────────────────────────────────────────
// Hook:      useBoletin()          →  src/hooks/queries/useBoletin.ts
// Service:   boletinService        →  src/api/services/boletinService.ts
// Endpoint:  GET /api/v1/boletines-oficiales   (alineado en 4.1)
// Paginado:  paginateItems()       →  src/utils/paginationUtils.ts
// Nota:      los ítems se ordenan por created_at descendente antes de paginar
// ─────────────────────────────────────────────────────────────────────────────
import { useBoletin } from '@/hooks/queries/useBoletin';
import { usePagination } from '@/hooks/usePagination';
import { paginateItems } from '@/utils/paginationUtils';
import { formatDate, formatFileSize } from '@/utils/formatters';
import type { BoletinPublicacion } from '@/types';

function PublicacionItem({ pub }: { pub: BoletinPublicacion }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pub.archivo_ruta) {
      setBlobUrl(pub.archivo_ruta);
      return;
    }
    if (!pub.archivo_contenido) {
      setBlobUrl(null);
      return;
    }
    const mime = pub.archivo_tipo ?? 'application/pdf';
    const binary = atob(pub.archivo_contenido);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pub.archivo_ruta, pub.archivo_contenido, pub.archivo_tipo]);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{pub.titulo}</h2>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(pub.created_at)}
          </p>
        </div>
      </div>

      {pub.resumen && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{pub.resumen}</p>
      )}

      {blobUrl && (
        <div className="mt-4 space-y-2">
          <a
            href={blobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-900/10"
          >
            <span className="flex items-center gap-2 truncate font-medium text-gray-800 dark:text-gray-200">
              <FileText className="h-4 w-4 flex-shrink-0 text-primary-500" aria-hidden="true" />
              {pub.archivo_nombre ?? 'Descargar documento'}
            </span>
            <span className="ml-3 flex flex-shrink-0 items-center gap-2 text-xs text-gray-400">
              {pub.archivo_tamano ? formatFileSize(pub.archivo_tamano) : null}
              <Download className="h-4 w-4 text-primary-500" aria-hidden="true" />
            </span>
          </a>
        </div>
      )}
    </article>
  );
}

export default function BoletinOficialPage() {
  // ── Obtención de datos ──────────────────────────────────────────────────
  const { data, isPending, isError, refetch } = useBoletin();

  // ── Ordenamiento por fecha descendente ──────────────────────────────────
  // Se ordena antes de paginar para que la página 1 siempre muestre lo más nuevo.
  // ALINEACIÓN (4.4): el backend no expone "fecha", se ordena por created_at.
  const sorted = data
    ? [...data].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
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
