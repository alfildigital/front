import { Helmet } from 'react-helmet-async';
import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  LoaderCircle,
  MessageCircle,
  Printer,
} from 'lucide-react';
import { config } from '@/config';
import { Layout } from '@/components/layout/Layout';
import { buildWhatsAppUrl } from '@/utils/formatters';
import { Reveal } from '@/components/common/Reveal';
/* import { matriculadosService } from '@/api/services/matriculadosService';
import type { Matriculado } from '@/types';
 */
export default function PagoPage() {
  const [copiado, setCopiado] = useState<'alias' | 'cvu' | null>(null);
 /*  const [nroMatricula, setNroMatricula] = useState('');
  const [matriculado, setMatriculado] = useState<Matriculado | null>(null);
  const [busqueda, setBusqueda] = useState<'idle' | 'loading' | 'not-found' | 'error'>('idle'); */

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

  // La consulta usa GET /profesionales?q=... mediante matriculadosService, que mapea
  // el DTO del backend a Matriculado; el servicio valida que el número coincida exactamente.
 /*  const buscarMatricula = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nroMatricula.trim()) return;

    setBusqueda('loading');
    setMatriculado(null);
    try {
      const resultado = await matriculadosService.getByMatricula(nroMatricula);
      setMatriculado(resultado);
      setBusqueda(resultado ? 'idle' : 'not-found');
    } catch {
      setBusqueda('error');
    }
  };

  const fechaMatriculacion = (() => {
    if (!matriculado?.fecha_matriculacion) return null;
    const fecha = new Date(`${matriculado.fecha_matriculacion}T00:00:00`);
    if (Number.isNaN(fecha.getTime())) return null;
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  })(); */

  return (
    <Layout>
      <Helmet>
        <title>Pago online de matrícula profesional | Colegio Profesional</title>
        <meta
          name="description"
          content="Pagá tu matrícula profesional en línea mediante Mercado Pago y consultá los datos de alias y CVU. Si necesitás ayuda, escribinos por WhatsApp en Posadas."
        />
        <link rel="canonical" href="https://colegioedespecial.org.ar/matriculados/pago" />
      </Helmet>
      
      {/*hero*/}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal as="header" className="no-print mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30">
            <CreditCard className="h-7 w-7 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pagar Matrícula</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Realizá el pago en línea a través de Mercado Pago de forma segura.
          </p>
        </Reveal>

        {/* <section className="no-print mx-auto mb-8 max-w-2xl rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800/50">
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Constancia de matrícula</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Consultá el estado registrado con tu número de matrícula.
              </p>
            </div>
          </div>
          <form onSubmit={buscarMatricula} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="nro-matricula">Número de matrícula</label>
            <input
              id="nro-matricula"
              name="nro-matricula"
              autoComplete="off"
              required
              value={nroMatricula}
              onChange={(event) => setNroMatricula(event.target.value)}
              placeholder="Número de matrícula"
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
            />
            <button
              type="submit"
              disabled={busqueda === 'loading'}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-wait disabled:opacity-70"
            >
              {busqueda === 'loading' ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <FileText className="h-4 w-4" aria-hidden="true" />
              )}
              Ver matrícula
            </button>
          </form>
          {busqueda === 'not-found' && (
            <p role="status" className="mt-3 text-sm text-amber-700 dark:text-amber-300">
              No encontramos una matrícula con ese número. Revisá el dato e intentá nuevamente.
            </p>
          )}
          {busqueda === 'error' && (
            <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">
              No se pudo consultar la matrícula. Intentá nuevamente más tarde.
            </p>
          )}
        </section>

        {matriculado && (
          <div className="mb-10">
            <div className="no-print mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-lg border border-secondary-300 bg-white px-4 py-2.5 text-sm font-semibold text-secondary-800 transition-colors hover:bg-secondary-50 dark:border-secondary-700 dark:bg-gray-800 dark:text-secondary-300 dark:hover:bg-gray-700"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                Imprimir / Guardar PDF
              </button>
            </div>
            <article
              id="certificado-matricula"
              className="certificate-print relative isolate mx-auto flex min-h-[600px] max-w-4xl flex-col items-center justify-between overflow-hidden border-[8px] border-double border-secondary-700 bg-white px-8 py-10 text-center text-gray-900 shadow-xl sm:px-14 sm:py-12"
            >
              <img
                src="/imagenes/logo__.webp"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-[-1] h-64 w-64 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08]"
              />
              <header className="relative z-10 flex w-full flex-col items-center">
                <img
                  src="/imagenes/logo__.webp"
                  alt="Logo del Colegio de Profesionales en Educación Especial"
                  className="mb-5 h-20 w-auto object-contain"
                />
                <p className="text-xs font-semibold uppercase text-secondary-700">
                  Colegio de Profesionales en Educación Especial
                </p>
                <h2 className="mt-5 text-2xl font-bold uppercase text-gray-900 sm:text-3xl">
                  Certificado de estado de matrícula
                </h2>
              </header>

              <div className="relative z-10 my-8 max-w-2xl space-y-5 text-base leading-relaxed sm:text-lg">
                <p>
                  Se deja constancia de que el/la profesional
                  <strong className="mx-1 font-bold">{[matriculado.nombre, matriculado.apellido].filter(Boolean).join(' ')}</strong>
                  se encuentra registrado/a bajo la matrícula profesional
                </p>
                <p className="text-2xl font-bold text-secondary-800 sm:text-3xl">
                  N.º {matriculado.nro_matricula}
                </p>
                <p>
                  Estado registrado:{' '}
                  <strong className="font-bold">{matriculado.estado_matricula || 'Sin estado informado'}</strong>
                </p>
                {fechaMatriculacion && (
                  <p className="text-sm text-gray-700">
                    Fecha de matriculación: {fechaMatriculacion}
                  </p>
                )}
              </div>

              <footer className="relative z-10 flex w-full flex-col items-center">
                <p className="mb-6 text-sm text-gray-700">
                  Emitido el {new Date().toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <div className="h-12 w-56" aria-hidden="true" />
                <div className="w-56 border-t border-gray-700 pt-2">
                  <p className="font-semibold">Fabiana Silva</p>
                  <p className="text-sm">Presidenta</p>
                </div>
              </footer>
            </article>
          </div>
        )} */}

        <div className="no-print mx-auto max-w-lg rounded-xl border border-gray-300 bg-gray-50 p-6 shadow-md dark:border-gray-700 dark:bg-gray-800/50">
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
