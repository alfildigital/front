import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { formatDate, truncateText } from '@/utils/formatters';
import type { Noticia } from '@/types';

// ALINEACIÓN (4.4): el backend no expone "imagen", "categoria" ni "resumen".
// Se derivan: imagen → archivo_ruta (si es imagen), resumen → contenido sin HTML,
// y autor en lugar de la categoría inexistente.
function noticiaImagen(n: Noticia): string | null {
  if (!n.archivo_ruta) return null;
  if (n.archivo_tipo == null) return n.archivo_ruta;
  return n.archivo_tipo.startsWith('image/') ? n.archivo_ruta : null;
}

function noticiaResumen(n: Noticia): string {
  return n.contenido.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const imagen = noticiaImagen(noticia);
  const resumen = noticiaResumen(noticia);
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {imagen ? (
          <img
            src={imagen}
            alt={noticia.titulo}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {formatDate(noticia.fecha_publicacion)}
          </span>
          {noticia.autor && (
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {noticia.autor}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {noticia.titulo}
        </h3>

        <p className="flex-1 text-sm text-gray-600 dark:text-gray-400">
          {truncateText(resumen, 120)}
        </p>

        <Link
          to={`/noticias/${noticia.id}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Leer más
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

interface NoticiasPreviewProps {
  noticias: Noticia[];
}

export function NoticiasPreview({ noticias }: NoticiasPreviewProps) {
  return (
    <section aria-label="Últimas noticias" className="py-16 bg-gray-50 dark:bg-gray-800/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Últimas Noticias</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mantenete informado</p>
          </div>
          <Link
            to="/noticias"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <NoticiaCard key={n.id} noticia={n} />
          ))}
        </div>
      </div>
    </section>
  );
}
