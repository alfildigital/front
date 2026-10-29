import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Reveal } from '@/components/common/Reveal';
import { formatDate, truncateText } from '@/utils/formatters';
import { noticiaImagen, noticiaResumen } from '@/utils/fileUtils';
import type { Noticia } from '@/types';

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  const imagen = noticiaImagen(noticia);
  const resumen = noticiaResumen(noticia);
  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary-400 hover:shadow-xl dark:border-primary-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-primary-500 dark:hover:bg-gray-800">
      <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {imagen ? (
          <img
            src={imagen}
            alt={noticia.titulo}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary-50 dark:bg-primary-900/20">
            <span className="text-4xl" aria-hidden="true">📰</span>
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
            <span className="flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2 py-0.5 font-medium text-primary-700 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-400">
              <Tag className="h-3 w-3" aria-hidden="true" />
              {noticia.autor}
            </span>
          )}
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-400">
          {noticia.titulo}
        </h3>

        <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {truncateText(resumen, 120)}
        </p>

        <Link
          to={`/noticias/${noticia.id}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
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
            <Reveal>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Últimas Noticias</h2>
            </Reveal>
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
