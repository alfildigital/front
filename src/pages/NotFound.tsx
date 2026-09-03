import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <Helmet>
        <title>Página no encontrada — {SITE_NAME}</title>
      </Helmet>

      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-black text-primary-200 dark:text-primary-900 select-none">404</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Página no encontrada
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          La dirección que buscás no existe o fue movida.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
}
