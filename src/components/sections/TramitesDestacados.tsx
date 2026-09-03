import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, RefreshCw, FileCheck, Stamp, HelpCircle } from 'lucide-react';
import type { Tramite } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  BadgeCheck,
  RefreshCw,
  FileCheck,
  Stamp,
};

function getIcon(name: string | null): React.ElementType {
  if (!name) return HelpCircle;
  return ICON_MAP[name] ?? HelpCircle;
}

function TramiteCard({ tramite }: { tramite: Tramite }) {
  const Icon = getIcon(tramite.icono);

  return (
    <div className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
        <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
      </div>

      <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">{tramite.titulo}</h3>
      <p className="mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400">{tramite.descripcion}</p>

      {tramite.requisitos.length > 0 && (
        <ul className="mb-4 space-y-1">
          {tramite.requisitos.slice(0, 3).map((req, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-secondary-400" aria-hidden="true" />
              {req}
            </li>
          ))}
          {tramite.requisitos.length > 3 && (
            <li className="text-xs text-gray-400">+{tramite.requisitos.length - 3} más...</li>
          )}
        </ul>
      )}

      <Link
        to="/tramites"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
      >
        Ver detalle
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

interface TramitesDestacadosProps {
  tramites: Tramite[];
}

export function TramitesDestacados({ tramites }: TramitesDestacadosProps) {
  const displayed = tramites.slice(0, 4);

  return (
    <section aria-label="Trámites destacados" className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trámites</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Gestiones más frecuentes</p>
          </div>
          <Link
            to="/tramites"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayed.map((t) => (
            <TramiteCard key={t.id} tramite={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
