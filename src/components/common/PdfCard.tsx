import { Download, FileText } from 'lucide-react';
import type { RecursoPdf } from '@/types';

function getPdfHref(resource: RecursoPdf): string | null {
  if (resource.archivo_contenido) {
    return `data:${resource.archivo_tipo ?? 'application/pdf'};base64,${resource.archivo_contenido}`;
  }
  return resource.archivo_ruta;
}

export function PdfCard({ resource }: { resource: RecursoPdf }) {
  const href = getPdfHref(resource);

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
          <FileText className="h-7 w-7 text-red-500" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-semibold leading-tight text-gray-900 dark:text-gray-100">{resource.titulo}</h2>
      </div>
      {resource.descripcion && <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{resource.descripcion}</p>}
      <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-700">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" download={resource.archivo_nombre ?? undefined} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400">
            Descargar PDF
            <Download className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : <span className="text-sm text-gray-400">Archivo no disponible</span>}
      </div>
    </article>
  );
}