import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Tag, Download } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Skeleton } from '@/components/common/Skeleton';
import { useNoticia } from '@/hooks/queries/useNoticias';
import { formatDate, formatFileSize } from '@/utils/formatters';
import type { Noticia } from '@/types';

// ALINEACIÓN (4.4): el backend no expone "fecha", "categoria" ni "adjuntos".
// - Fecha  → fecha_publicacion
// - Firma  → autor (sustituye al badge de categoría inexistente)
// - Imagen destacada → archivo_ruta si archivo_tipo es de imagen
// - Adjunto único → archivo_* (en lugar del array adjuntos[])

function noticiaImagen(n: Noticia): string | null {
  if (!n.archivo_ruta) return null;
  if (n.archivo_tipo == null) return n.archivo_ruta;
  return n.archivo_tipo.startsWith('image/') ? n.archivo_ruta : null;
}

function useAdjuntoUrl(n: Noticia | undefined): string | null {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const ruta = n?.archivo_ruta ?? null;
  const contenido = n?.archivo_contenido ?? null;
  const tipo = n?.archivo_tipo ?? null;

  useEffect(() => {
    if (ruta) {
      setBlobUrl(ruta);
      return;
    }
    if (!contenido) {
      setBlobUrl(null);
      return;
    }
    const mime = tipo ?? 'application/pdf';
    const binary = atob(contenido);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: mime });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [ruta, contenido, tipo]);

  return blobUrl;
}

export default function NoticiaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? '0', 10);
  const { data, isPending, isError, refetch } = useNoticia(numericId);
  const imagen = data ? noticiaImagen(data) : null;
  const adjuntoUrl = useAdjuntoUrl(data);

  return (
    <Layout>
      <Helmet>
        <title>{data?.titulo ?? 'Noticia'} — {SITE_NAME}</title>
        {data?.contenido && (
          <meta
            name="description"
            content={data.contenido.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()}
          />
        )}
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
                {formatDate(data.fecha_publicacion)}
              </span>
              {data.autor && (
                <span className="flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {data.autor}
                </span>
              )}
            </div>

            <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
              {data.titulo}
            </h1>

            {imagen && (
              <div className="mb-8 overflow-hidden rounded-xl">
                <img
                  src={imagen}
                  alt={data.titulo}
                  className="h-64 w-full object-cover sm:h-80"
                />
              </div>
            )}

            <div
              className="prose prose-gray max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: data.contenido }}
            />

            {adjuntoUrl && !noticiaImagen(data) && (
              <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/30">
                <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Documento adjunto
                </h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href={adjuntoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-colors hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-700 dark:hover:bg-primary-900/10"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {data.archivo_nombre ?? 'Descargar documento'}
                      </span>
                      <span className="flex items-center gap-2 text-xs text-gray-400">
                        {data.archivo_tamano ? formatFileSize(data.archivo_tamano) : null}
                        <Download className="h-4 w-4 text-primary-500" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </article>
        )}
      </div>
    </Layout>
  );
}
