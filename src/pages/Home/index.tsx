import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, MapPin, Phone, Target, Building2 } from 'lucide-react';
import { SITE_NAME } from '@/config/constants';
import { Layout } from '@/components/layout/Layout';
// import { InstagramCarousel } from '@/components/sections/InstagramCarousel';
import { NoticiasPreview } from '@/components/sections/NoticiasPreview';
//import { TramitesDestacados } from '@/components/sections/TramitesDestacados';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { CardSkeletonGrid } from '@/components/common/Skeleton';
import { useNoticias } from '@/hooks/queries/useNoticias';
// import { useTramites } from '@/hooks/queries/useTramites';
// import { useInstagram } from '@/hooks/queries/useInstagram';

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function Hero() {
  return (
   <section
  className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 py-20 text-white"
  aria-label="Presentación institucional"
>
  {/* Decorative circles */}
  <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/5" aria-hidden="true" />
  <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-8">
      {/* Columna izquierda: 70% */}
      <div className="w-full lg:w-[70%]">
        <div className="max-w-2xl animate-fade-in-up">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Bienvenidos al
            <br />
            <span className="text-secondary-200">{SITE_NAME}</span>
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Servicio y representación para los profesionales. Trámites, información
            institucional y más, en un solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/tramites"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-sm transition-all hover:bg-primary-50 hover:shadow-md"
            >
              Ver Trámites
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/noticias"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Últimas Noticias
            </Link>
          </div>
        </div>

        {/* Quick info */}
        <div className="mt-12 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Phone className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Consultas: (0351) 000-0000</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-secondary-300" aria-hidden="true" />
            <span>Sede Central — Av. Ejemplo 1234</span>
          </div>
        </div>
      </div>

      {/* Columna derecha: 30% — solo la imagen del logo */}
      <div className="flex w-full justify-center lg:w-[30%] lg:justify-end">
        <img
          src="/upscalemedia-transformed.svg"
          alt={`Logo de ${SITE_NAME}`}
          className="className= h-auto w-40 max-w-full rounded-full object-contain opacity-80 shadow-lg sm:w-48 lg:w-full"
        />
      </div>
    </div>
  </div>
</section>
  );
}

function InstitutionalSections() {
  return (
    <>
      <section aria-labelledby="nosotros-title" className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-8">
            {/* Columna izquierda: 80% */}
            <div className="w-full lg:w-[80%]">
              <div className="max-w-3xl">
                <div className="mb-5 flex items-center gap-3 text-primary-600 dark:text-primary-400">
                  <Building2 className="h-6 w-6" aria-hidden="true" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Institución</span>
                </div>
                <h2 id="nosotros-title" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Nosotros
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  El Colegio de Pro en Educación Especial es la institución rectora que agrupa y representa a los profesionales dedicados a la atención, enseñanza y acompañamiento de personas con discapacidad. Somos una comunidad comprometida con la ética profesional, la actualización constante y la defensa de los derechos humanos.

                  Nuestra labor trasciende el aula: trabajamos para garantizar que la educación especial sea un pilar fundamental en la construcción de una sociedad más justa e inclusiva. Agrupamos a expertos en diversas áreas, fomentando el intercambio de experiencias y el desarrollo técnico-científico para brindar respuestas innovadoras a los desafíos educativos actuales.
                </p>
              </div>
            </div>

            {/* Columna derecha: 20% — imagen */}
            <div className="flex w-full items-center justify-center lg:w-[20%] lg:justify-end">
              <div className="flex aspect-square w-full max-w-[12rem] items-center justify-center overflow-hidden rounded-full bg-primary-50 p-4 shadow-lg dark:bg-gray-800">
                <img
                  src="/colegio_autoridades.png"
                  alt="Imagen institucional"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="vision-mision-title" className="bg-gray-50 py-16 dark:bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl">
            <h2 id="vision-mision-title" className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Visión y misión
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Construimos una institución moderna, transparente y al servicio de sus profesionales.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="border-l-4 border-primary-500 bg-white p-6 shadow-sm dark:bg-gray-900">
              <Target className="h-7 w-7 text-primary-600 dark:text-primary-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Misión</h3>
              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Regular, promover y jerarquizar el ejercicio profesional de la Educación Especial, velando por la idoneidad, ética y formación continua de nuestros matriculados. Buscamos garantizar una educación de calidad que potencie las capacidades de cada estudiante, promoviendo su autonomía e inclusión plena en el ámbito social, educativo y labor
              </p>
            </article>
            <article className="border-l-4 border-secondary-500 bg-white p-6 shadow-sm dark:bg-gray-900">
              <Eye className="h-7 w-7 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Visión</h3>
              <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">
                Ser la institución referente a nivel nacional en materia de Educación Especial, reconocida por su excelencia técnica y su capacidad de incidencia en las políticas públicas. Aspiramos a construir una sociedad donde la diversidad sea valorada y donde cada persona con discapacidad tenga garantizado su derecho a aprender y desarrollarse plenamente, de la mano de profesionales altamente calificados.
              </p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------

export default function HomePage() {
  const noticias = useNoticias();
  // const tramites = useTramites();
  // const instagram = useInstagram();

  return (
    <Layout>
      <Helmet>
        <title>{SITE_NAME}</title>
        <meta
          name="description"
          content="Sitio oficial del colegio profesional. Información institucional, trámites, noticias y más."
        />
      </Helmet>

      <Hero />
  <InstitutionalSections />

      {/* Trámites */}
      {/* {tramites.isPending && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CardSkeletonGrid count={4} />
          </div>
        </div>
      )}
      {tramites.isError && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorBanner message="No se pudieron cargar los trámites." onRetry={() => void tramites.refetch()} />
          </div>
        </div>
      )}
      {/* {tramites.data && tramites.data.length > 0 && (
        <TramitesDestacados tramites={tramites.data} />
      )} */}

      {/* Noticias */}
      {noticias.isPending && (
        <div className="py-16 bg-gray-50 dark:bg-gray-800/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CardSkeletonGrid count={3} />
          </div>
        </div>
      )}
      {noticias.isError && (
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorBanner message="No se pudieron cargar las noticias." onRetry={() => void noticias.refetch()} />
          </div>
        </div>
      )}
      {noticias.data && noticias.data.length > 0 && (
        <NoticiasPreview noticias={noticias.data.slice(0, 3)} />
      )}

      {/* Instagram — se oculta si no hay posts, sin EmptyState */}
      {/* {instagram.data && instagram.data.length > 0 && (
        <InstagramCarousel posts={instagram.data} />
      )} */}
    </Layout>
  );
}