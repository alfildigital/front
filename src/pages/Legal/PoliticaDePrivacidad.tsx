import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
import { politicaDePrivacidad } from '@/legal/privacidad';

/**
 * PoliticaDePrivacidadPage
 *
 * Página independiente accesible en /politica-de-privacidad.
 * Renderiza el contenido de src/legal/privacidad.ts en formato legible.
 *
 * El contenido es editable directamente en src/legal/privacidad.ts
 * sin necesidad de tocar este componente.
 */
export default function PoliticaDePrivacidadPage() {
  const doc = politicaDePrivacidad;

  return (
    <Layout>
      <Helmet>
        <title>Política de Privacidad — {SITE_NAME}</title>
        <meta
          name="description"
          content="Política de Privacidad del sitio web institucional. Conforme a la Ley 25.326 de Protección de Datos Personales."
        />
      </Helmet>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 dark:bg-secondary-900/30">
            <ShieldCheck className="h-6 w-6 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{doc.titulo}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Versión {doc.version} · Vigente desde{' '}
            {new Date(doc.fechaVigencia + 'T00:00:00').toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {doc.subtitulo && (
            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
              {doc.subtitulo}
            </p>
          )}
        </header>

        {/* Índice */}
        <nav
          aria-label="Índice del documento"
          className="mb-10 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/50"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Contenido
          </p>
          <ol className="space-y-1">
            {doc.secciones.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-primary-600 hover:text-primary-800 hover:underline dark:text-primary-400 dark:hover:text-primary-300"
                >
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Secciones */}
        <article className="space-y-8">
          {doc.secciones.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`h-${s.id}`}>
              <h2
                id={`h-${s.id}`}
                className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200"
              >
                {s.titulo}
              </h2>
              <div className="space-y-3">
                {s.parrafos.map((p, i) => (
                  <p
                    key={i}
                    className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-400"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* Pie */}
        <footer className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            También podés consultar nuestros{' '}
            <Link
              to="/terminos-y-condiciones"
              className="text-primary-600 underline hover:text-primary-800 dark:text-primary-400"
            >
              Términos y Condiciones
            </Link>
            .
          </p>
        </footer>
      </div>
    </Layout>
  );
}
