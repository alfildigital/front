import { Helmet } from 'react-helmet-async';
import { FileText, ImageIcon, Download, Calendar, CreditCard } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { EmptyState } from '@/components/common/EmptyState';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { useHonorarios } from '@/hooks/queries/useMatriculados';
import { formatDate } from '@/utils/formatters';
import type { Honorario } from '@/types';
import { Reveal } from '@/components/common/Reveal';

function HonorarioItem({ h }: { h: Honorario }) {
  return (
    <article className="rounded-xl border border-gray-300 bg-gray-50 overflow-hidden shadow-md dark:border-gray-700 dark:bg-gray-800/50">
      {h.tipo === 'imagen' ? (
        <>
          <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={h.url}
              alt={h.titulo}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
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
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
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
          
        </div>
      )}
    </article>
  );
}

export default function HonorariosPage() {
  const { data, isPending } = useHonorarios();

  return (
    <Layout>
      <Helmet>
        <title>Honorarios — {SITE_NAME}</title>
        <meta name="description" content="Tabla de honorarios mínimos vigentes para los profesionales matriculados." />
      </Helmet>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Honorarios</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Tablas de honorarios mínimos vigentes
          </p>
        </Reveal>

        <section className="mb-8 rounded-xl border border-secondary-300 bg-primary-100/20 p-6 shadow-md dark:border-primary-700 dark:bg-gray-800/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <CreditCard className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Matrícula profesional
          </h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            La inscripción inicia el trámite para obtener la matrícula profesional. Una vez matriculado/a,
            se abona una cuota mensual para mantenerla vigente.
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border-2 border-primary-200 bg-green-100/70 p-4 dark:border-green-700 dark:bg-gray-900/50">
              <dt className="text-sm text-gray-500 dark:text-gray-400">Inscripción</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">$37.000</dd>
            </div>
            <div className="rounded-lg border-2 border-primary-200 bg-green-100/70 p-4 dark:border-green-700 dark:bg-gray-900/50">
              <dt className="text-sm text-gray-500 dark:text-gray-400">Cuota mensual</dt>
              <dd className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">$6.000</dd>
            </div>
          </dl>
        </section>
        {isPending && <CardSkeletonGrid count={3} />}
        {isPending && <CardSkeletonGrid count={3} />}
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
