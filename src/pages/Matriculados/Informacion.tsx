import { Helmet } from 'react-helmet-async';
import { Info } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { EmptyState } from '@/components/common/EmptyState';

/**
 * Página de Información Institucional.
 * Contenido pendiente de definición — el contrato con backend no está especificado.
 * Ver src/docs/DECISIONES.md.
 */
export default function InformacionPage() {
  return (
    <Layout>
      <Helmet>
        <title>Información Institucional — {SITE_NAME}</title>
        <meta name="description" content="Información institucional del colegio profesional." />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Información Institucional
          </h1>
        </header>
        <EmptyState
          title="Contenido en construcción"
          description="Esta sección estará disponible pronto. El contrato con el backend está pendiente de definición."
          icon={<Info className="h-8 w-8 text-primary-400" aria-hidden="true" />}
        />
      </div>
    </Layout>
  );
}
