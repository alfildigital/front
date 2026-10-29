import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, CreditCard, AlertCircle } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { config } from '@/config';
import { Layout } from '@/components/layout/Layout';
import { buildWhatsAppUrl } from '@/utils/formatters';
import { Reveal } from '@/components/common/Reveal';

export default function PagoPage() {
  const [copiado, setCopiado] = useState<'alias' | 'cvu' | null>(null);

  const whatsappUrl = buildWhatsAppUrl(
    config.whatsapp.number,
    'Hola, quiero consultar sobre el pago de matrícula.',
  );

  const copiarDato = async (dato: 'alias' | 'cvu', valor: string) => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(dato);
    } catch {
      setCopiado(null);
      console.error(`No se pudo copiar el ${dato} al portapapeles.`);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Pago de matrícula del Colegio de Educación Especial en Posadas | Mercado Pago</title>
        <meta
          name="description"
          content="Información para pagar la matrícula del Colegio de Profesionales en Educación Especial en Posadas, Misiones a través de Mercado Pago, alias y CVU."
        />
        <link rel="canonical" href="https://colegioedespecial.org.ar/matriculados/pago" />
      </Helmet>
      
      {/*hero*/}
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <Reveal as="header" className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
            <CreditCard className="h-7 w-7 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pagar Matrícula</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Realizá el pago en línea a través de Mercado Pago de forma segura.
          </p>
        </Reveal>

        <div className="rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800/50">
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

          <section
            aria-labelledby="datos-transferencia"
            className="mt-6 rounded-xl border border-secondary-300 bg-primary-100/20 p-6 shadow-md hover:shadow-primary-500/20 dark:border-primary-700 dark:bg-gray-800/50 dark:hover:shadow-secondary-500/20"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
                <img
                  src="https://cdn.simpleicons.org/mercadopago/009EE3"
                  alt="Logo de Mercado Pago"
                  className="h-8 w-8"
                />
              </div>
              <h2 id="datos-transferencia" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mercado Pago
              </h2>
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Alias</dt>
                <dd className="flex items-center justify-between gap-3 font-medium text-gray-900 dark:text-gray-100">
                  <span>colegio.misiones.mp</span>
                  <button
                    type="button"
                    onClick={() => copiarDato('alias', 'colegio.misiones.mp')}
                    aria-label={copiado === 'alias' ? 'Alias copiado' : 'Copiar alias'}
                    title={copiado === 'alias' ? 'Copiado' : 'Copiar'}
                    className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    {copiado === 'alias' ? (
                      <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">CVU</dt>
                <dd className="flex items-center justify-between gap-3 font-mono font-medium text-gray-900 dark:text-gray-100">
                  <span className="break-all">0000003100051012180633</span>
                  <button
                    type="button"
                    onClick={() => copiarDato('cvu', '0000003100051012180633')}
                    aria-label={copiado === 'cvu' ? 'CVU copiado' : 'Copiar CVU'}
                    title={copiado === 'cvu' ? 'Copiado' : 'Copiar'}
                    className="shrink-0 rounded-md p-2 font-sans text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  >
                    {copiado === 'cvu' ? (
                      <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Nombre</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                    Asociacion Colegio De Profesionales De Ed
                </dd>
              </div>
            </dl>
            <a
              href="https://mpago.la/22aV8yP"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-600 hover:shadow-md active:scale-95"
            >
              <CreditCard className="h-5 w-5" aria-hidden="true" />
              Pagar con Mercado Pago
              <ExternalLink className="h-4 w-4 opacity-70" aria-hidden="true" />
            </a>
          </section>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">o consultá</span>
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
