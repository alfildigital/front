import { Helmet } from 'react-helmet-async';
import { Info } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { EmptyState } from '@/components/common/EmptyState';

export default function RequisitosOsPage() {
  return (
    <Layout>
      <Helmet>
        <title>Requisitos para Incorporación — {SITE_NAME}</title>
        <meta name="description" content="Requisitos para que una obra social se incorpore al convenio." />
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Requisitos para Incorporación
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Requisitos para que una obra social se incorpore al convenio
          </p>
        </header>
        <EmptyState
          title="Contenido en construcción"
          description="Esta sección estará disponible pronto."
          icon={<Info className="h-8 w-8 text-primary-400" aria-hidden="true" />}
        />
      </div>
    </Layout>
  );
}
