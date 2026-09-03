import { Helmet } from 'react-helmet-async';
import { ExternalLink, MessageCircle, CreditCard, AlertCircle } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { config } from '@/config';
import { Layout } from '@/components/layout/Layout';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Spinner } from '@/components/common/Spinner';
import { usePagoMatricula } from '@/hooks/queries/useMatriculados';
import { buildWhatsAppUrl } from '@/utils/formatters';

export default function PagoPage() {
  const { data, isPending, isError, refetch } = usePagoMatricula();

  const whatsappUrl = buildWhatsAppUrl(
    config.whatsapp.number,
    'Hola, quiero consultar sobre el pago de matrícula.',
  );

  return (
    <Layout>
      <Helmet>{/*todo lo que se muestra aca es la información del título y meta tags en la pestaña*/}
        <title>Pagar Matrícula — {SITE_NAME}</title>
        <meta name="description" content="Pagá tu matrícula de forma segura a través de Mercado Pago." />
      </Helmet>
      
      {/*hero*/}
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
            <CreditCard className="h-7 w-7 text-primary-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pagar Matrícula</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Realizá el pago en línea a través de Mercado Pago de forma segura.
          </p>
        </header>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-6 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/10">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500" aria-hidden="true" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium">Información importante</p>
              <p className="mt-1">
                Al hacer clic en "Pagar con Mercado Pago" serás redirigido al sitio oficial de
                Mercado Pago para completar tu pago de forma segura.
              </p>
            </div>
          </div>

          {isPending && (
            <div className="flex justify-center py-6">
              <Spinner label="Preparando pago..." />
            </div>
          )}

          {isError && (
            <ErrorBanner
              message="No se pudo obtener el enlace de pago. Reintentá o contactá por WhatsApp."
              onRetry={refetch}
            />
          )}

          {data && (
            <a
              href={data.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md active:scale-95"
            >
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              Pagar con Mercado Pago
              <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
            </a>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">o</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-secondary-300 px-6 py-3 text-sm font-medium text-secondary-700 transition-all hover:bg-secondary-50 dark:border-secondary-700 dark:text-secondary-400 dark:hover:bg-secondary-900/10"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Consultar por WhatsApp
          </a>
        </div>
      </div>
    </Layout>
  );
}
