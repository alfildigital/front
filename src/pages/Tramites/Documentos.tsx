import { Helmet } from 'react-helmet-async';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { PdfCard } from '@/components/common/PdfCard';
import { documentos } from '@/data/tramitesRecursos';

export default function DocumentosPage() {
  return (
    <Layout>
      <Helmet><title>Documentos — {SITE_NAME}</title><meta name="description" content="Documentos institucionales disponibles para consultar y descargar en PDF." /></Helmet>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8"><h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Documentos</h1><p className="mt-2 text-gray-500 dark:text-gray-400">Normativas y documentos institucionales en PDF</p></header>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {documentos.map((resource) => <PdfCard key={resource.id} resource={resource} />)}
        </div>
      </div>
    </Layout>
  );
}