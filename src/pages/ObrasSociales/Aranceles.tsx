import { Helmet } from 'react-helmet-async';
import { Info } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { EmptyState } from '@/components/common/EmptyState';
import { Reveal } from '@/components/common/Reveal';

export default function ArancelesPage() {
  return (
    <Layout>
      <Helmet>
        <title>Aranceles de obras sociales | Colegio Profesional</title>
        <meta
          name="description"
          content="Esta sección informa sobre aranceles de obras sociales. Consultá aquí las actualizaciones y valores oficiales cuando estén publicados por la institución."
        />
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal as="header" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Aranceles</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Tabla de aranceles por obra social</p>
        </Reveal>
        <EmptyState
          title="Contenido en construcción"
          description="Esta sección estará disponible pronto."
          icon={<Info className="h-8 w-8 text-primary-400" aria-hidden="true" />}
        />
      </div>
    </Layout>
  );
}
